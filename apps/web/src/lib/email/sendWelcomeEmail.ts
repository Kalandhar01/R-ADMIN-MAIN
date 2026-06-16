import { getRactyshNewsletterEmailBrand } from "@/emails/branding";
import { renderWelcomeNewsletterEmail } from "@/emails/WelcomeNewsletterEmail";
import { parseEmailList, sendResendEmail, type EmailDeliveryResult } from "@/lib/server/emailDelivery";
import { senderFromEnv } from "@/lib/server/ractyshEmail";

export interface SendWelcomeEmailInput {
  email: string;
  name?: string;
  request?: Request;
  source?: string;
  unsubscribeUrl?: string;
  websiteUrl?: string;
  idempotencyKey?: string;
}

function welcomeRecipients(subscriberEmail: string): string[] {
  if (process.env.NEWSLETTER_DELIVERY_MODE !== "test") {
    return [subscriberEmail];
  }

  const testRecipients = parseEmailList(process.env.NEWSLETTER_TEST_RECIPIENT || process.env.NEWSLETTER_TEST_TO);
  return testRecipients.length ? testRecipients : [subscriberEmail];
}

export async function sendWelcomeEmail(input: SendWelcomeEmailInput): Promise<EmailDeliveryResult> {
  const email = input.email.trim().toLowerCase();
  const recipients = welcomeRecipients(email);
  const redirected = recipients.length !== 1 || recipients[0] !== email;
  const brand = getRactyshNewsletterEmailBrand(input.request);
  const websiteUrl = input.websiteUrl || brand.homepageUrl;
  const welcomeEmail = await renderWelcomeNewsletterEmail({
    name: input.name,
    email,
    unsubscribeUrl: input.unsubscribeUrl,
    websiteUrl
  });

  if (redirected && process.env.NODE_ENV !== "production") {
    console.info("[newsletter-email] Development recipient redirect active.", {
      originalRecipient: email,
      recipients
    });
  }

  const delivery = await sendResendEmail({
    from: senderFromEnv("NEWSLETTER_FROM", "MAIL_FROM", "RESEND_FROM"),
    to: recipients,
    subject: welcomeEmail.subject,
    text: welcomeEmail.text,
    html: welcomeEmail.html,
    idempotencyKey: input.idempotencyKey,
    tags: [
      { name: "flow", value: "newsletter_welcome" },
      { name: "source", value: input.source || "footer_newsletter" }
    ]
  });

  return {
    ...delivery,
    originalRecipient: email,
    recipients,
    redirected
  };
}
