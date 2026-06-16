import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { Resend, type Tag } from "resend";
import { renderWelcomeNewsletterEmail } from "@/emails/WelcomeNewsletterEmail";
import { parse as parseDotenv } from "dotenv";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const defaultLocalUrl = "http://localhost:3000";
const defaultSender = "Ractysh Architecture <newsletter@ractysh.com>";
const envFileCandidates = [
  path.resolve(process.cwd(), ".env"),
  path.resolve(process.cwd(), "../apps/api/.env"),
  path.resolve(process.cwd(), "../api/.env"),
  path.resolve(process.cwd(), "../../apps/api/.env"),
  path.resolve(process.cwd(), "apps/api/.env"),
];

export type ArchitectureNewsletterEmailResult = {
  sent: boolean;
  skipped?: boolean;
  error?: string;
  sentAt?: string;
  id?: string;
  recipients?: string[];
  originalRecipient?: string;
  redirected?: boolean;
};

export type SendArchitectureNewsletterWelcomeEmailInput = {
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

function envValuesFromFiles(key: string) {
  const values: string[] = [];

  for (const envPath of envFileCandidates) {
    if (!existsSync(envPath)) continue;

    try {
      const value = parseDotenv(readFileSync(envPath))[key]?.trim();
      if (value) values.push(value);
    } catch {
      // Ignore unreadable fallback env files; process.env remains the source of truth.
    }
  }

  return values;
}

function resendApiKeyCandidates() {
  return [
    process.env.ARCHITECTURE_RESEND_API_KEY,
    process.env.RESEND_API_KEY,
    ...envValuesFromFiles("ARCHITECTURE_RESEND_API_KEY"),
    ...envValuesFromFiles("RESEND_API_KEY"),
  ]
    .map((value) => value?.trim())
    .filter((value): value is string => Boolean(value))
    .filter((value, index, values) => values.indexOf(value) === index);
}

function canTryFallbackKey(message: string | undefined) {
  return Boolean(message?.toLowerCase().includes("api key"));
}

function welcomeRecipients(subscriberEmail: string): string[] {
  if (process.env.NEWSLETTER_DELIVERY_MODE !== "test") {
    return [subscriberEmail];
  }

  const testRecipients = parseEmailList(
    process.env.ARCHITECTURE_NEWSLETTER_TEST_RECIPIENT ||
      process.env.NEWSLETTER_TEST_RECIPIENT ||
      process.env.NEWSLETTER_TEST_TO,
  );

  return testRecipients.length ? testRecipients : [subscriberEmail];
}

export function getArchitectureNewsletterWebsiteUrl(request?: Request) {
  return (
    absoluteUrl(process.env.ARCHITECTURE_NEWSLETTER_PUBLIC_BASE_URL) ||
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

export async function sendArchitectureNewsletterWelcomeEmail(
  input: SendArchitectureNewsletterWelcomeEmailInput,
): Promise<ArchitectureNewsletterEmailResult> {
  const apiKeys = resendApiKeyCandidates();
  const email = input.email.trim().toLowerCase();
  const recipients = welcomeRecipients(email);
  const redirected = recipients.length !== 1 || recipients[0] !== email;
  const welcomeEmail = await renderWelcomeNewsletterEmail({
    email,
    unsubscribeUrl: input.unsubscribeUrl,
    websiteUrl: input.websiteUrl,
  });

  if (!apiKeys.length) {
    console.warn("[architecture-newsletter-email] RESEND_API_KEY is not configured.");
    return { sent: false, skipped: true, error: "RESEND_API_KEY is not configured." };
  }

  if (!recipients.length) {
    console.warn("[architecture-newsletter-email] Newsletter recipient is not configured.");
    return { sent: false, skipped: true, error: "Newsletter recipient is not configured." };
  }

  const tags: Tag[] = [
    { name: "flow", value: "newsletter_welcome" },
    { name: "source", value: input.source || "architecture_footer_newsletter" },
    { name: "division", value: "architecture" },
  ];

  let lastError: { message?: string; statusCode?: number } | null = null;

  for (const [index, apiKey] of apiKeys.entries()) {
    const resend = new Resend(apiKey);
    const response = await resend.emails.send(
      {
        from: senderFromEnv(
          "ARCHITECTURE_NEWSLETTER_FROM",
          "NEWSLETTER_FROM",
          "MAIL_FROM",
          "RESEND_FROM",
          "RESEND_FROM_EMAIL",
        ),
        to: recipients,
        subject: welcomeEmail.subject,
        text: welcomeEmail.text,
        html: welcomeEmail.html,
        tags,
      },
      input.idempotencyKey ? { idempotencyKey: input.idempotencyKey } : undefined,
    );

    if (!response.error) {
      return {
        sent: true,
        sentAt: new Date().toISOString(),
        id: response.data?.id,
        recipients,
        originalRecipient: email,
        redirected,
      };
    }

    lastError = {
      message: response.error.message,
      statusCode: response.error.statusCode ?? undefined,
    };

    if (index < apiKeys.length - 1 && canTryFallbackKey(response.error.message)) {
      console.warn("[architecture-newsletter-email] Resend API key failed; trying fallback key.", {
        statusCode: response.error.statusCode,
      });
      continue;
    }

    break;
  }

  console.error("[architecture-newsletter-email] Resend welcome email failed.", {
    recipientCount: recipients.length,
    redirected,
    message: lastError?.message,
    statusCode: lastError?.statusCode,
  });

  return {
    sent: false,
    error: lastError?.message || "Unable to send welcome email.",
    recipients,
    originalRecipient: email,
    redirected,
  };
}
