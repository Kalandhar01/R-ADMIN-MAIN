import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const RESEND_EMAILS_API = "https://api.resend.com/emails";
const constructionContactRecipient = "kalandars2004@gmail.com";
const defaultFromEmail = "Ractysh Construction <onboarding@resend.dev>";

type ContactPayload = {
  name: string;
  email: string;
  company?: string;
  message: string;
  website?: string;
};

type EmailDeliveryResult = {
  sent: boolean;
  skipped?: boolean;
  error?: string;
  id?: string;
  sentAt?: string;
};

function clean(value: unknown, max = 4000) {
  return typeof value === "string"
    ? value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim().slice(0, max)
    : "";
}

function sourcePage(request: NextRequest) {
  return request.headers.get("referer") || request.headers.get("origin") || "construction-site/contact";
}

function validate(payload: ContactPayload) {
  const issues: string[] = [];

  if (!payload.name) issues.push("Please enter your name.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) issues.push("Please enter a valid email.");
  if (!payload.message) issues.push("Please enter your project brief.");
  if (payload.website) issues.push("Spam protection triggered.");

  return issues;
}

function parseEmailList(value: string | undefined, fallback: string) {
  const recipients = (value || fallback)
    .split(",")
    .map((recipient) => recipient.trim())
    .filter((recipient) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipient));

  return [...new Set(recipients)];
}

function absoluteUrl(value: string | undefined) {
  const trimmed = value?.trim().replace(/\/+$/, "");
  if (!trimmed) return undefined;
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

function brandUrl() {
  return (
    absoluteUrl(process.env.EMAIL_PUBLIC_BASE_URL) ||
    absoluteUrl(process.env.NEXT_PUBLIC_SITE_URL) ||
    absoluteUrl(process.env.SITE_URL) ||
    absoluteUrl(process.env.PUBLIC_SITE_URL) ||
    absoluteUrl(process.env.WEB_ORIGIN) ||
    "http://localhost:3000"
  );
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function display(value: string | undefined | null) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : "Not provided";
}

function senderFromEnv() {
  return (
    process.env.CONSTRUCTION_CONTACT_MAIL_FROM ||
    process.env.CONTACT_NOTIFICATION_FROM ||
    process.env.CONTACT_MAIL_FROM ||
    process.env.MAIL_FROM ||
    process.env.RESEND_FROM_EMAIL ||
    process.env.RESEND_FROM ||
    defaultFromEmail
  );
}

function notificationRecipients() {
  return parseEmailList(
    process.env.CONSTRUCTION_CONTACT_MAIL_TO ||
      process.env.CONTACT_NOTIFICATION_EMAIL ||
      process.env.CONTACT_MAIL_TO ||
      process.env.MAIL_TO ||
      process.env.CONSULTATION_NOTIFY_TO,
    constructionContactRecipient,
  );
}

function notificationText({
  payload,
  inquiryId,
  receivedAt,
  page,
}: {
  payload: ContactPayload;
  inquiryId: string;
  receivedAt: string;
  page: string;
}) {
  return [
    "New Construction Inquiry",
    "",
    `Name: ${payload.name}`,
    `Company: ${display(payload.company)}`,
    `Email: ${payload.email}`,
    "Service: Construction planning and site execution",
    `Source: ${page}`,
    `Received At: ${receivedAt}`,
    `Inquiry ID: ${inquiryId}`,
    "",
    "Message:",
    payload.message,
  ].join("\n");
}

function notificationHtml({
  payload,
  inquiryId,
  receivedAt,
  page,
}: {
  payload: ContactPayload;
  inquiryId: string;
  receivedAt: string;
  page: string;
}) {
  const websiteUrl = brandUrl();
  const adminBaseUrl = (process.env.ADMIN_ORIGIN || process.env.ADMIN_PUBLIC_BASE_URL || "http://localhost:3001").replace(/\/+$/, "");
  const adminUrl = `${adminBaseUrl}/contact-inquiries`;
  const safeEmail = escapeHtml(payload.email);
  const fields = [
    ["Client", payload.name],
    ["Company", display(payload.company)],
    ["Email", payload.email],
    ["Service", "Construction planning and site execution"],
    ["Source", page],
    ["Inquiry ID", inquiryId],
  ];

  const fieldCards = fields
    .map(
      ([label, value]) => `
        <td class="field-card-column" width="50%" valign="top" style="padding:0 8px 12px 0">
          <div style="border:1px solid #E7E2D9;border-radius:14px;background:#FFFFFF;padding:18px;box-shadow:0 10px 28px rgba(17,17,17,.05)">
            <p style="margin:0 0 8px;color:#A47A2D;font-family:Arial,Helvetica,sans-serif;font-size:10px;font-weight:700;letter-spacing:.14em;line-height:14px;text-transform:uppercase">${escapeHtml(label)}</p>
            <p style="margin:0;color:#111111;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:700;line-height:22px">${escapeHtml(value)}</p>
          </div>
        </td>
      `,
    )
    .reduce((rows, card, index) => {
      if (index % 2 === 0) rows.push([]);
      rows[rows.length - 1].push(card);
      return rows;
    }, [] as string[][])
    .map((row) => `<tr>${row.join("")}</tr>`)
    .join("");

  return `<!doctype html>
<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>New Construction Inquiry</title>
    <style>
      @media only screen and (max-width:640px) {
        .mail-container {
          width:100% !important;
          max-width:100% !important;
          border-radius:0 !important;
          border-left:0 !important;
          border-right:0 !important;
        }
        .mobile-pad {
          padding-left:24px !important;
          padding-right:24px !important;
        }
        .mobile-title {
          font-size:30px !important;
          line-height:36px !important;
        }
        .field-card-column {
          display:block !important;
          width:100% !important;
          padding:0 0 12px !important;
        }
      }
    </style>
  </head>
  <body style="margin:0;padding:0;background:#F8F5EF;color:#111111">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent">New construction inquiry from ${escapeHtml(payload.name)}</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;background:#F8F5EF">
      <tr>
        <td align="center" style="padding:34px 14px 40px">
          <table role="presentation" class="mail-container" width="100%" cellpadding="0" cellspacing="0" style="width:100%;max-width:680px;border-collapse:separate;border-spacing:0;overflow:hidden;border:1px solid #E7E2D9;border-radius:24px;background:#FFFFFF;box-shadow:0 18px 70px rgba(17,17,17,.08)">
            <tr>
              <td class="mobile-pad" align="center" style="padding:34px 42px 28px;background:#FFFFFF">
                <p style="margin:0;color:#8F1118;font-family:Georgia,'Times New Roman',serif;font-size:44px;font-weight:700;line-height:40px">R</p>
                <p style="margin:6px 0 0;color:#111827;font-family:Georgia,'Times New Roman',serif;font-size:28px;font-weight:700;letter-spacing:.12em;line-height:34px">RACTYSH</p>
                <p style="margin:5px 0 0;color:#6B5653;font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:700;letter-spacing:.28em;line-height:16px;text-transform:uppercase">Construction Contact Desk</p>
                <div style="width:48px;height:2px;margin:24px auto 0;background:#A47A2D"></div>
              </td>
            </tr>
            <tr><td style="height:4px;background:#A3121A;font-size:0;line-height:0">&nbsp;</td></tr>
            <tr>
              <td class="mobile-pad" align="center" style="padding:32px 42px 34px;border-bottom:1px solid #E7E2D9;background:#FFFCF7">
                <p style="margin:0 0 14px;color:#A47A2D;font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:700;letter-spacing:.16em;line-height:16px;text-transform:uppercase">New Lead</p>
                <h1 class="mobile-title" style="margin:0;color:#111111;font-family:Georgia,'Times New Roman',serif;font-size:36px;font-weight:400;line-height:42px">New Construction Inquiry</h1>
                <p style="margin:14px 0 0;color:#6A6A6A;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:22px">Received ${escapeHtml(receivedAt)}</p>
              </td>
            </tr>
            <tr>
              <td class="mobile-pad" style="padding:34px 42px 40px;background:#FFFFFF">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 26px">${fieldCards}</table>
                <div style="margin:0 0 30px;padding:24px;border:1px solid #E7E2D9;border-left:4px solid #A3121A;border-radius:14px;background:#FFFCF7">
                  <p style="margin:0 0 8px;color:#A47A2D;font-family:Arial,Helvetica,sans-serif;font-size:10px;font-weight:700;letter-spacing:.14em;line-height:14px;text-transform:uppercase">Client Message</p>
                  <p style="margin:0;color:#2F2F2F;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:27px;white-space:pre-wrap">${escapeHtml(payload.message)}</p>
                </div>
                <a href="mailto:${safeEmail}" style="display:block;margin:0 0 10px;padding:13px 16px;border-radius:8px;background:#A3121A;color:#FFFFFF;font-family:Arial,Helvetica,sans-serif;font-size:12px;font-weight:700;letter-spacing:.08em;line-height:18px;text-align:center;text-decoration:none;text-transform:uppercase;box-shadow:0 12px 28px rgba(163,18,26,.2)">Reply to Client</a>
                <a href="${escapeHtml(adminUrl)}" style="display:block;margin:0;padding:13px 16px;border:1px solid #E7D6B7;border-radius:8px;background:#FFF7ED;color:#8F1118;font-family:Arial,Helvetica,sans-serif;font-size:12px;font-weight:700;letter-spacing:.08em;line-height:18px;text-align:center;text-decoration:none;text-transform:uppercase">View in Admin Dashboard</a>
              </td>
            </tr>
            <tr>
              <td class="mobile-pad" align="center" style="padding:28px 42px 34px;border-top:1px solid #E7E2D9;background:#FFFFFF">
                <p style="margin:0;color:#111111;font-family:Georgia,'Times New Roman',serif;font-size:19px;font-weight:700;line-height:25px">Ractysh Group</p>
                <a href="${escapeHtml(websiteUrl)}" style="display:inline-block;margin-top:12px;color:#8F1118;font-family:Arial,Helvetica,sans-serif;font-size:12px;font-weight:700;text-decoration:none">${escapeHtml(websiteUrl)}</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

async function sendNotification({
  payload,
  inquiryId,
  receivedAt,
  page,
}: {
  payload: ContactPayload;
  inquiryId: string;
  receivedAt: string;
  page: string;
}): Promise<EmailDeliveryResult> {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    return { sent: false, skipped: true, error: "RESEND_API_KEY is not configured." };
  }

  const response = await fetch(RESEND_EMAILS_API, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "Idempotency-Key": inquiryId,
    },
    body: JSON.stringify({
      from: senderFromEnv(),
      to: notificationRecipients(),
      reply_to: payload.email,
      subject: `New Construction Inquiry - ${payload.name}`,
      html: notificationHtml({ payload, inquiryId, receivedAt, page }),
      text: notificationText({ payload, inquiryId, receivedAt, page }),
      tags: [{ name: "source", value: "construction-contact" }],
    }),
    signal: AbortSignal.timeout(8_000),
  });
  const result = (await response.json().catch(() => ({}))) as { id?: string; message?: string; error?: string };

  if (!response.ok) {
    return {
      sent: false,
      error: result.message || result.error || `Email delivery failed with status ${response.status}.`,
    };
  }

  return { sent: true, id: result.id, sentAt: new Date().toISOString() };
}

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  const payload: ContactPayload = {
    name: clean(body.name, 120),
    email: clean(body.email, 180).toLowerCase(),
    company: clean(body.company, 160),
    message: clean(body.message, 4000),
    website: clean(body.website, 200),
  };
  const issues = validate(payload);

  if (issues.length) {
    return NextResponse.json({ message: issues[0], issues }, { status: 400 });
  }

  const submittedAt = new Date().toISOString();
  const page = sourcePage(request);

  try {
    const inquiry = await prisma.contactInquiry.create({
      data: {
        division: "construction",
        name: payload.name,
        email: payload.email,
        company: payload.company || undefined,
        service: "Construction planning and site execution",
        subject: "Construction website inquiry",
        message: payload.message,
        sourcePage: page,
        status: "new",
      },
    });
    const notification = await sendNotification({
      payload,
      inquiryId: inquiry.id,
      receivedAt: submittedAt,
      page,
    }).catch((error: unknown): EmailDeliveryResult => {
      console.error("Construction inquiry email notification failed:", error);
      return {
        sent: false,
        error: error instanceof Error ? error.message : "Email delivery failed.",
      };
    });

    if (!notification.sent) {
      console.error("Construction inquiry email notification failed:", {
        inquiryId: inquiry.id,
        error: notification.error,
        skipped: notification.skipped,
      });
    }

    return NextResponse.json(
      {
        message: notification.sent
          ? "Thank you. Your project brief has been received, and the Ractysh team will contact you shortly."
          : "Thank you. Your project brief has been received. The Ractysh team will review it shortly.",
        submittedAt,
        inquiry: {
          id: inquiry.id,
          stored: true,
          status: "new",
        },
        notification,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Construction inquiry persistence failed:", error);

    return NextResponse.json(
      {
        message: "Unable to save your project brief. Please try again.",
        submittedAt,
        inquiry: {
          stored: false,
          storageError: error instanceof Error ? error.message : "Inquiry persistence failed.",
        },
      },
      { status: 503 },
    );
  }
}
