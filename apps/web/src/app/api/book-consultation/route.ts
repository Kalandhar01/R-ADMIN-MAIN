import { Buffer } from "node:buffer";
import { NextResponse } from "next/server";
import type { Attachment } from "resend";
import { z } from "zod";
import { inferDivisionFromText, normalizeDivisionKey } from "@ractysh/shared";
import {
  createFallbackConsultationRecord,
  updateFallbackConsultationNotification
} from "@/lib/consultationWorkflowFallback";
import { getRactyshEmailBrand } from "@/emails/branding";
import { renderInquiryNotificationEmail } from "@/emails/InquiryNotificationEmail";
import { elapsedMs, logSubmissionTiming, runBackgroundJob } from "@/lib/server/backgroundJobs";
import { parseEmailList, sendResendEmail } from "@/lib/server/emailDelivery";
import { senderFromEnv } from "@/lib/server/ractyshEmail";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_FILES = 5;
const MAX_FILE_SIZE = 15 * 1024 * 1024;
const MAX_TOTAL_ATTACHMENT_SIZE = 35 * 1024 * 1024;
const RATE_LIMIT_WINDOW_MS = 10 * 60_000;
const RATE_LIMIT_MAX_REQUESTS = 8;
const DEFAULT_RECIPIENT = "noorulsmart1998@gmail.com";
const DEFAULT_API_URL = "http://localhost:5000";
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const rateLimitBuckets = new Map<string, { count: number; resetAt: number }>();

const allowedExtensions = [".pdf", ".jpg", ".jpeg", ".png", ".webp", ".heic", ".heif", ".dwg", ".dxf", ".ifc", ".rvt"];
const allowedMimeTypes = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
  "application/acad",
  "application/x-acad",
  "application/autocad_dwg",
  "application/x-autocad",
  "application/dwg",
  "application/x-dwg",
  "application/octet-stream"
];

const consultationSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(1, "Please enter your name.")
    .max(120, "Name is too long."),
  emailAddress: z
    .string()
    .trim()
    .min(1, "Please enter your email.")
    .max(180, "Email is too long.")
    .refine((value) => value.length === 0 || emailPattern.test(value), "Please enter a valid email."),
  companyName: z
    .string()
    .trim()
    .min(1, "Please enter your company.")
    .max(160, "Company is too long."),
  serviceType: z
    .string()
    .trim()
    .min(1, "Please select a consultation topic.")
    .max(120, "Consultation topic is too long."),
  division: z.string().trim().max(80).optional(),
  projectDescription: z
    .string()
    .trim()
    .min(1, "Please enter your message.")
    .max(4000, "Message is too long."),
  phoneNumber: z.string().trim().max(40, "Phone number is too long.").optional(),
  budgetRange: z.string().trim().max(80, "Budget range is too long.").optional(),
  projectTimeline: z.string().trim().max(80, "Project timeline is too long.").optional(),
  preferredConsultationType: z.string().trim().max(80, "Consultation type is too long.").optional()
});

type ConsultationPayload = z.infer<typeof consultationSchema>;

type ApiValidationIssue = {
  path: string[];
  message: string;
};

type SubmissionNotification = {
  sent: boolean;
  skipped?: boolean;
  error?: string;
  sentAt?: string;
};

type ConsultationWorkflowRecord = {
  _id?: string;
  id?: string;
  trackingToken?: string;
  notification?: SubmissionNotification;
};

type BackendConsultationResponse = {
  message?: string;
  consultation?: ConsultationWorkflowRecord;
};

type WorkflowSubmissionResult = {
  consultation?: ConsultationWorkflowRecord;
  error?: string;
  fallback?: boolean;
};

function textFromFormData(formData: FormData, ...keys: string[]): string {
  for (const key of keys) {
    const value = formData.get(key);
    if (typeof value === "string") return value;
  }

  return "";
}

function textFromJson(payload: Record<string, unknown>, ...keys: string[]): string {
  for (const key of keys) {
    const value = payload[key];
    if (typeof value === "string") return value;
  }

  return "";
}

function isUploadedFile(value: FormDataEntryValue): value is File {
  return typeof value !== "string" && typeof value.name === "string" && value.name.length > 0 && value.size > 0;
}

function getUploadedFiles(formData: FormData | null): File[] {
  if (!formData) return [];
  return formData.getAll("requirementFiles").filter(isUploadedFile);
}

function validateFiles(files: File[]): ApiValidationIssue[] {
  if (files.length > MAX_FILES) {
    return [{ path: ["requirementFiles"], message: "Upload up to 5 files." }];
  }

  const tooLarge = files.find((file) => file.size > MAX_FILE_SIZE);
  if (tooLarge) {
    return [{ path: ["requirementFiles"], message: "Each file must be 15MB or less." }];
  }

  const totalSize = files.reduce((total, file) => total + file.size, 0);
  if (totalSize > MAX_TOTAL_ATTACHMENT_SIZE) {
    return [{ path: ["requirementFiles"], message: "Combined uploads must be 35MB or less." }];
  }

  const unsupported = files.find((file) => {
    const lowerName = file.name.toLowerCase();
    return (
      !file.type.startsWith("image/") &&
      !allowedMimeTypes.includes(file.type) &&
      !allowedExtensions.some((extension) => lowerName.endsWith(extension))
    );
  });

  if (unsupported) {
    return [{ path: ["requirementFiles"], message: "Upload PDFs, images or blueprint files only." }];
  }

  return [];
}

function normalizeFormPayload(formData: FormData): ConsultationPayload {
  return {
    fullName: textFromFormData(formData, "fullName", "name"),
    emailAddress: textFromFormData(formData, "emailAddress", "email"),
    companyName: textFromFormData(formData, "companyName", "company"),
    serviceType: textFromFormData(formData, "serviceType", "consultationTopic"),
    division: textFromFormData(formData, "division"),
    projectDescription: textFromFormData(formData, "projectDescription", "message"),
    phoneNumber: textFromFormData(formData, "phoneNumber", "phone"),
    budgetRange: textFromFormData(formData, "budgetRange"),
    projectTimeline: textFromFormData(formData, "projectTimeline"),
    preferredConsultationType: textFromFormData(formData, "preferredConsultationType")
  };
}

function normalizeJsonPayload(payload: Record<string, unknown>): ConsultationPayload {
  return {
    fullName: textFromJson(payload, "fullName", "name"),
    emailAddress: textFromJson(payload, "emailAddress", "email"),
    companyName: textFromJson(payload, "companyName", "company"),
    serviceType: textFromJson(payload, "serviceType", "consultationTopic"),
    division: textFromJson(payload, "division"),
    projectDescription: textFromJson(payload, "projectDescription", "message"),
    phoneNumber: textFromJson(payload, "phoneNumber", "phone"),
    budgetRange: textFromJson(payload, "budgetRange"),
    projectTimeline: textFromJson(payload, "projectTimeline"),
    preferredConsultationType: textFromJson(payload, "preferredConsultationType")
  };
}

async function buildEmailContent(payload: ConsultationPayload, submittedAt: string, files: File[], request: Request) {
  return renderInquiryNotificationEmail({
    adminPath: "/admin/operations",
    brand: getRactyshEmailBrand(request),
    clientName: payload.fullName,
    company: payload.companyName,
    email: payload.emailAddress,
    message: payload.projectDescription,
    phone: payload.phoneNumber,
    receivedAt: submittedAt,
    requestedService: payload.serviceType,
    sourceLabel: "Book Consultation",
    extraDetails: [
      { label: "Budget Range", value: payload.budgetRange },
      { label: "Project Timeline", value: payload.projectTimeline },
      { label: "Consultation Type", value: payload.preferredConsultationType },
      {
        label: "Uploaded Files",
        value: files.length
          ? files.map((file) => `${file.name} (${Math.round(file.size / 1024)} KB)`).join(", ")
          : "No files uploaded"
      },
      { label: "Received At", value: submittedAt }
    ]
  });
}

async function buildAttachments(files: File[]): Promise<Attachment[]> {
  return Promise.all(
    files.map(async (file) => ({
      filename: file.name,
      content: Buffer.from(await file.arrayBuffer()),
      contentType: file.type || undefined
    }))
  );
}

function mailRecipients(): string[] {
  const recipients = parseEmailList(process.env.CONSULTATION_NOTIFY_TO || process.env.MAIL_TO, DEFAULT_RECIPIENT);

  return recipients.length ? recipients : [DEFAULT_RECIPIENT];
}

function getBackendApiUrl(): string {
  return (process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_URL).replace(/\/+$/, "");
}

function clientIdentifier(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwardedFor || request.headers.get("x-real-ip") || "anonymous";
}

function rateLimitRetryAfter(request: Request): number | null {
  const now = Date.now();
  const key = clientIdentifier(request);

  if (rateLimitBuckets.size > 1000) {
    for (const [bucketKey, bucket] of rateLimitBuckets) {
      if (bucket.resetAt <= now) rateLimitBuckets.delete(bucketKey);
    }
  }

  const bucket = rateLimitBuckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    rateLimitBuckets.set(key, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS
    });
    return null;
  }

  bucket.count += 1;

  if (bucket.count <= RATE_LIMIT_MAX_REQUESTS) {
    return null;
  }

  return Math.ceil((bucket.resetAt - now) / 1000);
}

async function createWorkflowRecord(
  payload: ConsultationPayload,
  files: File[],
  skipNotification: boolean
): Promise<WorkflowSubmissionResult> {
  const apiUrl = getBackendApiUrl();
  const workflowForm = new FormData();

  workflowForm.append("fullName", payload.fullName);
  workflowForm.append("companyName", payload.companyName);
  workflowForm.append("emailAddress", payload.emailAddress);
  workflowForm.append("phoneNumber", payload.phoneNumber || "");
  workflowForm.append("serviceType", payload.serviceType);
  workflowForm.append("division", payload.division || inferDivisionFromText(payload.serviceType));
  workflowForm.append("budgetRange", payload.budgetRange || "");
  workflowForm.append("projectTimeline", payload.projectTimeline || "");
  workflowForm.append("projectDescription", payload.projectDescription);
  workflowForm.append("preferredConsultationType", payload.preferredConsultationType || "Virtual Meeting");
  files.forEach((file) => workflowForm.append("requirementFiles", file, file.name));

  try {
    const requestInit: RequestInit = {
      method: "POST",
      body: workflowForm,
      signal: AbortSignal.timeout(12_000)
    };

    if (skipNotification) {
      requestInit.headers = {
        "x-ractysh-skip-notification": "true"
      };
    }

    const response = await fetch(`${apiUrl}/api/consultations`, {
      ...requestInit
    });
    const result = (await response.json().catch(() => ({}))) as BackendConsultationResponse;

    if (!response.ok || !result.consultation) {
      return {
        error: result.message || `Workflow API returned ${response.status}.`
      };
    }

    return { consultation: result.consultation };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Workflow API is unavailable."
    };
  }
}

export async function POST(request: Request) {
  const startedAt = performance.now();

  try {
    const retryAfter = rateLimitRetryAfter(request);
    if (retryAfter) {
      return NextResponse.json(
        { message: "Too many consultation requests. Please try again shortly." },
        {
          status: 429,
          headers: {
            "Retry-After": String(retryAfter)
          }
        }
      );
    }

    const contentType = request.headers.get("content-type") || "";
    const isFormRequest =
      contentType.includes("multipart/form-data") || contentType.includes("application/x-www-form-urlencoded");
    const formData = isFormRequest ? await request.formData() : null;
    const jsonPayload = formData ? null : ((await request.json().catch(() => ({}))) as Record<string, unknown>);
    const normalizedPayload = formData ? normalizeFormPayload(formData) : normalizeJsonPayload(jsonPayload || {});
    const parsed = consultationSchema.safeParse(normalizedPayload);
    const files = getUploadedFiles(formData);
    const fileIssues = validateFiles(files);

    if (!parsed.success || fileIssues.length) {
      const issues: ApiValidationIssue[] = [
        ...(parsed.success
          ? []
          : parsed.error.issues.map((issue) => ({
              path: issue.path.map(String),
              message: issue.message
            }))),
        ...fileIssues
      ];

      return NextResponse.json(
        { message: "Please complete the required consultation fields.", issues },
        { status: 400 }
      );
    }

    const submittedAt = new Date().toISOString();
    const consultationPayload: ConsultationPayload = {
      ...parsed.data,
      division: parsed.data.division
        ? normalizeDivisionKey(parsed.data.division)
        : inferDivisionFromText(parsed.data.serviceType, request.headers.get("host"), request.headers.get("referer"))
    };
    const apiKey = process.env.RESEND_API_KEY;
    runBackgroundJob(
      "consultation-submission",
      async () => {
        const workflowStartedAt = performance.now();
        let workflow = await createWorkflowRecord(consultationPayload, files, Boolean(apiKey));
        const workflowMs = elapsedMs(workflowStartedAt);

        if (workflow.error) {
          console.warn("Consultation workflow API unavailable; using local fallback record:", workflow.error);

          workflow = {
            consultation: createFallbackConsultationRecord(consultationPayload, files, submittedAt, {
              sent: false,
              skipped: true,
              error: apiKey
                ? `Workflow API fallback activated: ${workflow.error}`
                : `Workflow API fallback activated and email delivery is not configured: ${workflow.error}`
            }),
            error: workflow.error,
            fallback: true
          };
        }

        if (apiKey) {
          const emailStartedAt = performance.now();
          const notification: SubmissionNotification = { sent: false, skipped: false };
          const from = senderFromEnv("CONSULTATION_NOTIFY_FROM", "MAIL_FROM", "RESEND_FROM");

          try {
            const [attachments, emailContent] = await Promise.all([
              buildAttachments(files),
              buildEmailContent(consultationPayload, submittedAt, files, request)
            ]);
            const email = await sendResendEmail({
              from,
              to: mailRecipients(),
              replyTo: consultationPayload.emailAddress,
              subject: "New Ractysh Consultation Request",
              text: emailContent.text,
              html: emailContent.html,
              attachments: attachments.length ? attachments : undefined,
              tags: [{ name: "source", value: "book-consultation" }]
            });

            if (!email.sent) {
              notification.skipped = email.skipped;
              notification.error = email.error || "Email delivery failed after workflow capture.";
            } else {
              notification.sent = true;
              notification.sentAt = email.sentAt || new Date().toISOString();
            }
          } catch (emailError) {
            console.error("Resend consultation email failed:", emailError);
            notification.error = "Email delivery failed after workflow capture.";
          }

          if (workflow.fallback) {
            updateFallbackConsultationNotification(
              workflow.consultation?._id || workflow.consultation?.id,
              notification
            );
          }

          logSubmissionTiming("consultation-email", {
            consultationId: workflow.consultation?._id || workflow.consultation?.id,
            sent: notification.sent,
            skipped: notification.skipped,
            emailMs: elapsedMs(emailStartedAt),
            error: notification.error
          });
        }

        logSubmissionTiming("book-consultation-background", {
          success: Boolean(workflow.consultation),
          workflowMs,
          emailQueued: Boolean(apiKey),
          fallback: Boolean(workflow.fallback),
          consultationId: workflow.consultation?._id || workflow.consultation?.id
        });
      },
      { email: consultationPayload.emailAddress, serviceType: consultationPayload.serviceType }
    );

    logSubmissionTiming("book-consultation", {
      success: true,
      totalMs: elapsedMs(startedAt),
      backgroundQueued: true
    });

    return NextResponse.json(
      {
        success: true,
        message: "Request received.",
        submittedAt,
        workflow: {
          created: false,
          queued: true
        },
        emailQueued: Boolean(apiKey),
        notification: apiKey
          ? { sent: false, queued: true }
          : {
              sent: false,
              skipped: true,
              error: "Email delivery is not configured."
            }
      },
      { status: 202 }
    );
  } catch (error) {
    console.error("Consultation email route failed:", error);

    return NextResponse.json(
      { message: "Unable to send request. Please try again." },
      { status: 500 }
    );
  }
}
