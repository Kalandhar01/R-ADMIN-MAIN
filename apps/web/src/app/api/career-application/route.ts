import { Buffer } from "node:buffer";
import { createHash, randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { Prisma, type CareerApplication } from "@prisma/client";
import nodemailer, { type Transporter } from "nodemailer";
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/server/prisma";
import {
  EmailLayout,
  getRactyshEmailBrand,
  senderFromEnv
} from "@/lib/server/ractyshEmail";
import { elapsedMs, logSubmissionTiming, runBackgroundJob } from "@/lib/server/backgroundJobs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_RESUME_SIZE = 15 * 1024 * 1024;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const resumeExtensions = [".pdf", ".doc", ".docx"];
const resumeMimeTypes = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/octet-stream"
];

const applicationSchema = z.object({
  position: z.string().trim().min(1, "Position is required.").max(140, "Position is too long."),
  fullName: z.string().trim().min(1, "Please enter your full name.").max(120, "Full name is too long."),
  email: z
    .string()
    .trim()
    .min(1, "Please enter your email.")
    .max(180, "Email is too long.")
    .refine((value) => value.length === 0 || emailPattern.test(value), "Please enter a valid email."),
  phone: z.string().trim().min(1, "Please enter your phone number.").max(40, "Phone number is too long."),
  experience: z.string().trim().min(1, "Please enter your total experience.").max(120, "Experience is too long."),
  message: z
    .string()
    .trim()
    .min(1, "Please share why you want to join Ractysh.")
    .max(4000, "Message is too long."),
  portfolio: z.string().trim().max(240, "Portfolio link is too long.").optional()
});

type ApplicationPayload = z.infer<typeof applicationSchema>;

type ApiValidationIssue = {
  path: string[];
  message: string;
};

type CloudinaryUploadResult = {
  secure_url?: string;
  public_id?: string;
  resource_type?: string;
};

type ResumeStorageResult = {
  url: string;
  provider: "cloudinary" | "local";
  providerId?: string;
};

type DatabaseSaveResult =
  | {
      ok: true;
      application: CareerApplication;
    }
  | {
      ok: false;
      status: number;
      message: string;
      error: string;
      code?: string;
    };

type EmailSendResult =
  | {
      ok: true;
      messageId?: string;
      accepted?: string[];
      sentAt: string;
    }
  | {
      ok: false;
      status: number;
      message: string;
      error: string;
      missing?: string[];
    };

type SmtpConfig = {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  from: string;
  to: string[];
};

const globalForCareerMailer = globalThis as unknown as {
  careerSmtpTransporter?: Transporter;
  careerSmtpKey?: string;
};

function textFromFormData(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function normalizeFormPayload(formData: FormData): ApplicationPayload {
  const position = textFromFormData(formData, "position") || textFromFormData(formData, "jobRole");
  const portfolio = textFromFormData(formData, "portfolio");

  return {
    position,
    fullName: textFromFormData(formData, "fullName"),
    email: textFromFormData(formData, "email"),
    phone: textFromFormData(formData, "phone"),
    experience: textFromFormData(formData, "experience"),
    message: textFromFormData(formData, "message"),
    portfolio: portfolio || undefined
  };
}

function isUploadedFile(value: FormDataEntryValue | null): value is File {
  return typeof value !== "string" && Boolean(value?.name) && typeof value?.size === "number" && value.size > 0;
}

function isAllowedResume(file: File): boolean {
  const lowerName = file.name.toLowerCase();

  return resumeMimeTypes.includes(file.type) || resumeExtensions.some((extension) => lowerName.endsWith(extension));
}

function validateResume(file: File | null): ApiValidationIssue[] {
  if (!file) {
    return [{ path: ["resume"], message: "Please upload your resume." }];
  }

  if (file.size > MAX_RESUME_SIZE) {
    return [{ path: ["resume"], message: "Resume must be 15MB or less." }];
  }

  if (!isAllowedResume(file)) {
    return [{ path: ["resume"], message: "Upload a PDF, DOC or DOCX resume." }];
  }

  return [];
}

function displayValue(value: string | undefined | null): string {
  const trimmed = value?.trim();
  return trimmed ? trimmed : "Not provided";
}

function parseEmailList(value: string | undefined): string[] {
  const parsed = (value || "")
    .split(",")
    .map((recipient) => recipient.trim())
    .filter((recipient) => emailPattern.test(recipient));

  return [...new Set(parsed)];
}

function errorDetails(error: unknown): { code?: string; message: string; name?: string } {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return { code: error.code, message: error.message, name: error.name };
  }

  if (error instanceof Prisma.PrismaClientInitializationError) {
    return { code: error.errorCode, message: error.message, name: error.name };
  }

  if (error instanceof Error) {
    return { message: error.message, name: error.name };
  }

  return { message: "Unknown career application error." };
}

function logCareerApplication(
  level: "info" | "error",
  event: string,
  details: Record<string, unknown> = {}
) {
  const entry = {
    event,
    ...details
  };

  if (level === "error") {
    console.error("[career-application]", entry);
    return;
  }

  console.info("[career-application]", entry);
}

function errorResponse(
  status: number,
  code: string,
  message: string,
  body: Record<string, unknown> = {}
) {
  return NextResponse.json(
    {
      success: false,
      code,
      message,
      ...body
    },
    { status }
  );
}

function cloudinarySignature(params: Record<string, string>, apiSecret: string): string {
  const serialized = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");

  return createHash("sha1").update(`${serialized}${apiSecret}`).digest("hex");
}

async function uploadResumeToCloudinary(resume: File): Promise<CloudinaryUploadResult | null> {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) return null;

  const timestamp = String(Math.floor(Date.now() / 1000));
  const folder = process.env.CLOUDINARY_CAREERS_FOLDER || "ractysh-career-applications";
  const signature = cloudinarySignature({ folder, timestamp }, apiSecret);
  const uploadForm = new FormData();

  uploadForm.append("file", resume, resume.name);
  uploadForm.append("folder", folder);
  uploadForm.append("timestamp", timestamp);
  uploadForm.append("api_key", apiKey);
  uploadForm.append("signature", signature);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
    method: "POST",
    body: uploadForm
  });

  if (!response.ok) {
    throw new Error(await response.text().catch(() => "Cloudinary upload failed."));
  }

  return (await response.json()) as CloudinaryUploadResult;
}

function safeResumeFilename(originalName: string): string {
  const extension = path.extname(originalName).toLowerCase() || ".bin";
  const basename =
    path
      .basename(originalName, extension)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 80) || "resume";

  return `${Date.now()}-${randomUUID()}-${basename}${extension}`;
}

async function saveResumeLocally(resume: File, resumeBuffer: Buffer): Promise<ResumeStorageResult> {
  const filename = safeResumeFilename(resume.name);
  const uploadDir = path.join(process.cwd(), "public", "uploads", "careers");
  const uploadPath = path.join(uploadDir, filename);

  await mkdir(uploadDir, { recursive: true });
  await writeFile(uploadPath, resumeBuffer);

  return {
    url: `/uploads/careers/${filename}`,
    provider: "local"
  };
}

async function storeResume(resume: File, resumeBuffer: Buffer): Promise<ResumeStorageResult> {
  const cloudinaryUpload = await uploadResumeToCloudinary(resume);

  if (cloudinaryUpload) {
    if (!cloudinaryUpload.secure_url) {
      throw new Error("Cloudinary did not return a resume URL.");
    }

    return {
      url: cloudinaryUpload.secure_url,
      provider: "cloudinary",
      providerId: cloudinaryUpload.public_id
    };
  }

  return saveResumeLocally(resume, resumeBuffer);
}

function publicResumeLink(request: Request, resumeUrl: string): string {
  try {
    return new URL(resumeUrl, request.url).href;
  } catch {
    return resumeUrl;
  }
}

async function persistCareerApplication(payload: ApplicationPayload, resumeUrl: string): Promise<DatabaseSaveResult> {
  if (!process.env.DATABASE_URL) {
    const error = "DATABASE_URL is not configured.";
    logCareerApplication("error", "database_save_failed", { error, position: payload.position });

    return {
      ok: false,
      status: 503,
      message: "Database save failed.",
      error
    };
  }

  try {
    const application = await prisma.careerApplication.create({
      data: {
        fullName: payload.fullName,
        email: payload.email,
        phone: payload.phone,
        position: payload.position,
        experience: payload.experience,
        message: payload.message,
        resumeUrl,
        portfolioUrl: payload.portfolio || null,
        coverLetter: payload.message
      }
    });

    logCareerApplication("info", "database_save_success", {
      applicationId: application.id,
      position: application.position
    });

    return { ok: true, application };
  } catch (error) {
    const details = errorDetails(error);
    logCareerApplication("error", "database_save_failed", {
      ...details,
      position: payload.position
    });

    return {
      ok: false,
      status: details.code === "P1001" || details.code === "P1017" ? 503 : 500,
      message: "Database save failed.",
      error: details.message,
      code: details.code
    };
  }
}

function smtpConfig(): SmtpConfig | { missing: string[] } {
  const host = process.env.SMTP_HOST || (process.env.RESEND_API_KEY ? "smtp.resend.com" : "");
  const portValue = process.env.SMTP_PORT || (host === "smtp.resend.com" ? "465" : "");
  const port = Number(portValue);
  const user = process.env.SMTP_USER || (process.env.RESEND_API_KEY ? "resend" : "");
  const pass = process.env.SMTP_PASS || process.env.RESEND_API_KEY || "";
  const from = senderFromEnv("CAREERS_MAIL_FROM", "MAIL_FROM", "CONSULTATION_NOTIFY_FROM", "RESEND_FROM") || "";
  const to = parseEmailList(
    process.env.CAREERS_RECEIVER_EMAIL ||
      process.env.CAREERS_MAIL_TO ||
      process.env.MAIL_TO ||
      process.env.CONSULTATION_NOTIFY_TO
  );
  const missing: string[] = [];

  if (!host) missing.push("SMTP_HOST");
  if (!port || Number.isNaN(port)) missing.push("SMTP_PORT");
  if (!user) missing.push("SMTP_USER");
  if (!pass) missing.push("SMTP_PASS");
  if (!from) missing.push("CAREERS_MAIL_FROM/MAIL_FROM");
  if (!to.length) missing.push("CAREERS_RECEIVER_EMAIL/CAREERS_MAIL_TO/MAIL_TO");

  if (missing.length) {
    return { missing };
  }

  return {
    host,
    port,
    secure: process.env.SMTP_SECURE ? process.env.SMTP_SECURE === "true" : port === 465,
    user,
    pass,
    from,
    to
  };
}

function careerMailer(config: SmtpConfig): Transporter {
  const key = `${config.host}:${config.port}:${config.secure}:${config.user}`;

  if (!globalForCareerMailer.careerSmtpTransporter || globalForCareerMailer.careerSmtpKey !== key) {
    globalForCareerMailer.careerSmtpTransporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: {
        user: config.user,
        pass: config.pass
      }
    });
    globalForCareerMailer.careerSmtpKey = key;
  }

  return globalForCareerMailer.careerSmtpTransporter;
}

function careerEmailRows(payload: {
  application: CareerApplication;
  resumeLink: string;
  submittedAt: string;
}): Array<[string, string]> {
  return [
    ["Candidate Name", payload.application.fullName],
    ["Email", payload.application.email],
    ["Phone", displayValue(payload.application.phone)],
    ["Position", payload.application.position],
    ["Experience", payload.application.experience],
    ["Resume Link", payload.resumeLink],
    ["Submission Time", payload.submittedAt],
    ["Application ID", payload.application.id]
  ];
}

function buildPlainTextEmail(payload: {
  application: CareerApplication;
  resumeLink: string;
  submittedAt: string;
}): string {
  return [
    ...careerEmailRows(payload).map(([label, value]) => `${label}: ${value}`),
    "",
    "Message:",
    payload.application.message
  ].join("\n");
}

function buildHtmlEmail(payload: {
  application: CareerApplication;
  resumeLink: string;
  submittedAt: string;
  request: Request;
}): string {
  return EmailLayout({
    brand: getRactyshEmailBrand(payload.request),
    eyebrow: "Human Resources Desk",
    title: "New career application received",
    previewText: `${payload.application.fullName} applied for ${payload.application.position}`,
    sections: [
      {
        title: "Candidate Information",
        fields: [
          { label: "Candidate Name", value: payload.application.fullName },
          { label: "Email", value: payload.application.email, href: `mailto:${payload.application.email}` },
          { label: "Phone", value: payload.application.phone },
          { label: "Position", value: payload.application.position },
          { label: "Experience", value: payload.application.experience },
          { label: "Resume Link", value: payload.resumeLink, href: payload.resumeLink },
          { label: "Submission Time", value: payload.submittedAt }
        ]
      },
      {
        title: "Message",
        body: payload.application.message
      }
    ]
  });
}

async function sendCareerEmail(payload: {
  application: CareerApplication;
  request: Request;
  resume: File;
  resumeBuffer: Buffer;
}): Promise<EmailSendResult> {
  const config = smtpConfig();

  if ("missing" in config) {
    const error = `Missing environment variables: ${config.missing.join(", ")}.`;
    logCareerApplication("error", "email_send_failed", {
      applicationId: payload.application.id,
      error
    });

    return {
      ok: false,
      status: 503,
      message: "Email send failed.",
      error,
      missing: config.missing
    };
  }

  try {
    const submittedAt = payload.application.createdAt.toISOString();
    const resumeLink = publicResumeLink(payload.request, payload.application.resumeUrl || "");
    const info = await careerMailer(config).sendMail({
      from: config.from,
      to: config.to,
      replyTo: payload.application.email,
      subject: `New Ractysh Career Application - ${payload.application.position}`,
      text: buildPlainTextEmail({
        application: payload.application,
        resumeLink,
        submittedAt
      }),
      html: buildHtmlEmail({
        application: payload.application,
        resumeLink,
        submittedAt,
        request: payload.request
      }),
      attachments: [
        {
          filename: payload.resume.name,
          content: payload.resumeBuffer,
          contentType: payload.resume.type || "application/octet-stream"
        }
      ]
    });

    logCareerApplication("info", "email_send_success", {
      applicationId: payload.application.id,
      messageId: info.messageId,
      accepted: info.accepted
    });

    return {
      ok: true,
      messageId: info.messageId,
      accepted: info.accepted as string[] | undefined,
      sentAt: new Date().toISOString()
    };
  } catch (error) {
    const details = errorDetails(error);
    logCareerApplication("error", "email_send_failed", {
      applicationId: payload.application.id,
      ...details
    });

    return {
      ok: false,
      status: 502,
      message: "Email send failed.",
      error: details.message
    };
  }
}

export async function POST(request: Request) {
  const requestId = randomUUID();
  const startedAt = performance.now();

  try {
    const contentType = request.headers.get("content-type") || "";
    logCareerApplication("info", "request_received", {
      requestId,
      contentType: contentType.split(";")[0] || "unknown"
    });

    if (!contentType.includes("multipart/form-data")) {
      return errorResponse(415, "VALIDATION_FAILED", "Validation failed.", {
        requestId,
        issues: [{ path: ["content-type"], message: "Career applications must be submitted as multipart form data." }]
      });
    }

    let formData: FormData;

    try {
      formData = await request.formData();
    } catch (error) {
      const details = errorDetails(error);
      logCareerApplication("error", "file_upload_failed", {
        requestId,
        ...details
      });

      return errorResponse(400, "FILE_UPLOAD_FAILED", "File upload failed.", {
        requestId,
        error: details.message
      });
    }

    const normalizedPayload = normalizeFormPayload(formData);
    const parsed = applicationSchema.safeParse(normalizedPayload);
    const resume = formData.get("resume");
    const uploadedResume = isUploadedFile(resume) ? resume : null;
    const resumeIssues = validateResume(uploadedResume);

    if (!parsed.success || resumeIssues.length || !uploadedResume) {
      const issues: ApiValidationIssue[] = [
        ...(parsed.success
          ? []
          : parsed.error.issues.map((issue) => ({
              path: issue.path.map(String),
              message: issue.message
            }))),
        ...resumeIssues
      ];

      logCareerApplication("error", "validation_failed", {
        requestId,
        issues
      });

      return errorResponse(400, "VALIDATION_FAILED", "Validation failed.", {
        requestId,
        issues
      });
    }

    logCareerApplication("info", "payload_validated", {
      requestId,
      position: parsed.data.position,
      email: parsed.data.email,
      resume: {
        filename: uploadedResume.name,
        mimeType: uploadedResume.type || "application/octet-stream",
        size: uploadedResume.size
      }
    });

    runBackgroundJob(
      "career-application-submission",
      async () => {
        const resumeReadStartedAt = performance.now();
        const resumeBuffer = Buffer.from(await uploadedResume.arrayBuffer());
        const resumeReadMs = elapsedMs(resumeReadStartedAt);
        const storageStartedAt = performance.now();
        const resumeStorage = await storeResume(uploadedResume, resumeBuffer);
        const storageMs = elapsedMs(storageStartedAt);

        logCareerApplication("info", "file_upload_success", {
          requestId,
          provider: resumeStorage.provider,
          resumeUrl: resumeStorage.url,
          storageMs
        });

        const dbStartedAt = performance.now();
        const stored = await persistCareerApplication(parsed.data, resumeStorage.url);
        const dbMs = elapsedMs(dbStartedAt);

        if (!stored.ok) {
          logSubmissionTiming("career-application-background", {
            requestId,
            success: false,
            resumeReadMs,
            storageMs,
            dbMs,
            storageCode: stored.code
          });
          return;
        }

        const emailStartedAt = performance.now();
        const notification = await sendCareerEmail({
          application: stored.application,
          request,
          resume: uploadedResume,
          resumeBuffer
        });

        logSubmissionTiming("career-application-email", {
          requestId,
          applicationId: stored.application.id,
          sent: notification.ok,
          emailMs: elapsedMs(emailStartedAt),
            error: notification.ok ? undefined : notification.error
        });

        logSubmissionTiming("career-application-background", {
          requestId,
          success: true,
          applicationId: stored.application.id,
          resumeReadMs,
          storageMs,
          dbMs,
          emailQueued: true
        });
      },
      { requestId, email: parsed.data.email, position: parsed.data.position }
    );

    logSubmissionTiming("career-application", {
      requestId,
      success: true,
      totalMs: elapsedMs(startedAt),
      backgroundQueued: true
    });

    return NextResponse.json(
      {
        success: true,
        requestId,
        emailQueued: true,
        submittedAt: new Date().toISOString(),
        message: "Request received."
      },
      { status: 202 }
    );
  } catch (error) {
    const details = errorDetails(error);
    logCareerApplication("error", "submission_failed", {
      requestId,
      ...details
    });

    return errorResponse(500, "APPLICATION_SUBMISSION_FAILED", "Application submission failed before completion.", {
      requestId,
      error: details.message
    });
  }
}
