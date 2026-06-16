import type { Attachment } from "resend";
import type { ConsultationRecord } from "../types/consultation.js";
import { parseEmailList, sendResendEmail } from "./emailDeliveryService.js";
import { renderExecutiveInquiryHtml, renderExecutiveInquiryText } from "./executiveInquiryEmailTemplate.js";
import { senderFromEnv } from "./ractyshEmailTemplate.js";

function recipients(): string[] {
  return parseEmailList(process.env.CONSULTATION_NOTIFY_TO || process.env.MAIL_TO);
}

function sender(): string | undefined {
  return senderFromEnv("CONSULTATION_NOTIFY_FROM", "MAIL_FROM", "RESEND_FROM");
}

function attachments(files: Express.Multer.File[]): Attachment[] | undefined {
  if (process.env.CONSULTATION_EMAIL_ATTACHMENTS === "false") return undefined;

  return files.map((file) => ({
    filename: file.originalname,
    content: file.buffer,
    contentType: file.mimetype || undefined
  }));
}

export async function sendConsultationNotification(
  consultation: ConsultationRecord,
  files: Express.Multer.File[]
): Promise<ConsultationRecord["notification"]> {
  const subjectName = consultation.companyName || consultation.fullName;
  const emailInput = {
    adminUrl: `${process.env.ADMIN_ORIGIN || process.env.ADMIN_PUBLIC_BASE_URL || "http://localhost:3001"}/operations`,
    clientName: consultation.fullName,
    company: consultation.companyName,
    email: consultation.emailAddress,
    phone: consultation.phoneNumber,
    requestedService: consultation.serviceType,
    message: consultation.projectDescription,
    receivedAt: consultation.createdAt,
    inquiryId: consultation.id,
    sourceLabel: "Consultation Request",
    extraDetails: [
      { label: "Budget Range", value: consultation.budgetRange },
      { label: "Project Timeline", value: consultation.projectTimeline },
      { label: "Consultation Type", value: consultation.preferredConsultationType },
      {
        label: "Uploaded Files",
        value: consultation.attachments.length
          ? consultation.attachments
              .map((attachment) => `${attachment.filename}${attachment.url ? ` - ${attachment.url}` : ""}`)
              .join(", ")
          : "No files uploaded"
      },
      { label: "Received At", value: consultation.createdAt }
    ]
  };
  const result = await sendResendEmail({
    from: sender(),
    to: recipients(),
    replyTo: consultation.emailAddress,
    subject: `New Ractysh consultation request - ${subjectName}`,
    text: renderExecutiveInquiryText(emailInput),
    html: renderExecutiveInquiryHtml(emailInput),
    attachments: attachments(files),
    tags: [{ name: "source", value: "consultation-api" }],
    idempotencyKey: consultation.id
  });

  return {
    sent: result.sent,
    skipped: result.skipped,
    error: result.error,
    sentAt: result.sentAt
  };
}
