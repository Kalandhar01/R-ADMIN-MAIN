import type { ContactInquiryInput, DemoInquiryInput } from "../validation/inquiry.js";
import { parseEmailList, sendResendEmail, type EmailDeliveryResult } from "./emailDeliveryService.js";
import { renderExecutiveInquiryHtml, renderExecutiveInquiryText } from "./executiveInquiryEmailTemplate.js";
import { senderFromEnv } from "./ractyshEmailTemplate.js";

type InquiryNotificationInput =
  | (ContactInquiryInput & { kind: "contact"; inquiryId?: string })
  | (DemoInquiryInput & { kind: "book-demo"; inquiryId?: string });

function recipients(kind: InquiryNotificationInput["kind"]): string[] {
  const configured =
    kind === "book-demo"
      ? process.env.DEMO_MAIL_TO || process.env.MAIL_TO || process.env.CONSULTATION_NOTIFY_TO
      : process.env.CONTACT_NOTIFICATION_EMAIL || process.env.CONTACT_MAIL_TO || process.env.MAIL_TO || process.env.CONSULTATION_NOTIFY_TO;

  return parseEmailList(configured);
}

function sender(kind: InquiryNotificationInput["kind"]): string | undefined {
  if (kind === "book-demo") {
    return senderFromEnv("DEMO_MAIL_FROM", "MAIL_FROM", "CONSULTATION_NOTIFY_FROM", "RESEND_FROM");
  }

  return senderFromEnv("CONTACT_NOTIFICATION_FROM", "CONTACT_MAIL_FROM", "MAIL_FROM", "RESEND_FROM");
}

export async function sendInquiryNotification(
  payload: InquiryNotificationInput,
  submittedAt: string
): Promise<EmailDeliveryResult> {
  const subject =
    payload.kind === "book-demo"
      ? `New Ractysh demo request - ${payload.fullName}`
      : "New Contact Inquiry - Ractysh Group";
  const input =
    payload.kind === "book-demo"
      ? {
          clientName: payload.fullName,
          company: payload.companyName,
          email: payload.email,
          phone: payload.phone,
          requestedService: payload.discussionTopic,
          message: payload.message,
          receivedAt: submittedAt,
          inquiryId: payload.inquiryId,
          sourceLabel: "Private Demo Request",
          extraDetails: [
            { label: "Discussion Topic", value: payload.discussionTopic },
            { label: "Received At", value: submittedAt }
          ]
        }
      : {
          clientName: payload.name,
          company: payload.company,
          email: payload.email,
          phone: payload.phone,
          requestedService: payload.service || payload.subject,
          message: payload.message,
          receivedAt: submittedAt,
          inquiryId: payload.inquiryId,
          sourceLabel: "Website Contact Request",
          sourceUrl: payload.sourcePage,
          extraDetails: [
            { label: "Subject", value: payload.subject },
            { label: "Source Page", value: payload.sourcePage, href: payload.sourcePage },
            { label: "Received At", value: submittedAt }
          ]
        };

  return sendResendEmail({
    from: sender(payload.kind),
    to: recipients(payload.kind),
    replyTo: payload.email,
    subject,
    text: renderExecutiveInquiryText(input),
    html: renderExecutiveInquiryHtml(input),
    tags: [{ name: "source", value: payload.kind }],
    idempotencyKey: payload.inquiryId
  });
}
