import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { constructionLeadSchema } from "@/lib/validation";
import {
  buildAdminNotificationHtml,
  buildClientConfirmationHtml,
  sendEmail,
} from "@/lib/email";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const ADMIN_EMAIL = "kalandars2004@gmail.com";

interface RateLimitStore {
  [key: string]: { count: number; resetAt: number };
}
const rateLimitStore: RateLimitStore = {};

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitStore[ip];
  if (!entry || now > entry.resetAt) {
    rateLimitStore[ip] = { count: 1, resetAt: now + 60_000 };
    return true;
  }
  if (entry.count >= 5) return false;
  entry.count++;
  return true;
}

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 },
    );
  }

  const parsed = constructionLeadSchema.safeParse(body);
  if (!parsed.success) {
    const errors = parsed.error.flatten().fieldErrors;
    return NextResponse.json({ error: "Validation failed", errors }, { status: 422 });
  }

  const data = parsed.data;

  const leadData = {
    fullName: data.fullName,
    email: data.email,
    phone: data.phone || null,
    selectedServices: data.selectedServices ?? [],
    projectType: data.projectType || null,
    projectLocation: data.projectLocation || null,
    budgetRange: data.budgetRange || null,
    timeline: data.timeline || null,
    message: data.message || null,
  };

  try {
    const lead = await prisma.constructionLead.create({
      data: leadData,
    });

    // Send emails in background (don't block response)
    const createdAtFormatted = new Date(lead.createdAt).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    // Admin notification
    sendEmail({
      to: ADMIN_EMAIL,
      subject: "New Construction Consultation Request",
      html: buildAdminNotificationHtml({
        fullName: data.fullName,
        email: data.email,
        phone: data.phone ?? "",
        selectedServices: data.selectedServices ?? [],
        projectType: data.projectType ?? "",
        projectLocation: data.projectLocation ?? "",
        budgetRange: data.budgetRange ?? "",
        timeline: data.timeline ?? "",
        message: data.message ?? "",
        createdAt: createdAtFormatted,
      }),
    }).catch((err) => console.error("Admin email failed:", err));

    // Client confirmation
    sendEmail({
      to: data.email,
      subject: "We've Received Your Construction Inquiry",
      html: buildClientConfirmationHtml({
        fullName: data.fullName,
        selectedServices: data.selectedServices ?? [],
        projectType: data.projectType ?? "",
      }),
      replyTo: ADMIN_EMAIL,
    }).catch((err) => console.error("Client email failed:", err));

    return NextResponse.json(
      {
        success: true,
        id: lead.id,
        message: "Your consultation request has been received. We'll be in touch within 24 hours.",
      },
      { status: 201 },
    );
  } catch (err) {
    console.error("Failed to create lead:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") ?? "20", 10) || 20));
  const status = searchParams.get("status") || undefined;
  const search = searchParams.get("search") || undefined;
  const sortBy = searchParams.get("sortBy") || "createdAt";
  const sortOrder = searchParams.get("sortOrder") === "asc" ? "asc" : "desc";

  const validSortFields = ["createdAt", "fullName", "email", "status", "projectType", "budgetRange"];
  const orderField = validSortFields.includes(sortBy) ? sortBy : "createdAt";

  const where: Record<string, unknown> = {};

  if (status && status !== "all") {
    where.status = status;
  }

  if (search) {
    where.OR = [
      { fullName: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
      { phone: { contains: search, mode: "insensitive" } },
      { projectLocation: { contains: search, mode: "insensitive" } },
    ];
  }

  const [total, leads] = await Promise.all([
    prisma.constructionLead.count({ where: where as never }),
    prisma.constructionLead.findMany({
      where: where as never,
      orderBy: { [orderField]: sortOrder },
      skip: (page - 1) * limit,
      take: limit,
    }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return NextResponse.json({
    leads,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasMore: page < totalPages,
    },
  });
}
