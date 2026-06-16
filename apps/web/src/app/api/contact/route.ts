import { NextResponse } from "next/server";
import { z } from "zod";
import { inferDivisionFromText, normalizeDivisionKey } from "@ractysh/shared";
import { elapsedMs, logSubmissionTiming, runBackgroundJob } from "@/lib/server/backgroundJobs";
import { persistInquiry, sendInquiryEmail, type ContactInquiryPayload } from "@/lib/server/inquiryDelivery";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RATE_LIMIT_WINDOW_MS = 10 * 60_000;
const RATE_LIMIT_MAX_REQUESTS = 10;
const rateLimitBuckets = new Map<string, { count: number; resetAt: number }>();

const contactSchema = z.object({
  fullName: z.string().trim().min(1, "Please enter your name.").max(120, "Name is too long."),
  email: z
    .string()
    .trim()
    .min(1, "Please enter your email.")
    .max(180, "Email is too long.")
    .refine((value) => emailPattern.test(value), "Please enter a valid email."),
  phone: z.string().trim().max(40, "Phone number is too long.").optional(),
  companyName: z.string().trim().max(160, "Company is too long.").optional(),
  interest: z.string().trim().max(140, "Focus is too long.").optional(),
  subject: z.string().trim().max(180, "Subject is too long.").optional(),
  division: z.string().trim().max(80).optional(),
  message: z.string().trim().min(1, "Please enter your message.").max(4000, "Message is too long."),
  sourcePage: z.string().trim().max(1000, "Source page is too long.").optional(),
  website: z.string().trim().max(200).optional(),
  companyWebsite: z.string().trim().max(200).optional()
}).superRefine((value, ctx) => {
  if (value.website || value.companyWebsite) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["website"],
      message: "Spam protection triggered."
    });
  }
});

function textFromFormData(formData: FormData, ...keys: string[]): string {
  for (const key of keys) {
    const value = formData.get(key);
    if (typeof value === "string") return value;
  }

  return "";
}

async function requestPayload(request: Request): Promise<ContactInquiryPayload> {
  const contentType = request.headers.get("content-type") || "";

  if (contentType.includes("multipart/form-data") || contentType.includes("application/x-www-form-urlencoded")) {
    const formData = await request.formData();

    return {
      fullName: textFromFormData(formData, "fullName", "name"),
      email: textFromFormData(formData, "email", "emailAddress"),
      phone: textFromFormData(formData, "phone", "phoneNumber"),
      companyName: textFromFormData(formData, "companyName", "company"),
      interest: textFromFormData(formData, "interest", "service", "coordinationFocus"),
      subject: textFromFormData(formData, "subject"),
      division: textFromFormData(formData, "division"),
      message: textFromFormData(formData, "message"),
      sourcePage: textFromFormData(formData, "sourcePage", "pageUrl"),
      website: textFromFormData(formData, "website"),
      companyWebsite: textFromFormData(formData, "companyWebsite")
    };
  }

  const json = (await request.json().catch(() => ({}))) as Record<string, unknown>;

  return {
    fullName: typeof json.fullName === "string" ? json.fullName : typeof json.name === "string" ? json.name : "",
    email: typeof json.email === "string" ? json.email : "",
    phone: typeof json.phone === "string" ? json.phone : "",
    companyName: typeof json.companyName === "string" ? json.companyName : typeof json.company === "string" ? json.company : "",
    interest: typeof json.interest === "string" ? json.interest : typeof json.service === "string" ? json.service : "",
    subject: typeof json.subject === "string" ? json.subject : "",
    division: typeof json.division === "string" ? json.division : "",
    message: typeof json.message === "string" ? json.message : "",
    sourcePage: typeof json.sourcePage === "string" ? json.sourcePage : typeof json.pageUrl === "string" ? json.pageUrl : "",
    website: typeof json.website === "string" ? json.website : "",
    companyWebsite: typeof json.companyWebsite === "string" ? json.companyWebsite : ""
  };
}

function sourcePageForRequest(payload: ContactInquiryPayload, request: Request): string {
  if (payload.sourcePage) return payload.sourcePage;
  return request.headers.get("referer") || request.headers.get("origin") || "website-contact-form";
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
    rateLimitBuckets.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return null;
  }

  bucket.count += 1;
  if (bucket.count <= RATE_LIMIT_MAX_REQUESTS) return null;
  return Math.ceil((bucket.resetAt - now) / 1000);
}

export async function POST(request: Request) {
  const startedAt = performance.now();

  try {
    const retryAfter = rateLimitRetryAfter(request);
    if (retryAfter) {
      return NextResponse.json(
        { message: "Too many contact submissions. Please try again shortly." },
        { status: 429, headers: { "Retry-After": String(retryAfter) } }
      );
    }

    const parsed = contactSchema.safeParse(await requestPayload(request));

    if (!parsed.success) {
      return NextResponse.json(
        {
          message: "Please complete the required contact fields.",
          issues: parsed.error.issues.map((issue) => ({
            path: issue.path.map(String),
            message: issue.message
          }))
        },
        { status: 400 }
      );
    }

    const submittedAt = new Date().toISOString();
    const payload: ContactInquiryPayload = {
      ...parsed.data,
      name: parsed.data.fullName,
      service: parsed.data.interest,
      sourcePage: sourcePageForRequest(parsed.data, request),
      division: parsed.data.division
        ? normalizeDivisionKey(parsed.data.division)
        : inferDivisionFromText(parsed.data.interest, parsed.data.subject, sourcePageForRequest(parsed.data, request), request.headers.get("host"))
    };
    const hasAppRouterEmail = Boolean(process.env.RESEND_API_KEY);
    const sourcePage = payload.sourcePage;

    runBackgroundJob(
      "contact-submission",
      async () => {
        const dbStartedAt = performance.now();
        const backend = await persistInquiry("contact", payload, hasAppRouterEmail);
        const dbMs = elapsedMs(dbStartedAt);

        if (!backend.stored) {
          logSubmissionTiming("contact-background", {
            success: false,
            dbMs,
            storageError: backend.error,
            status: backend.status
          });
          return;
        }

        if (hasAppRouterEmail) {
          const emailStartedAt = performance.now();
          const notification = await sendInquiryEmail("contact", payload, submittedAt, backend.id, request);

          logSubmissionTiming("contact-email", {
            inquiryId: backend.id,
            sent: notification.sent,
            skipped: notification.skipped,
            emailMs: elapsedMs(emailStartedAt),
            error: notification.error
          });
        }

        logSubmissionTiming("contact-background", {
          success: true,
          dbMs,
          emailQueued: hasAppRouterEmail,
          inquiryId: backend.id
        });
      },
      { sourcePage }
    );

    logSubmissionTiming("contact", {
      success: true,
      totalMs: elapsedMs(startedAt),
      backgroundQueued: true
    });

    return NextResponse.json(
      {
        success: true,
        message: "Request received.",
        submittedAt,
        inquiry: { stored: false, queued: true },
        emailQueued: hasAppRouterEmail,
        notification: hasAppRouterEmail
          ? { sent: false, queued: true }
          : {
              sent: false,
              skipped: true,
              error: "RESEND_API_KEY is not configured."
            }
      },
      { status: 202 }
    );
  } catch (error) {
    console.error("Contact inquiry route failed:", error);

    return NextResponse.json({ message: "Unable to route inquiry. Please try again." }, { status: 500 });
  }
}
