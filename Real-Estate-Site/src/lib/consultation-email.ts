import { Resend } from "resend";

const defaultAdminEmail = "kalandars2004@gmail.com";
const defaultSender = "Ractysh Real Estate <onboarding@resend.dev>";
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type ConsultationEmailInput = {
  leadId: string;
  name: string;
  email: string;
  phone: string | null;
  investmentInterest: string;
  budget?: string | null;
  propertyType?: string | null;
  message: string | null;
  createdAt: Date;
  ipAddress?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  browser?: string | null;
  device?: string | null;
  source?: string | null;
  pageUrl?: string | null;
  currentPage?: string | null;
  siteUrl?: string | null;
  consultationType?: string | null;
  priority?: string | null;
  leadScore?: string | number | null;
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function paragraph(value: string) {
  return escapeHtml(value).replace(/\n/g, "<br />");
}

function present(value: string | null | undefined) {
  const cleaned = value?.trim();
  return cleaned || "Not provided";
}

function readableInterest(value: string) {
  return present(value)
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function formatSubmittedAt(value: Date) {
  const formatted = new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kolkata"
  }).format(value);

  return `${formatted} IST`;
}

function getSiteUrl(input?: ConsultationEmailInput) {
  const configured = input?.siteUrl || process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || process.env.VERCEL_URL;
  const withProtocol = configured?.startsWith("http") ? configured : configured ? `https://${configured}` : "";

  return withProtocol.replace(/\/$/, "");
}

function getAssetUrl(path: string, input: ConsultationEmailInput) {
  const siteUrl = getSiteUrl(input);

  if (!siteUrl) return "";
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

function getCompanyDetails(input: ConsultationEmailInput) {
  const website = getSiteUrl(input) || "https://ractysh.com";

  return {
    website,
    email: process.env.COMPANY_EMAIL || process.env.NEXT_PUBLIC_COMPANY_EMAIL || "hello@ractysh.com",
    phone: process.env.COMPANY_PHONE || process.env.NEXT_PUBLIC_COMPANY_PHONE || "Not provided",
    address: process.env.COMPANY_ADDRESS || process.env.NEXT_PUBLIC_COMPANY_ADDRESS || "South India"
  };
}

function getAdminUrl(input: ConsultationEmailInput) {
  const configured = process.env.ADMIN_APP_URL || process.env.NEXT_PUBLIC_ADMIN_APP_URL || process.env.ADMIN_URL;
  const base = (configured || getSiteUrl(input) || "https://ractysh.com").replace(/\/$/, "");
  return `${base}/admin/real-estate`;
}

function getMailtoUrl(input: ConsultationEmailInput) {
  const subject = encodeURIComponent(`Ractysh Real Estate Consultation - ${present(input.name)}`);
  return `mailto:${encodeURIComponent(input.email)}?subject=${subject}`;
}

function calculatedLeadScore(input: ConsultationEmailInput) {
  if (input.leadScore !== null && input.leadScore !== undefined && `${input.leadScore}`.trim()) {
    return `${input.leadScore}`.includes("/") ? `${input.leadScore}` : `${input.leadScore}/100`;
  }

  let score = 72;
  if (input.phone) score += 7;
  if (input.budget) score += 8;
  if (input.message) score += 5;
  if (/consultation|site visit/i.test(input.investmentInterest)) score += 6;
  if (input.propertyType) score += 4;

  return `${Math.min(score, 98)}/100`;
}

function dataRow(label: string, value: string | null | undefined) {
  return `
    <tr>
      <td style="padding: 14px 0; border-bottom: 1px solid #E2D8CA; font-family: Arial, Helvetica, sans-serif; font-size: 11px; line-height: 16px; font-weight: 700; letter-spacing: 1.7px; text-transform: uppercase; color: #9A7B4E; width: 42%; vertical-align: top;">${escapeHtml(label)}</td>
      <td style="padding: 14px 0; border-bottom: 1px solid #E2D8CA; font-family: Georgia, 'Times New Roman', serif; font-size: 17px; line-height: 25px; color: #4B2E24; vertical-align: top;">${paragraph(present(value))}</td>
    </tr>
  `;
}

function footerRow(label: string, value: string | null | undefined) {
  return `
    <tr>
      <td style="padding: 10px 0; border-bottom: 1px solid #6E4A3C; font-family: Arial, Helvetica, sans-serif; font-size: 10px; line-height: 15px; font-weight: 700; letter-spacing: 1.7px; text-transform: uppercase; color: #C8A46B; width: 38%; vertical-align: top;">${escapeHtml(label)}</td>
      <td style="padding: 10px 0; border-bottom: 1px solid #6E4A3C; font-family: Arial, Helvetica, sans-serif; font-size: 13px; line-height: 20px; color: #FFF9F1; vertical-align: top;">${paragraph(present(value))}</td>
    </tr>
  `;
}

function summaryTile(label: string, value: string | null | undefined) {
  return `
    <td class="stack-column" width="50%" style="padding: 8px; vertical-align: top;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse: separate; border-spacing: 0; background: #FFFBF5; border: 1px solid #E2D8CA; border-radius: 16px;">
        <tr>
          <td style="padding: 18px 18px 17px;">
            <p style="margin: 0 0 8px; font-family: Arial, Helvetica, sans-serif; font-size: 10px; line-height: 14px; font-weight: 700; letter-spacing: 1.8px; text-transform: uppercase; color: #9A7B4E;">${escapeHtml(label)}</p>
            <p style="margin: 0; font-family: Georgia, 'Times New Roman', serif; font-size: 19px; line-height: 24px; color: #4B2E24;">${paragraph(present(value))}</p>
          </td>
        </tr>
      </table>
    </td>
  `;
}

function getSender() {
  return process.env.RESEND_FROM_EMAIL || process.env.RESEND_FROM || process.env.MAIL_FROM || defaultSender;
}

function getAdminEmail() {
  const configured = process.env.ADMIN_EMAIL || defaultAdminEmail;
  return emailPattern.test(configured) ? configured : defaultAdminEmail;
}

function buildAdminText(input: ConsultationEmailInput) {
  const submittedAt = formatSubmittedAt(input.createdAt);
  const investmentInterest = readableInterest(input.investmentInterest);
  const company = getCompanyDetails(input);

  return `-----------------------------------
Ractysh Real Estate
South India Premium Assets

New Private Consultation Request
Submitted: ${submittedAt}

New Investor Inquiry Received
A prospective client has submitted a consultation request through the Ractysh Real Estate platform.

Lead Priority: High Intent Inquiry

Name:
${present(input.name)}

Email:
${present(input.email)}

Phone:
${present(input.phone)}

Investment Interest:
${investmentInterest}

Budget Range:
${present(input.budget)}

Preferred Property Type:
${present(input.propertyType)}

Message:
${present(input.message)}

Submission Details:
IP Address: ${present(input.ipAddress)}
City: ${present(input.city)}
State: ${present(input.state)}
Country: ${present(input.country)}
Browser: ${present(input.browser)}
Device: ${present(input.device)}
Source: ${present(input.source)}
Page: ${present(input.pageUrl)}
Submitted From: ${present(input.currentPage)}

Investment Summary:
Lead Score: ${calculatedLeadScore(input)}
Interest Category: ${investmentInterest}
Expected Budget: ${present(input.budget)}
Consultation Type: ${present(input.consultationType || investmentInterest)}
Priority: ${present(input.priority || "High Intent")}

Website: ${company.website}
Email: ${company.email}
Phone: ${company.phone}
Address: ${company.address}
-----------------------------------`;
}

function buildUserText(input: ConsultationEmailInput) {
  const investmentInterest = readableInterest(input.investmentInterest);

  return `Thank you for contacting Ractysh Real Estate.

Our advisory team has received your request and will reach out shortly.

Summary:

Name: ${present(input.name)}
Interest: ${investmentInterest}

Regards,
Ractysh Real Estate`;
}

function buildAdminHtml(input: ConsultationEmailInput) {
  const submittedAt = formatSubmittedAt(input.createdAt);
  const investmentInterest = readableInterest(input.investmentInterest);
  const company = getCompanyDetails(input);
  const logoUrl = getAssetUrl("/favicon.png", input);
  const watermarkUrl = getAssetUrl("/images/la-perla/mark.svg", input);
  const adminUrl = getAdminUrl(input);
  const viewLeadUrl = `${adminUrl}?tab=leads&lead=${encodeURIComponent(input.leadId)}`;
  const mailtoUrl = getMailtoUrl(input);
  const priority = present(input.priority || "High Intent");
  const consultationType = present(input.consultationType || investmentInterest);

  return `
    <!doctype html>
    <html lang="en">
      <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="x-apple-disable-message-reformatting" />
        <title>New Private Consultation Request</title>
        <style>
          @media screen and (max-width: 640px) {
            .email-shell { width: 100% !important; }
            .email-padding { padding-left: 18px !important; padding-right: 18px !important; }
            .mobile-title { font-size: 34px !important; line-height: 38px !important; }
            .stack-column { display: block !important; width: 100% !important; padding-left: 0 !important; padding-right: 0 !important; }
            .button-stack { display: block !important; width: 100% !important; margin-bottom: 10px !important; }
            .button-stack a { display: block !important; }
          }
          .button-brown:hover { background: #C8A46B !important; color: #4B2E24 !important; }
          .button-gold:hover { background: #4B2E24 !important; color: #FFF9F1 !important; }
          .button-muted:hover { background: #C8A46B !important; color: #4B2E24 !important; }
        </style>
      </head>
      <body style="margin: 0; padding: 0; background: #F5F1EA; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;">
        <div style="display: none; overflow: hidden; line-height: 1px; opacity: 0; max-height: 0; max-width: 0;">
          New investor inquiry received through the Ractysh Real Estate platform.
        </div>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse; background: #F5F1EA;">
          <tr>
            <td align="center" class="email-padding" style="padding: 34px 22px;">
              <table role="presentation" width="680" cellpadding="0" cellspacing="0" class="email-shell" style="width: 680px; max-width: 680px; border-collapse: separate; border-spacing: 0; background: #FFF9F1; border: 1px solid #E2D8CA; border-radius: 28px; overflow: hidden;">
                <tr>
                  <td style="padding: 34px 38px 28px; background: #F5F1EA;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
                      <tr>
                        <td align="center" style="padding: 0 0 22px;">
                          ${logoUrl ? `<img src="${escapeHtml(logoUrl)}" width="56" height="56" alt="Ractysh Real Estate" style="display: block; width: 56px; height: 56px; border: 0; outline: none; text-decoration: none; margin: 0 auto 16px;" />` : ""}
                          <p style="margin: 0; font-family: Arial, Helvetica, sans-serif; font-size: 13px; line-height: 18px; font-weight: 700; letter-spacing: 3.2px; text-transform: uppercase; color: #4B2E24;">RACTYSH REAL ESTATE</p>
                          <p style="margin: 7px 0 0; font-family: Georgia, 'Times New Roman', serif; font-size: 16px; line-height: 22px; font-style: italic; color: #8B6B43;">South India Premium Assets</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="height: 1px; line-height: 1px; background: #C8A46B;">&nbsp;</td>
                      </tr>
                      <tr>
                        <td align="center" style="padding: 22px 0 0;">
                          <p style="margin: 0; font-family: Georgia, 'Times New Roman', serif; font-size: 26px; line-height: 32px; color: #4B2E24;">New Private Consultation Request</p>
                          <p style="margin: 10px 0 0; font-family: Arial, Helvetica, sans-serif; font-size: 12px; line-height: 18px; color: #7C675B;">Submitted: <strong style="color: #4B2E24;">${escapeHtml(submittedAt)}</strong></p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <tr>
                  <td style="padding: 0 38px 34px; background: #F5F1EA;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse: separate; border-spacing: 0; background: #4B2E24; border-radius: 24px; overflow: hidden;">
                      <tr>
                        <td style="padding: 34px 30px; background: #4B2E24;">
                          ${watermarkUrl ? `<div style="background-image: url('${escapeHtml(watermarkUrl)}'); background-repeat: no-repeat; background-position: right 8px top 2px; background-size: 112px auto;">` : "<div>"}
                            <p style="margin: 0 0 13px; font-family: Arial, Helvetica, sans-serif; font-size: 11px; line-height: 16px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #C8A46B;">Lead Priority Indicator</p>
                            <h1 class="mobile-title" style="margin: 0; font-family: Georgia, 'Times New Roman', serif; font-size: 42px; line-height: 46px; font-weight: normal; color: #FFF9F1;">New Investor Inquiry Received</h1>
                            <p style="margin: 16px 0 0; max-width: 520px; font-family: Arial, Helvetica, sans-serif; font-size: 15px; line-height: 25px; color: #EDE0D1;">A prospective client has submitted a consultation request through the Ractysh Real Estate platform.</p>
                            <table role="presentation" cellpadding="0" cellspacing="0" style="margin-top: 24px; border-collapse: separate; border-spacing: 0;">
                              <tr>
                                <td style="padding: 10px 15px; border: 1px solid #C8A46B; border-radius: 999px; background: #5C392D;">
                                  <span style="font-family: Arial, Helvetica, sans-serif; font-size: 12px; line-height: 16px; font-weight: 700; letter-spacing: 1.4px; text-transform: uppercase; color: #F3D79F;">● High Intent Inquiry</span>
                                </td>
                              </tr>
                            </table>
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <tr>
                  <td style="padding: 0 38px 26px; background: #FFF9F1;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
                      <tr>
                        <td style="padding: 30px 30px 18px; background: #FFFCF7; border: 1px solid #E2D8CA; border-radius: 22px;">
                          <p style="margin: 0 0 18px; font-family: Georgia, 'Times New Roman', serif; font-size: 27px; line-height: 32px; color: #4B2E24;">Investor Information</p>
                          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
                            ${dataRow("Full Name", input.name)}
                            ${dataRow("Email Address", input.email)}
                            ${dataRow("Phone Number", input.phone)}
                            ${dataRow("Investment Interest", investmentInterest)}
                            ${dataRow("Budget Range", input.budget)}
                            ${dataRow("Preferred Property Type", input.propertyType)}
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <tr>
                  <td style="padding: 0 38px 26px; background: #FFF9F1;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse: separate; border-spacing: 0; background: #F8F1E7; border-left: 4px solid #C8A46B; border-radius: 18px;">
                      <tr>
                        <td style="padding: 25px 28px;">
                          <p style="margin: 0 0 10px; font-family: Arial, Helvetica, sans-serif; font-size: 11px; line-height: 16px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #9A7B4E;">Investor Notes</p>
                          <p style="margin: 0; font-family: Georgia, 'Times New Roman', serif; font-size: 19px; line-height: 30px; color: #4B2E24;">${paragraph(present(input.message))}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <tr>
                  <td style="padding: 0 38px 26px; background: #FFF9F1;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse: separate; border-spacing: 0; background: #FBF4EA; border: 1px solid #E2D8CA; border-radius: 22px;">
                      <tr>
                        <td style="padding: 28px 30px 16px;">
                          <p style="margin: 0 0 18px; font-family: Georgia, 'Times New Roman', serif; font-size: 26px; line-height: 31px; color: #4B2E24;">Submission Details</p>
                          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
                            ${dataRow("IP Address", input.ipAddress)}
                            ${dataRow("City", input.city)}
                            ${dataRow("State", input.state)}
                            ${dataRow("Country", input.country)}
                            ${dataRow("Browser", input.browser)}
                            ${dataRow("Device", input.device)}
                            ${dataRow("Source", input.source)}
                            ${dataRow("Page", input.pageUrl)}
                            ${dataRow("Submitted From", input.currentPage)}
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <tr>
                  <td style="padding: 0 30px 26px; background: #FFF9F1;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
                      <tr>
                        ${summaryTile("Lead Score", calculatedLeadScore(input))}
                        ${summaryTile("Interest Category", investmentInterest)}
                      </tr>
                      <tr>
                        ${summaryTile("Expected Budget", input.budget)}
                        ${summaryTile("Consultation Type", consultationType)}
                      </tr>
                      <tr>
                        ${summaryTile("Priority", priority)}
                        ${summaryTile("Lead ID", input.leadId)}
                      </tr>
                    </table>
                  </td>
                </tr>

                <tr>
                  <td align="center" style="padding: 4px 38px 34px; background: #FFF9F1;">
                    <table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse: separate; border-spacing: 10px 0;">
                      <tr>
                        <td class="button-stack" align="center" style="border-radius: 12px; background: #4B2E24;">
                          <a class="button-brown" href="${escapeHtml(viewLeadUrl)}" style="display: inline-block; padding: 15px 22px; font-family: Arial, Helvetica, sans-serif; font-size: 12px; line-height: 16px; font-weight: 700; letter-spacing: 1.4px; text-transform: uppercase; color: #FFF9F1; text-decoration: none; border-radius: 12px;">View Lead</a>
                        </td>
                        <td class="button-stack" align="center" style="border-radius: 12px; background: #C8A46B;">
                          <a class="button-gold" href="${escapeHtml(mailtoUrl)}" style="display: inline-block; padding: 15px 22px; font-family: Arial, Helvetica, sans-serif; font-size: 12px; line-height: 16px; font-weight: 700; letter-spacing: 1.4px; text-transform: uppercase; color: #4B2E24; text-decoration: none; border-radius: 12px;">Contact Investor</a>
                        </td>
                        <td class="button-stack" align="center" style="border-radius: 12px; background: #6A4739;">
                          <a class="button-muted" href="${escapeHtml(adminUrl)}" style="display: inline-block; padding: 15px 22px; font-family: Arial, Helvetica, sans-serif; font-size: 12px; line-height: 16px; font-weight: 700; letter-spacing: 1.4px; text-transform: uppercase; color: #FFF9F1; text-decoration: none; border-radius: 12px;">Open CRM</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <tr>
                  <td style="padding: 32px 38px 34px; background: #4B2E24;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
                      <tr>
                        <td align="center">
                          <p style="margin: 0; font-family: Arial, Helvetica, sans-serif; font-size: 12px; line-height: 18px; font-weight: 700; letter-spacing: 2.4px; text-transform: uppercase; color: #C8A46B;">Ractysh Real Estate</p>
                          <p style="margin: 9px 0 18px; font-family: Georgia, 'Times New Roman', serif; font-size: 22px; line-height: 28px; color: #FFF9F1;">Private Acquisition Platform</p>
                          <p style="margin: 0 0 22px; font-family: Arial, Helvetica, sans-serif; font-size: 13px; line-height: 24px; color: #EDE0D1;">Premium Residences &nbsp;|&nbsp; Commercial Assets &nbsp;|&nbsp; Investment Opportunities</p>
                          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
                            ${footerRow("Website", company.website)}
                            ${footerRow("Email", company.email)}
                            ${footerRow("Phone", company.phone)}
                            ${footerRow("Address", company.address)}
                          </table>
                          <p style="margin: 24px 0 0; font-family: Arial, Helvetica, sans-serif; font-size: 11px; line-height: 19px; color: #D8CBBF;">This consultation request was submitted through the official Ractysh Real Estate platform.</p>
                          <p style="margin: 8px 0 0; font-family: Arial, Helvetica, sans-serif; font-size: 11px; line-height: 19px; color: #D8CBBF;">All investor information is confidential and intended solely for authorized Ractysh Real Estate personnel.</p>
                        </td>
                      </tr>
                    </table>
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

function buildUserHtml(input: ConsultationEmailInput) {
  const investmentInterest = readableInterest(input.investmentInterest);

  return `
    <div style="font-family: Georgia, serif; color: #3e2b24; background: #f1ecea; padding: 32px;">
      <div style="max-width: 600px; margin: 0 auto; background: #fffaf6; border: 1px solid rgba(62,43,36,.14); border-radius: 18px; padding: 28px;">
        <p style="margin: 0 0 10px; font: 700 11px Arial, sans-serif; letter-spacing: .18em; text-transform: uppercase; color: #8d7542;">Ractysh Real Estate</p>
        <h1 style="margin: 0 0 18px; font-size: 30px; line-height: 1;">Your Consultation Request Has Been Received</h1>
        <p style="margin: 0 0 16px; font: 16px/1.6 Arial, sans-serif;">Thank you for contacting Ractysh Real Estate.</p>
        <p style="margin: 0 0 24px; font: 16px/1.6 Arial, sans-serif;">Our advisory team has received your request and will reach out shortly.</p>
        <div style="border-top: 1px solid rgba(62,43,36,.12); padding-top: 18px;">
          <p style="margin: 0 0 8px; font: 700 11px Arial, sans-serif; letter-spacing: .14em; text-transform: uppercase; color: #8d7542;">Summary</p>
          <p style="margin: 0 0 6px; font: 16px/1.5 Arial, sans-serif;"><strong>Name:</strong> ${paragraph(present(input.name))}</p>
          <p style="margin: 0; font: 16px/1.5 Arial, sans-serif;"><strong>Interest:</strong> ${paragraph(investmentInterest)}</p>
        </div>
        <p style="margin: 24px 0 0; font: 16px/1.6 Arial, sans-serif;">Regards,<br />Ractysh Real Estate</p>
      </div>
    </div>
  `;
}

export async function sendConsultationEmails(input: ConsultationEmailInput) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.error("[real-estate-lead-email] RESEND_API_KEY is not configured.", { leadId: input.leadId });
    return;
  }

  const resend = new Resend(apiKey);
  const sender = getSender();
  const adminEmail = getAdminEmail();
  const adminText = buildAdminText(input);
  const userText = buildUserText(input);

  const results = await Promise.allSettled([
    resend.emails.send({
      from: sender,
      to: adminEmail,
      replyTo: input.email,
      subject: "New Consultation Request - Ractysh Real Estate",
      text: adminText,
      html: buildAdminHtml(input)
    }),
    resend.emails.send({
      from: sender,
      to: input.email,
      subject: "Your Consultation Request Has Been Received",
      text: userText,
      html: buildUserHtml(input)
    })
  ]);

  results.forEach((result, index) => {
    const emailType = index === 0 ? "admin" : "customer";

    if (result.status === "rejected") {
      console.error("[real-estate-lead-email] Email send rejected.", {
        leadId: input.leadId,
        emailType,
        error: result.reason
      });
      return;
    }

    if (result.value.error) {
      console.error("[real-estate-lead-email] Resend email failed.", {
        leadId: input.leadId,
        emailType,
        statusCode: result.value.error.statusCode,
        message: result.value.error.message
      });
    }
  });
}
