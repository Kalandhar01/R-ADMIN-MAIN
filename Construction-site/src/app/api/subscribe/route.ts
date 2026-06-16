import { NextRequest, NextResponse } from "next/server";

const RESEND_EMAILS_API = "https://api.resend.com/emails";
const DEFAULT_FROM_EMAIL = "Ractysh Construction <onboarding@resend.dev>";
const DEFAULT_WEBSITE_URL = "https://ractysh.com";
const SUBSCRIBE_EMAIL_SUBJECT = "Welcome to the Ractysh Network";

type SubscribePayload = {
  email: string;
  website?: string;
};

function clean(value: unknown, max = 400) {
  return typeof value === "string"
    ? value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim().slice(0, max)
    : "";
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    };

    return entities[character];
  });
}

function validate(payload: SubscribePayload) {
  const issues: string[] = [];

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
    issues.push("Please enter a valid email.");
  }

  if (payload.website) {
    issues.push("Spam protection triggered.");
  }

  return issues;
}

function cleanUrl(value: string | undefined) {
  const trimmed = value?.trim().replace(/\/+$/, "");

  if (!trimmed) return DEFAULT_WEBSITE_URL;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;

  return `https://${trimmed}`;
}

function websiteUrlFromRequest(request: NextRequest) {
  return cleanUrl(
    process.env.NEXT_PUBLIC_SITE_URL ||
      process.env.NEXT_PUBLIC_APP_URL ||
      process.env.SITE_URL ||
      request.nextUrl.origin,
  );
}

function subscriberEmailText(email: string, websiteUrl: string) {
  return [
    "Hello,",
    "",
    "Welcome to the Ractysh Network.",
    "",
    "You are subscribed to Ractysh Construction updates.",
    "You will receive site planning notes, procurement checkpoints, labour flow insights, safety checks, and handover updates.",
    "",
    "Our ecosystem:",
    "Architecture",
    "Construction",
    "Real Estate",
    "Import & Export",
    "",
    "Connected To A Higher Standard Of Site Execution",
    "",
    "Ractysh Construction links drawings, procurement, labour flow, safety checks, and handover tasks to the actual work happening on site.",
    "You will periodically receive curated construction intelligence, project execution notes, and ecosystem announcements.",
    "",
    `Explore Ractysh Construction: ${cleanUrl(websiteUrl)}`,
    "",
    `Subscription email: ${email}`,
    "",
    "Ractysh Group",
    "Architecture - Construction - Real Estate - Import & Export",
    "Coimbatore - Palani - Dindigul",
    "2026 Ractysh Group. All rights reserved.",
  ].join("\n");
}

function subscriberEmailHtml(email: string, websiteUrl: string) {
  const safeEmail = escapeHtml(email);
  const safeWebsiteUrl = escapeHtml(cleanUrl(websiteUrl));

  return `
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="x-apple-disable-message-reformatting" />
        <style>
          @media only screen and (max-width: 640px) {
            .ractysh-container {
              width: 100% !important;
              max-width: 100% !important;
              border-radius: 0 !important;
              border-left: 0 !important;
              border-right: 0 !important;
            }
            .mobile-pad {
              padding-left: 24px !important;
              padding-right: 24px !important;
            }
            .mobile-top {
              padding-left: 24px !important;
              padding-right: 24px !important;
            }
            .mobile-hero-title {
              font-size: 42px !important;
              line-height: 46px !important;
              letter-spacing: 0 !important;
            }
            .mobile-subheading {
              font-size: 16px !important;
              line-height: 26px !important;
            }
            .ecosystem-card-column {
              display: block !important;
              width: 100% !important;
              padding: 0 0 12px !important;
            }
            .executive-title-column,
            .executive-copy-column {
              display: block !important;
              width: 100% !important;
              padding-left: 0 !important;
              padding-right: 0 !important;
            }
            .executive-copy-column {
              margin-top: 26px !important;
              padding-top: 24px !important;
              border-left: 0 !important;
              border-top: 1px solid #C9A45C !important;
            }
            .mobile-cta {
              min-width: 0 !important;
              width: 100% !important;
              box-sizing: border-box !important;
            }
            .mobile-hide {
              display: none !important;
            }
          }
        </style>
      </head>
      <body style="margin:0;padding:0;background-color:#FFFFFF;color:#111111;-webkit-text-size-adjust:100%;">
        <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">
          Welcome to the Ractysh Network. You are subscribed to Ractysh Construction updates.
        </div>
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="width:100%;background-color:#FFFFFF;border-collapse:collapse;">
          <tr>
            <td align="center" style="padding:0;">
              <table role="presentation" class="ractysh-container" width="640" cellspacing="0" cellpadding="0" style="width:100%;max-width:640px;margin:0 auto;overflow:hidden;border:1px solid #E7E2D9;border-radius:24px;background-color:#FFFFFF;box-shadow:0 18px 70px rgba(17,17,17,0.08);border-collapse:separate;">
                <tr>
                  <td class="mobile-top" style="padding:34px 46px 0;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="width:100%;border-collapse:collapse;">
                      <tr>
                        <td align="left" style="padding:0;color:#5F5F5F;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:20px;">
                          Welcome to the Ractysh Network
                        </td>
                        <td align="right" style="padding:0;">
                          <a href="${safeWebsiteUrl}" style="color:#5F5F5F;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:20px;text-decoration:underline;">View in browser</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <tr>
                  <td class="mobile-pad" align="center" style="padding:34px 46px 0;text-align:center;">
                    <p style="margin:0;color:#8F1118;font-family:Georgia,'Times New Roman',serif;font-size:48px;font-weight:700;letter-spacing:0;line-height:44px;text-align:center;">R</p>
                    <p style="margin:6px 0 0;color:#111827;font-family:Georgia,'Times New Roman',serif;font-size:30px;font-weight:700;letter-spacing:0.12em;line-height:34px;text-align:center;">RACTYSH</p>
                    <p style="margin:3px 0 0;color:#6B5653;font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:500;letter-spacing:0.52em;line-height:14px;text-align:center;text-transform:uppercase;">GROUP</p>
                    <p style="margin:50px 0 0;color:#A47A2D;font-family:Arial,Helvetica,sans-serif;font-size:13px;font-weight:700;letter-spacing:0.32em;line-height:18px;text-align:center;text-transform:uppercase;">Construction Intelligence</p>
                    <h1 class="mobile-hero-title" style="margin:18px 0 0;color:#111111;font-family:Georgia,'Times New Roman',serif;font-size:56px;font-weight:400;letter-spacing:0;line-height:62px;text-align:center;">
                      Welcome To<br />
                      The Ractysh Network
                    </h1>
                    <div style="width:44px;height:2px;margin:28px auto 0;background-color:#A47A2D;"></div>
                    <p class="mobile-subheading" style="max-width:440px;margin:28px auto 0;color:#5F5F5F;font-family:Arial,Helvetica,sans-serif;font-size:17px;font-weight:400;line-height:29px;text-align:center;">
                      You now have access to construction execution notes, site planning updates, procurement checkpoints, safety checks, and handover intelligence from Ractysh.
                    </p>
                  </td>
                </tr>

                <tr>
                  <td class="mobile-pad" style="padding:58px 40px 0;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="width:100%;border-collapse:collapse;">
                      <tr>
                        <td width="36%" style="padding:0;"><div style="height:1px;background-color:#E5E0D8;"></div></td>
                        <td width="28%" align="center" style="padding:0;color:#A47A2D;font-family:Arial,Helvetica,sans-serif;font-size:12px;font-weight:700;letter-spacing:0.32em;line-height:16px;text-align:center;text-transform:uppercase;white-space:nowrap;">Our Ecosystem</td>
                        <td width="36%" style="padding:0;"><div style="height:1px;background-color:#E5E0D8;"></div></td>
                      </tr>
                    </table>

                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="width:100%;table-layout:fixed;border-collapse:collapse;margin-top:28px;">
                      <tr>
                        <td class="ecosystem-card-column" width="25%" style="width:25%;padding:0 5px;">
                          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="width:100%;height:158px;min-height:126px;border:1px solid #ECE8E0;border-radius:12px;background-color:#FFFFFF;box-shadow:0 12px 30px rgba(17,17,17,0.07);border-collapse:separate;">
                            <tr>
                              <td align="center" style="padding:24px 6px 18px;text-align:center;">
                                <p style="margin:0 0 16px;color:#9A0F17;font-family:Georgia,'Times New Roman',serif;font-size:34px;line-height:36px;text-align:center;">&#8982;</p>
                                <p style="margin:0;color:#151515;font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:700;letter-spacing:0.06em;line-height:17px;text-align:center;text-transform:uppercase;">Architecture</p>
                                <div style="width:38px;height:1px;margin:12px auto 0;background-color:#B58733;"></div>
                              </td>
                            </tr>
                          </table>
                        </td>
                        <td class="ecosystem-card-column" width="25%" style="width:25%;padding:0 5px;">
                          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="width:100%;height:158px;min-height:126px;border:1px solid #ECE8E0;border-radius:12px;background-color:#FFFFFF;box-shadow:0 12px 30px rgba(17,17,17,0.07);border-collapse:separate;">
                            <tr>
                              <td align="center" style="padding:24px 6px 18px;text-align:center;">
                                <p style="margin:0 0 16px;color:#9A0F17;font-family:Georgia,'Times New Roman',serif;font-size:34px;line-height:36px;text-align:center;">&#9649;</p>
                                <p style="margin:0;color:#151515;font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:700;letter-spacing:0.06em;line-height:17px;text-align:center;text-transform:uppercase;">Construction</p>
                                <div style="width:38px;height:1px;margin:12px auto 0;background-color:#B58733;"></div>
                              </td>
                            </tr>
                          </table>
                        </td>
                        <td class="ecosystem-card-column" width="25%" style="width:25%;padding:0 5px;">
                          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="width:100%;height:158px;min-height:126px;border:1px solid #ECE8E0;border-radius:12px;background-color:#FFFFFF;box-shadow:0 12px 30px rgba(17,17,17,0.07);border-collapse:separate;">
                            <tr>
                              <td align="center" style="padding:24px 6px 18px;text-align:center;">
                                <p style="margin:0 0 16px;color:#9A0F17;font-family:Georgia,'Times New Roman',serif;font-size:34px;line-height:36px;text-align:center;">&#9637;</p>
                                <p style="margin:0;color:#151515;font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:700;letter-spacing:0.06em;line-height:17px;text-align:center;text-transform:uppercase;">Real Estate</p>
                                <div style="width:38px;height:1px;margin:12px auto 0;background-color:#B58733;"></div>
                              </td>
                            </tr>
                          </table>
                        </td>
                        <td class="ecosystem-card-column" width="25%" style="width:25%;padding:0 5px;">
                          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="width:100%;height:158px;min-height:126px;border:1px solid #ECE8E0;border-radius:12px;background-color:#FFFFFF;box-shadow:0 12px 30px rgba(17,17,17,0.07);border-collapse:separate;">
                            <tr>
                              <td align="center" style="padding:24px 6px 18px;text-align:center;">
                                <p style="margin:0 0 16px;color:#9A0F17;font-family:Georgia,'Times New Roman',serif;font-size:34px;line-height:36px;text-align:center;">&#8635;</p>
                                <p style="margin:0;color:#151515;font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:700;letter-spacing:0.06em;line-height:17px;text-align:center;text-transform:uppercase;">Import &amp; Export</p>
                                <div style="width:38px;height:1px;margin:12px auto 0;background-color:#B58733;"></div>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <tr>
                  <td class="mobile-pad" style="padding:58px 54px 0;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="width:100%;border-collapse:collapse;">
                      <tr>
                        <td class="executive-title-column" width="47%" valign="top" style="width:47%;padding-right:28px;vertical-align:top;">
                          <h2 style="margin:0;color:#111111;font-family:Georgia,'Times New Roman',serif;font-size:29px;font-weight:400;letter-spacing:0;line-height:38px;">
                            Connected To A Higher Standard Of Site Execution
                          </h2>
                          <div style="width:44px;height:2px;margin:22px 0 0;background-color:#A47A2D;"></div>
                        </td>
                        <td class="executive-copy-column" width="53%" valign="top" style="width:53%;padding-left:32px;border-left:1px solid #C9A45C;vertical-align:top;">
                          <p style="margin:0 0 18px;color:#5E5E5E;font-family:Arial,Helvetica,sans-serif;font-size:16px;font-weight:400;line-height:28px;">
                            Ractysh Construction links drawings, procurement, labour flow, safety checks, and handover tasks to the actual work happening on site.
                          </p>
                          <p style="margin:0;color:#5E5E5E;font-family:Arial,Helvetica,sans-serif;font-size:16px;font-weight:400;line-height:28px;">
                            You will periodically receive curated construction intelligence, project execution notes, and ecosystem announcements.
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <tr>
                  <td class="mobile-pad" align="center" style="padding:42px 46px 58px;text-align:center;">
                    <a class="mobile-cta" href="${safeWebsiteUrl}" style="display:inline-block;min-width:268px;padding:18px 34px;border-radius:10px;background-color:#A3121A;box-shadow:0 16px 34px rgba(163,18,26,0.28);color:#FFFFFF;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:700;letter-spacing:0.14em;line-height:18px;text-align:center;text-decoration:none;text-transform:uppercase;">
                      Explore Construction&nbsp;&nbsp;&rarr;
                    </a>
                  </td>
                </tr>

                <tr>
                  <td class="mobile-pad" align="center" style="padding:0 46px 42px;text-align:center;">
                    <div style="height:1px;margin:0 0 28px;background-color:#E5E0D8;"></div>
                    <p style="margin:0 0 14px;color:#111111;font-family:Georgia,'Times New Roman',serif;font-size:20px;font-weight:700;line-height:26px;text-align:center;">Ractysh Group</p>
                    <p style="margin:0;color:#5F5F5F;font-family:Arial,Helvetica,sans-serif;font-size:12px;font-weight:600;letter-spacing:0.16em;line-height:22px;text-align:center;text-transform:uppercase;">
                      Architecture <span style="color:#B58733;padding:0 10px;">&bull;</span> Construction <span style="color:#B58733;padding:0 10px;">&bull;</span> Real Estate <span style="color:#B58733;padding:0 10px;">&bull;</span> Import &amp; Export
                    </p>
                    <p style="margin:22px 0 0;color:#6A6A6A;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:24px;text-align:center;">
                      Coimbatore <span style="color:#B58733;padding:0 10px;">&bull;</span> Palani <span style="color:#B58733;padding:0 10px;">&bull;</span> Dindigul
                    </p>
                    <p style="margin:18px 0 0;color:#6A6A6A;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:22px;text-align:center;">&copy; 2026 Ractysh Group. All rights reserved.</p>
                    <p style="margin:10px 0 0;color:#8A8A8A;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:18px;text-align:center;">
                      Sent to ${safeEmail}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
}

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  const payload: SubscribePayload = {
    email: clean(body.email, 180).toLowerCase(),
    website: clean(body.website, 200),
  };
  const issues = validate(payload);

  if (issues.length) {
    return NextResponse.json({ message: issues[0], issues }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const websiteUrl = websiteUrlFromRequest(request);

  if (!apiKey) {
    return NextResponse.json(
      {
        emailQueued: false,
        message: "Subscription received. Project-control notes will reach you soon.",
      },
      { status: 200 },
    );
  }

  try {
    const response = await fetch(RESEND_EMAILS_API, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM_EMAIL || DEFAULT_FROM_EMAIL,
        to: payload.email,
        subject: SUBSCRIBE_EMAIL_SUBJECT,
        html: subscriberEmailHtml(payload.email, websiteUrl),
        text: subscriberEmailText(payload.email, websiteUrl),
      }),
      signal: AbortSignal.timeout(15_000),
    });
    const result = (await response.json().catch(() => ({}))) as { message?: string; error?: string };

    if (!response.ok) {
      return NextResponse.json(
        { message: result.message || result.error || "Unable to send subscription email." },
        { status: response.status },
      );
    }

    return NextResponse.json(
      { emailQueued: true, message: "Subscribed. Please check your inbox." },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Subscription email service is unavailable. Please try again.",
      },
      { status: 503 },
    );
  }
}
