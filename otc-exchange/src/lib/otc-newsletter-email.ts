import { Resend, type Tag } from "resend";
import { renderWelcomeNewsletterEmail } from "@/emails/WelcomeNewsletterEmail";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const defaultLocalUrl = "http://localhost:3000";
const defaultSender = "Ractysh Newsletter <newsletter@ractysh.com>";

export type OtcNewsletterEmailResult = {
  sent: boolean;
  skipped?: boolean;
  error?: string;
  sentAt?: string;
  id?: string;
  recipients?: string[];
  originalRecipient?: string;
  redirected?: boolean;
};

export type SendOtcNewsletterWelcomeEmailInput = {
  email: string;
  source?: string;
  websiteUrl?: string;
  unsubscribeUrl?: string;
  idempotencyKey?: string;
};

function absoluteUrl(value: string | undefined): string | undefined {
  const trimmed = value?.trim().replace(/\/+$/, "");
  if (!trimmed) return undefined;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

function requestOrigin(request?: Request): string | undefined {
  if (!request) return undefined;

  try {
    return new URL(request.url).origin;
  } catch {
    return undefined;
  }
}

function senderFromEnv(...keys: string[]) {
  for (const key of keys) {
    const value = process.env[key]?.trim();
    if (value) return value;
  }

  return defaultSender;
}

function parseEmailList(value: string | undefined, fallback?: string): string[] {
  const parsed = (value || fallback || "")
    .split(",")
    .map((recipient) => recipient.trim())
    .filter((recipient) => emailPattern.test(recipient));

  return [...new Set(parsed)];
}

function welcomeRecipients(subscriberEmail: string): string[] {
  if (process.env.NEWSLETTER_DELIVERY_MODE !== "test") {
    return [subscriberEmail];
  }

  const testRecipients = parseEmailList(
    process.env.NEWSLETTER_TEST_RECIPIENT || process.env.NEWSLETTER_TEST_TO,
  );

  return testRecipients.length ? testRecipients : [subscriberEmail];
}

export function getOtcNewsletterWebsiteUrl(request?: Request) {
  return (
    absoluteUrl(process.env.NEWSLETTER_PUBLIC_BASE_URL) ||
    requestOrigin(request) ||
    absoluteUrl(process.env.EMAIL_PUBLIC_BASE_URL) ||
    absoluteUrl(process.env.NEXT_PUBLIC_SITE_URL) ||
    absoluteUrl(process.env.SITE_URL) ||
    absoluteUrl(process.env.PUBLIC_SITE_URL) ||
    absoluteUrl(process.env.WEB_ORIGIN) ||
    absoluteUrl(process.env.VERCEL_PROJECT_PRODUCTION_URL) ||
    absoluteUrl(process.env.VERCEL_URL) ||
    defaultLocalUrl
  );
}

export async function sendOtcNewsletterWelcomeEmail(
  input: SendOtcNewsletterWelcomeEmailInput,
): Promise<OtcNewsletterEmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const email = input.email.trim().toLowerCase();
  const recipients = welcomeRecipients(email);
  const redirected = recipients.length !== 1 || recipients[0] !== email;
  const welcomeEmail = await renderWelcomeNewsletterEmail({
    email,
    unsubscribeUrl: input.unsubscribeUrl,
    websiteUrl: input.websiteUrl,
  });

  if (!apiKey) {
    console.warn("[otc-newsletter-email] RESEND_API_KEY is not configured.");
    return { sent: false, skipped: true, error: "RESEND_API_KEY is not configured." };
  }

  if (!recipients.length) {
    console.warn("[otc-newsletter-email] Newsletter recipient is not configured.", { email });
    return { sent: false, skipped: true, error: "Newsletter recipient is not configured." };
  }

  const resend = new Resend(apiKey);
  const tags: Tag[] = [
    { name: "flow", value: "newsletter_welcome" },
    { name: "source", value: input.source || "otc_footer_newsletter" },
  ];

  const response = await resend.emails.send(
    {
      from: senderFromEnv(
        "NEWSLETTER_FROM",
        "MAIL_FROM",
        "RESEND_FROM",
        "RESEND_FROM_EMAIL",
        "OTC_RESEND_FROM_EMAIL",
      ),
      to: recipients,
      subject: welcomeEmail.subject,
      text: welcomeEmail.text,
      html: welcomeEmail.html,
      tags,
    },
    input.idempotencyKey ? { idempotencyKey: input.idempotencyKey } : undefined,
  );

  if (response.error) {
    console.error("[otc-newsletter-email] Resend welcome email failed.", {
      email,
      recipients,
      message: response.error.message,
      statusCode: response.error.statusCode,
    });

    return {
      sent: false,
      error: response.error.message,
      recipients,
      originalRecipient: email,
      redirected,
    };
  }

  return {
    sent: true,
    sentAt: new Date().toISOString(),
    id: response.data?.id,
    recipients,
    originalRecipient: email,
    redirected,
  };
}
