import { parseEmailList, sendResendEmail, type EmailDeliveryResult } from "./emailDelivery";
import { getRactyshEmailBrand } from "@/emails/branding";
import { renderInquiryNotificationEmail, type InquiryDetail } from "@/emails/InquiryNotificationEmail";
import { senderFromEnv } from "./ractyshEmail";

const DEFAULT_API_URL = "http://localhost:5000";

export type InquiryKind = "contact" | "book-demo";

export interface ContactInquiryPayload {
  name?: string;
  fullName: string;
  email: string;
  phone?: string;
  company?: string;
  companyName?: string;
  service?: string;
  interest?: string;
  subject?: string;
  message: string;
  sourcePage?: string;
  division?: string;
  website?: string;
  companyWebsite?: string;
}

export interface DemoInquiryPayload {
  fullName: string;
  email: string;
  phone?: string;
  companyName?: string;
  discussionTopic: string;
  message?: string;
}

export type InquiryPayload = ContactInquiryPayload | DemoInquiryPayload;

export interface BackendInquiryResult {
  ok: boolean;
  status: number;
  id?: string;
  ingestionId?: string;
  stored?: boolean;
  message?: string;
  notification?: EmailDeliveryResult;
  error?: string;
}

function getBackendApiUrl(): string {
  return (process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_URL).replace(/\/+$/, "");
}

function endpoint(kind: InquiryKind): string {
  return kind === "book-demo" ? "/api/inquiries/book-demo" : "/api/inquiries/contact";
}

function recipients(kind: InquiryKind): string[] {
  const configured =
    kind === "book-demo"
      ? process.env.DEMO_MAIL_TO || process.env.MAIL_TO || process.env.CONSULTATION_NOTIFY_TO
      : process.env.CONTACT_NOTIFICATION_EMAIL ||
        process.env.CONTACT_MAIL_TO ||
        process.env.MAIL_TO ||
        process.env.CONSULTATION_NOTIFY_TO;

  return parseEmailList(configured);
}

function sender(kind: InquiryKind): string | undefined {
  if (kind === "book-demo") {
    return senderFromEnv("DEMO_MAIL_FROM", "MAIL_FROM", "CONSULTATION_NOTIFY_FROM", "RESEND_FROM");
  }

  return senderFromEnv("CONTACT_NOTIFICATION_FROM", "CONTACT_MAIL_FROM", "MAIL_FROM", "CONSULTATION_NOTIFY_FROM", "RESEND_FROM");
}

function message(kind: InquiryKind, payload: InquiryPayload): string | undefined {
  return kind === "book-demo" ? (payload as DemoInquiryPayload).message : (payload as ContactInquiryPayload).message;
}

async function emailContent(kind: InquiryKind, payload: InquiryPayload, submittedAt: string, inquiryId?: string, request?: Request) {
  const contact = payload as ContactInquiryPayload;
  const demo = payload as DemoInquiryPayload;
  const extraDetails: InquiryDetail[] =
    kind === "book-demo"
      ? [
          { label: "Discussion Topic", value: demo.discussionTopic },
          { label: "Received At", value: submittedAt }
        ]
      : [
          { label: "Subject", value: contact.subject },
          { label: "Source Page", value: contact.sourcePage, href: contact.sourcePage },
          { label: "Received At", value: submittedAt }
        ];

  return renderInquiryNotificationEmail({
    adminPath: "/admin/contact-inquiries",
    brand: getRactyshEmailBrand(request),
    clientName: kind === "book-demo" ? demo.fullName : contact.fullName,
    company: kind === "book-demo" ? demo.companyName : contact.companyName || contact.company,
    email: payload.email,
    inquiryId,
    message: message(kind, payload),
    phone: kind === "book-demo" ? demo.phone : contact.phone,
    receivedAt: submittedAt,
    requestedService: kind === "book-demo" ? demo.discussionTopic : contact.interest || contact.service || contact.subject,
    sourceLabel: kind === "book-demo" ? "Private Demo Request" : "Website Contact Request",
    sourceUrl: kind === "book-demo" ? undefined : contact.sourcePage,
    extraDetails
  });
}

export async function persistInquiry(
  kind: InquiryKind,
  payload: InquiryPayload,
  skipNotification: boolean
): Promise<BackendInquiryResult> {
  try {
    const response = await fetch(`${getBackendApiUrl()}${endpoint(kind)}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(skipNotification ? { "x-ractysh-skip-notification": "true" } : {})
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(12_000)
    });
    const result = await response.json().catch(() => ({}));

    return {
      ok: response.ok,
      status: response.status,
      id: typeof result?.inquiry?.id === "string" ? result.inquiry.id : undefined,
      ingestionId: typeof result?.inquiry?.ingestionId === "string" ? result.inquiry.ingestionId : undefined,
      stored: typeof result?.inquiry?.stored === "boolean" ? result.inquiry.stored : undefined,
      message: typeof result?.message === "string" ? result.message : undefined,
      notification: result?.notification,
      error: typeof result?.inquiry?.storageError === "string" ? result.inquiry.storageError : undefined
    };
  } catch (error) {
    return {
      ok: false,
      status: 503,
      error: error instanceof Error ? error.message : "Backend inquiry service unavailable."
    };
  }
}

export async function sendInquiryEmail(
  kind: InquiryKind,
  payload: InquiryPayload,
  submittedAt: string,
  inquiryId?: string,
  request?: Request
): Promise<EmailDeliveryResult> {
  const subject =
    kind === "book-demo"
      ? `New Ractysh demo request - ${payload.fullName}`
      : `New Ractysh contact inquiry - ${payload.fullName}`;
  const content = await emailContent(kind, payload, submittedAt, inquiryId, request);

  return sendResendEmail({
    from: sender(kind),
    to: recipients(kind),
    replyTo: payload.email,
    subject,
    text: content.text,
    html: content.html,
    tags: [{ name: "source", value: kind }],
    idempotencyKey: inquiryId
  });
}
