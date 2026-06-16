import type { ContactInquiry } from "@prisma/client";
import { inferDivisionFromText } from "@ractysh/shared";
import { prisma } from "../lib/prisma.js";
import type { ContactInquiryInput, DemoInquiryInput } from "../validation/inquiry.js";
import { safelyIngestLead } from "./ingestionService.js";

export type InquiryKind = "contact" | "book-demo";
export type ContactPipelineStatus = "new" | "contacted" | "qualified" | "proposal_sent" | "won" | "closed" | "archived";

export interface StoredInquiryResult {
  stored: boolean;
  id?: string;
  ingestionId?: string;
  error?: string;
}

export type InquiryPayload =
  | (ContactInquiryInput & { kind: "contact" })
  | (DemoInquiryInput & { kind: "book-demo" });

export function mapContactInquiry(record: ContactInquiry) {
  return {
    id: record.id,
    division: record.division,
    name: record.name,
    email: record.email,
    phone: record.phone,
    company: record.company,
    service: record.service,
    subject: record.subject,
    message: record.message,
    sourcePage: record.sourcePage,
    status: record.status,
    notes: record.notes,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString()
  };
}

export async function createInquiry(payload: InquiryPayload): Promise<StoredInquiryResult> {
  try {
    const name = payload.kind === "contact" ? payload.name : payload.fullName;
    const company = payload.kind === "contact" ? payload.company : payload.companyName;
    const service = payload.kind === "contact" ? payload.service : payload.discussionTopic;
    const subject = payload.kind === "contact" ? payload.subject : payload.discussionTopic;
    const division = payload.kind === "contact" ? payload.division : inferDivisionFromText(payload.discussionTopic);
    const message =
      payload.kind === "contact"
        ? payload.message
        : payload.message || `Book demo request for ${payload.discussionTopic}.`;
    const sourcePage = payload.kind === "contact" ? payload.sourcePage : "book-demo";

    const record = await prisma.contactInquiry.create({
      data: {
        name,
        division,
        email: payload.email,
        phone: payload.phone || undefined,
        company: company || undefined,
        service: service || undefined,
        subject: subject || undefined,
        message,
        sourcePage: sourcePage || payload.kind,
        status: "new"
      }
    });

    const ingestion = await safelyIngestLead({
      fullName: name,
      email: payload.email,
      phone: payload.phone || undefined,
      companyName: company || undefined,
      source: payload.kind,
      division,
      sourceType: payload.kind === "contact" ? "website_contact_form" : "book_consultation_form",
      service: service || undefined,
      location: undefined,
      status: "new",
      message,
      metadata: {
        channel: "api-inquiry",
        kind: payload.kind,
        subject,
        sourcePage
      },
      externalEntityId: record.id,
      externalEntityModel: "ContactInquiry"
    });

    return { stored: true, id: record.id, ingestionId: ingestion?.entityId };
  } catch (error) {
    console.error("Prisma inquiry persistence failed:", error);
    return {
      stored: false,
      error: error instanceof Error ? error.message : "Inquiry persistence failed."
    };
  }
}

export async function listContactInquiries() {
  const records = await prisma.contactInquiry.findMany({
    orderBy: { createdAt: "desc" },
    take: 250
  });

  return records.map(mapContactInquiry);
}

export async function updateContactInquiry(
  id: string,
  input: { status?: ContactPipelineStatus; notes?: string }
) {
  const record = await prisma.contactInquiry.update({
    where: { id },
    data: {
      status: input.status,
      notes: input.notes
    }
  });

  return mapContactInquiry(record);
}
