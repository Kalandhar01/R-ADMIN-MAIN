import { setTimeout as delay } from "node:timers/promises";
import { Resend, type Attachment, type Tag } from "resend";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface EmailDeliveryInput {
  from: string | undefined;
  to: string[];
  replyTo?: string;
  subject: string;
  text: string;
  html: string;
  attachments?: Attachment[];
  tags?: Tag[];
  idempotencyKey?: string;
}

export interface EmailDeliveryResult {
  sent: boolean;
  skipped?: boolean;
  error?: string;
  sentAt?: string;
  id?: string;
}

export function parseEmailList(value: string | undefined, fallback?: string): string[] {
  const parsed = (value || fallback || "")
    .split(",")
    .map((recipient) => recipient.trim())
    .filter((recipient) => emailPattern.test(recipient));

  return [...new Set(parsed)];
}

function isRetryable(statusCode: number | null | undefined): boolean {
  return statusCode === 429 || Boolean(statusCode && statusCode >= 500);
}

export async function sendResendEmail(input: EmailDeliveryInput): Promise<EmailDeliveryResult> {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.error("[email-delivery] RESEND_API_KEY is not configured.", {
      subject: input.subject,
      to: input.to
    });
    return { sent: false, skipped: true, error: "RESEND_API_KEY is not configured." };
  }

  if (!input.from) {
    console.error("[email-delivery] Sender address is not configured.", {
      subject: input.subject,
      to: input.to
    });
    return { sent: false, skipped: true, error: "Email sender address is not configured." };
  }

  if (!input.to.length) {
    console.error("[email-delivery] Recipient address is not configured.", {
      subject: input.subject,
      from: input.from
    });
    return { sent: false, skipped: true, error: "Email recipient address is not configured." };
  }

  const resend = new Resend(apiKey);
  let lastError = "Email delivery failed.";

  for (let attempt = 1; attempt <= 2; attempt += 1) {
    const response = await resend.emails.send(
      {
        from: input.from,
        to: input.to,
        replyTo: input.replyTo,
        subject: input.subject,
        text: input.text,
        html: input.html,
        attachments: input.attachments?.length ? input.attachments : undefined,
        tags: input.tags
      },
      input.idempotencyKey ? { idempotencyKey: input.idempotencyKey } : undefined
    );

    if (!response.error) {
      return {
        sent: true,
        sentAt: new Date().toISOString(),
        id: response.data?.id
      };
    }

    lastError = response.error.message;
    console.error("[email-delivery] Resend email failed.", {
      attempt,
      subject: input.subject,
      to: input.to,
      statusCode: response.error.statusCode,
      message: response.error.message
    });

    if (attempt === 1 && isRetryable(response.error.statusCode)) {
      await delay(450);
      continue;
    }

    break;
  }

  return { sent: false, error: lastError };
}
