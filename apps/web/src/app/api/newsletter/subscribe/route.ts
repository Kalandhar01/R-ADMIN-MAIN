import { NextResponse } from "next/server";
import { z } from "zod";
import { inferDivisionFromText, normalizeDivisionKey } from "@ractysh/shared";
import { subscribeNewsletterSubscriber } from "@/lib/server/newsletter.service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const RATE_LIMIT_WINDOW_MS = 10 * 60_000;
const RATE_LIMIT_MAX_REQUESTS = 8;
const rateLimitBuckets = new Map<string, { count: number; resetAt: number }>();

const subscribeSchema = z.object({
  email: z
    .string({ required_error: "Please enter your email.", invalid_type_error: "Please enter your email." })
    .trim()
    .min(1, "Please enter your email.")
    .max(180, "Email is too long.")
    .email("Please enter a valid email."),
  source: z.string().trim().max(120).optional(),
  division: z.string().trim().max(80).optional()
});

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

async function requestPayload(request: Request): Promise<Record<string, unknown>> {
  const contentType = request.headers.get("content-type") || "";

  if (contentType.includes("multipart/form-data") || contentType.includes("application/x-www-form-urlencoded")) {
    const formData = await request.formData();
    return {
      email: formData.get("email"),
      source: formData.get("source"),
      division: formData.get("division")
    };
  }

  return ((await request.json().catch(() => ({}))) || {}) as Record<string, unknown>;
}

export async function POST(request: Request) {
  const retryAfter = rateLimitRetryAfter(request);
  if (retryAfter) {
    return NextResponse.json(
      { success: false, message: "Too many subscription attempts. Please try again shortly." },
      { status: 429, headers: { "Retry-After": String(retryAfter) } }
    );
  }

  const parsed = subscribeSchema.safeParse(await requestPayload(request));
  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        message: "Please enter a valid email.",
        issues: parsed.error.issues.map((issue) => ({
          path: issue.path.map(String),
          message: issue.message
        }))
      },
      { status: 400 }
    );
  }

  try {
    const result = await subscribeNewsletterSubscriber({
      email: parsed.data.email,
      source: parsed.data.source || "footer_newsletter",
      division: parsed.data.division
        ? normalizeDivisionKey(parsed.data.division)
        : inferDivisionFromText(parsed.data.source, request.headers.get("host"), request.headers.get("referer")),
      request
    });

    if (!result.success && result.message === "Already subscribed") {
      return NextResponse.json(
        {
          success: false,
          message: "Already subscribed"
        },
        { status: 409 }
      );
    }

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: result.message
        },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true, message: "Request received." }, { status: 202 });
  } catch (error) {
    console.error("[newsletter-subscribe] Subscription flow failed.", error);

    return NextResponse.json(
      { success: false, message: "Unable to confirm subscription. Please try again." },
      { status: 503 }
    );
  }
}
