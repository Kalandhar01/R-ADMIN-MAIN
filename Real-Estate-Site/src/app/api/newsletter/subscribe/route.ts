import { NextResponse, type NextRequest } from "next/server";
import { Prisma, type NewsletterSubscriber } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const division = "real-estate";
const sourceFallback = "ractysh-real-estate-footer";
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const rateLimitWindowMs = 10 * 60_000;
const rateLimitMaxRequests = 8;
const rateLimitBuckets = new Map<string, { count: number; resetAt: number }>();

type SubscribePayload = {
  email?: unknown;
  source?: unknown;
  division?: unknown;
};

type SubscribeRecord = {
  subscriber: NewsletterSubscriber;
  created: boolean;
};

function clean(value: unknown, limit = 1000) {
  return typeof value === "string"
    ? value.replace(/[\u0000-\u001F\u007F]/g, "").trim().slice(0, limit)
    : "";
}

function clientIdentifier(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();

  return (
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-real-ip") ||
    request.headers.get("x-client-ip") ||
    forwardedFor ||
    "anonymous"
  );
}

function rateLimitRetryAfter(request: NextRequest): number | null {
  const now = Date.now();
  const key = clientIdentifier(request);

  if (rateLimitBuckets.size > 1000) {
    for (const [bucketKey, bucket] of rateLimitBuckets) {
      if (bucket.resetAt <= now) rateLimitBuckets.delete(bucketKey);
    }
  }

  const bucket = rateLimitBuckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    rateLimitBuckets.set(key, { count: 1, resetAt: now + rateLimitWindowMs });
    return null;
  }

  bucket.count += 1;
  if (bucket.count <= rateLimitMaxRequests) return null;

  return Math.ceil((bucket.resetAt - now) / 1000);
}

async function requestPayload(request: NextRequest): Promise<SubscribePayload> {
  const contentType = request.headers.get("content-type") || "";

  if (
    contentType.includes("multipart/form-data") ||
    contentType.includes("application/x-www-form-urlencoded")
  ) {
    const formData = await request.formData();
    return {
      email: formData.get("email"),
      source: formData.get("source"),
      division: formData.get("division"),
    };
  }

  return ((await request.json().catch(() => ({}))) || {}) as SubscribePayload;
}

async function createSubscriber(email: string): Promise<SubscribeRecord> {
  const existingSubscriber = await prisma.newsletterSubscriber.findUnique({
    where: { email },
  });

  if (existingSubscriber) return { subscriber: existingSubscriber, created: false };

  try {
    const subscriber = await prisma.newsletterSubscriber.create({
      data: {
        email,
        division,
      },
    });

    return { subscriber, created: true };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      const subscriber = await prisma.newsletterSubscriber.findUnique({
        where: { email },
      });

      if (subscriber) return { subscriber, created: false };
    }

    throw error;
  }
}

async function notifyAdmins(subscriber: NewsletterSubscriber, source: string) {
  const admins = await prisma.admin.findMany({
    where: { active: true },
    select: { id: true },
  });

  if (!admins.length) return;

  const rows: Prisma.NotificationCreateManyInput[] = admins.map((admin) => ({
    adminId: admin.id,
    dedupeKey: `${admin.id}:subscriber:NewsletterSubscriber:${subscriber.id}:real-estate`,
    title: "New Real Estate Newsletter Subscriber",
    message: `${subscriber.email} subscribed from Ractysh Real Estate.`,
    project: division,
    division,
    priority: "medium",
    entity: "NewsletterSubscriber",
    entityId: subscriber.id,
    actionUrl: "/admin/real-estate",
    metadata: {
      source,
      submittedFrom: "ractysh-real-estate",
    },
    createdAt: subscriber.createdAt,
  }));

  await prisma.notification.createMany({
    data: rows,
    skipDuplicates: true,
  });
}

export async function POST(request: NextRequest) {
  const retryAfter = rateLimitRetryAfter(request);
  if (retryAfter) {
    return NextResponse.json(
      {
        ok: false,
        success: false,
        message: "Too many subscription attempts. Please try again shortly.",
      },
      { status: 429, headers: { "Retry-After": String(retryAfter) } },
    );
  }

  const payload = await requestPayload(request);
  const email = clean(payload.email, 180).toLowerCase();
  const source = clean(payload.source, 120) || sourceFallback;
  const requestedDivision = clean(payload.division, 80) || division;

  if (!emailPattern.test(email)) {
    return NextResponse.json(
      {
        ok: false,
        success: false,
        message: "Please enter a valid email address.",
      },
      { status: 400 },
    );
  }

  try {
    const { subscriber, created } = await createSubscriber(email);

    if (created) {
      await notifyAdmins(subscriber, source);
    }

    return NextResponse.json({
      ok: true,
      success: true,
      alreadySubscribed: !created,
      message: created
        ? "Subscribed. You are now connected to Ractysh Real Estate insights."
        : "This email is already subscribed.",
      subscriber: {
        id: subscriber.id,
        email: subscriber.email,
        createdAt: subscriber.createdAt.toISOString(),
      },
      division: requestedDivision,
    });
  } catch (error) {
    console.error("[real-estate-newsletter] Subscription failed.", error);

    return NextResponse.json(
      {
        ok: false,
        success: false,
        message: "Unable to confirm subscription right now.",
      },
      { status: 500 },
    );
  }
}
