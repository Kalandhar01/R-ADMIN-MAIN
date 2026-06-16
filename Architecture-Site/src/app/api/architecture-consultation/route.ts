import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_MESSAGE_LENGTH = 4000;

type ConsultationPayload = {
  name: string;
  email: string;
  phone?: string;
  projectType: string;
  location?: string;
  budget?: string;
  message: string;
  sourcePage: string;
};

type ApiBody = Record<string, unknown>;

function clean(value: unknown, limit = 4000) {
  return typeof value === "string" ? value.replace(/[\u0000-\u001F\u007F]/g, "").trim().slice(0, limit) : "";
}

function jsonValue(value: unknown) {
  return JSON.parse(JSON.stringify(value ?? {}));
}

function excerpt(value: string, limit = 190) {
  const trimmed = value.replace(/\s+/g, " ").trim();
  return trimmed.length <= limit ? trimmed : `${trimmed.slice(0, limit - 1)}...`;
}

function payloadFromBody(body: ApiBody, request: NextRequest): ConsultationPayload {
  const website = clean(body.website, 200);

  if (website) {
    throw new Error("Spam protection triggered.");
  }

  const payload = {
    name: clean(body.name, 120),
    email: clean(body.email, 180),
    phone: clean(body.phone, 40),
    projectType: clean(body.projectType, 140) || "Architecture consultation",
    location: clean(body.location, 160),
    budget: clean(body.budget, 120),
    message: clean(body.message, MAX_MESSAGE_LENGTH),
    sourcePage: clean(body.sourcePage, 1000) || request.headers.get("referer") || "architecture-domain"
  };

  if (!payload.name) throw new Error("Please enter your name.");
  if (!emailPattern.test(payload.email)) throw new Error("Please enter a valid email.");
  if (!payload.message) throw new Error("Please enter your message.");

  return payload;
}

function leadSummary(payload: ConsultationPayload) {
  const locationText = payload.location ? ` in ${payload.location}` : "";
  return `New lead from architecture consultation form for ${payload.projectType}${locationText}. Signal: ${excerpt(payload.message)}`;
}

export async function POST(request: NextRequest) {
  try {
    const payload = payloadFromBody((await request.json().catch(() => ({}))) as ApiBody, request);
    const submittedAt = new Date();
    const message = [
      `Project Type: ${payload.projectType}`,
      payload.location ? `Location: ${payload.location}` : undefined,
      payload.budget ? `Budget: ${payload.budget}` : undefined,
      "",
      payload.message
    ]
      .filter((line) => line !== undefined)
      .join("\n");
    const subject = `Architecture consultation - ${payload.projectType}`;
    const aiSummary = leadSummary(payload);

    const inquiry = await prisma.contactInquiry.create({
      data: {
        division: "architecture",
        name: payload.name,
        email: payload.email,
        phone: payload.phone || undefined,
        service: payload.projectType,
        subject,
        message,
        sourcePage: payload.sourcePage,
        status: "new"
      }
    });

    const event = await prisma.ingestionEvent.create({
      data: {
        sourceType: "website_contact_form",
        entityType: "lead",
        status: "completed",
        priority: "high",
        source: "architecture-site",
        division: "architecture",
        service: payload.projectType,
        location: payload.location,
        payload: jsonValue({
          ...payload,
          contactInquiryId: inquiry.id,
          submittedAt: submittedAt.toISOString()
        }),
        aiSummary,
        startedAt: submittedAt,
        processedAt: submittedAt
      }
    });

    const lead = await prisma.lead.create({
      data: {
        division: "architecture",
        fullName: payload.name,
        email: payload.email,
        phone: payload.phone || undefined,
        source: "architecture-site",
        sourceType: "website_contact_form",
        service: payload.projectType,
        location: payload.location,
        status: "new",
        message,
        aiSummary,
        metadata: jsonValue({
          channel: "architecture-domain",
          budget: payload.budget,
          subject,
          sourcePage: payload.sourcePage,
          externalEntityId: inquiry.id,
          externalEntityModel: "ContactInquiry"
        }),
        ingestionEventId: event.id
      }
    });

    const architectureLead = await prisma.architectureLead.create({
      data: {
        name: payload.name,
        email: payload.email,
        phone: payload.phone || undefined,
        projectType: payload.projectType,
        location: payload.location || undefined,
        budget: payload.budget || undefined,
        message: payload.message,
        sourcePage: payload.sourcePage,
        status: "new",
        contactInquiryId: inquiry.id,
        legacyLeadId: lead.id,
        metadata: jsonValue({
          subject,
          aiSummary,
          channel: "architecture-domain",
          ingestionEventId: event.id
        })
      }
    });

    await prisma.notification.create({
      data: {
        dedupeKey: `architecture-lead-${architectureLead.id}`,
        title: "New architecture inquiry",
        message: `${payload.name} requested ${payload.projectType}${payload.location ? ` in ${payload.location}` : ""}.`,
        project: "architecture",
        division: "architecture",
        priority: "high",
        status: "unread",
        entity: "ArchitectureLead",
        entityId: architectureLead.id,
        actionUrl: "/admin/architecture?section=leads",
        metadata: jsonValue({
          architectureLeadId: architectureLead.id,
          contactInquiryId: inquiry.id,
          legacyLeadId: lead.id,
          sourcePage: payload.sourcePage
        })
      }
    });

    await prisma.ingestionEvent.update({
      where: { id: event.id },
      data: {
        entityId: architectureLead.id,
        entityModel: "ArchitectureLead"
      }
    });

    return NextResponse.json(
      {
        success: true,
        message: "Brief received. It is now in the architecture lead and contact request flow.",
        inquiry: {
          id: inquiry.id,
          leadId: lead.id,
          architectureLeadId: architectureLead.id,
          stored: true,
          status: "new"
        }
      },
      { status: 201 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to route the consultation.";
    const status = message.includes("Please") || message.includes("Spam") ? 400 : 503;

    console.error("Architecture consultation route failed:", error);
    return NextResponse.json({ success: false, message }, { status });
  }
}

export function GET() {
  return NextResponse.json({ success: false, message: "Method not allowed." }, { status: 405, headers: { Allow: "POST" } });
}
