export interface ExecutiveInquiryDetail {
  label: string;
  value?: string | null;
  href?: string;
}

export interface ExecutiveInquiryEmailInput {
  clientName: string;
  company?: string | null;
  email: string;
  phone?: string | null;
  requestedService?: string | null;
  message?: string | null;
  receivedAt: string;
  inquiryId?: string;
  sourceLabel?: string;
  sourceUrl?: string | null;
  adminUrl?: string;
  extraDetails?: ExecutiveInquiryDetail[];
}

const defaultLocalUrl = "http://localhost:3000";
const divisions = ["Architecture", "Construction", "Real Estate", "Import & Export", "OTC Exchange"];

function absoluteUrl(value: string | undefined): string | undefined {
  const trimmed = value?.trim().replace(/\/+$/, "");
  if (!trimmed) return undefined;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

function brandUrl(): string {
  return (
    absoluteUrl(process.env.EMAIL_PUBLIC_BASE_URL) ||
    absoluteUrl(process.env.NEXT_PUBLIC_SITE_URL) ||
    absoluteUrl(process.env.SITE_URL) ||
    absoluteUrl(process.env.PUBLIC_SITE_URL) ||
    absoluteUrl(process.env.WEB_ORIGIN) ||
    defaultLocalUrl
  );
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function display(value: string | undefined | null): string {
  const trimmed = value?.trim();
  return trimmed ? trimmed : "Not provided";
}

function link(value: string, href?: string): string {
  if (!href) return escapeHtml(value);
  return `<a href="${escapeHtml(href)}" style="color:#7a0f16;text-decoration:none;font-weight:700">${escapeHtml(value)}</a>`;
}

function detailCard(detail: ExecutiveInquiryDetail): string {
  return `
    <td width="50%" valign="top" style="padding:0 8px 12px 0">
      <div style="border:1px solid #eadfc9;border-radius:14px;background:#ffffff;padding:18px">
        <p style="margin:0 0 8px;color:#8a7146;font-family:Arial,Helvetica,sans-serif;font-size:10px;font-weight:700;letter-spacing:.14em;line-height:14px;text-transform:uppercase">
          ${escapeHtml(detail.label)}
        </p>
        <p style="margin:0;color:#181512;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:700;line-height:22px">
          ${link(display(detail.value), detail.href)}
        </p>
      </div>
    </td>
  `;
}

function detailRows(details: ExecutiveInquiryDetail[]): string {
  let html = "";
  for (let index = 0; index < details.length; index += 2) {
    html += `<tr>${details.slice(index, index + 2).map(detailCard).join("")}</tr>`;
  }
  return html;
}

function summaryCell(detail: ExecutiveInquiryDetail): string {
  return `
    <td width="50%" valign="top" style="padding:0 10px 16px 0">
      <p style="margin:0 0 6px;color:#8a7146;font-family:Arial,Helvetica,sans-serif;font-size:10px;font-weight:700;letter-spacing:.13em;line-height:15px;text-transform:uppercase">
        ${escapeHtml(detail.label)}
      </p>
      <p style="margin:0;color:#181512;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:700;line-height:21px">
        ${escapeHtml(display(detail.value))}
      </p>
    </td>
  `;
}

function summaryRows(details: ExecutiveInquiryDetail[]): string {
  let html = "";
  for (let index = 0; index < details.length; index += 2) {
    html += `<tr>${details.slice(index, index + 2).map(summaryCell).join("")}</tr>`;
  }
  return html;
}

export function renderExecutiveInquiryText(input: ExecutiveInquiryEmailInput): string {
  return [
    "New Executive Inquiry Received",
    "A new enterprise contact request has been submitted through the Ractysh ecosystem.",
    "",
    "Priority: NEW LEAD",
    "Time: Received Just Now",
    "",
    `Client Name: ${display(input.clientName)}`,
    `Company: ${display(input.company)}`,
    `Email: ${display(input.email)}`,
    `Phone: ${display(input.phone)}`,
    `Requested Service: ${display(input.requestedService)}`,
    `Received At: ${input.receivedAt}`,
    input.inquiryId ? `Inquiry ID: ${input.inquiryId}` : "",
    input.sourceUrl ? `Source: ${input.sourceUrl}` : "",
    ...(input.extraDetails || []).map((detail) => `${detail.label}: ${display(detail.value)}`),
    "",
    "Message:",
    display(input.message)
  ]
    .filter(Boolean)
    .join("\n");
}

export function renderExecutiveInquiryHtml(input: ExecutiveInquiryEmailInput): string {
  const websiteUrl = brandUrl();
  const logoUrl = `${websiteUrl}/brand/ractysh-logo.png`;
  const adminBaseUrl = (process.env.ADMIN_ORIGIN || process.env.ADMIN_PUBLIC_BASE_URL || "http://localhost:3001").replace(/\/+$/, "");
  const adminUrl = input.adminUrl || `${adminBaseUrl}/contact-inquiries`;
  const details: ExecutiveInquiryDetail[] = [
    { label: "Client", value: input.company || input.clientName },
    { label: "Service", value: input.requestedService },
    { label: "Email", value: input.email, href: `mailto:${input.email}` },
    { label: "Phone", value: input.phone, href: input.phone ? `tel:${input.phone.replace(/[^\d+]/g, "")}` : undefined },
    { label: "Source", value: input.sourceLabel || input.sourceUrl, href: input.sourceUrl || undefined },
    { label: "Inquiry ID", value: input.inquiryId },
    ...(input.extraDetails || [])
  ];
  const summary: ExecutiveInquiryDetail[] = [
    { label: "Client Name", value: input.clientName },
    { label: "Company", value: input.company },
    { label: "Email", value: input.email },
    { label: "Phone", value: input.phone },
    { label: "Requested Service", value: input.requestedService }
  ];

  return `<!doctype html>
<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>New Executive Inquiry Received</title>
  </head>
  <body style="margin:0;padding:0;background:#f7f2e8;color:#181512;-webkit-text-size-adjust:100%;text-size-adjust:100%">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent">New enterprise inquiry from ${escapeHtml(input.clientName)}</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;background:#f7f2e8">
      <tr>
        <td align="center" style="padding:34px 14px 40px">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width:100%;max-width:680px;border-collapse:separate;border-spacing:0;overflow:hidden;border:1px solid #eadfc9;border-radius:18px;background:#ffffff;box-shadow:0 26px 84px rgba(24,18,12,.14)">
            <tr>
              <td align="center" style="padding:32px 42px 28px;background:#ffffff">
                <img src="${escapeHtml(logoUrl)}" width="74" height="74" alt="Ractysh Group" style="display:block;width:74px;height:74px;margin:0 auto 14px;border:0;outline:none;text-decoration:none">
                <p style="margin:0;color:#181512;font-family:Georgia,'Times New Roman',serif;font-size:27px;font-weight:700;line-height:32px">Ractysh Group</p>
                <p style="margin:8px 0 0;color:#8a7146;font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:700;letter-spacing:.14em;line-height:16px;text-transform:uppercase">Enterprise Consultation Desk</p>
                <p style="margin:13px auto 0;color:#655a4b;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:20px">${divisions.map(escapeHtml).join(" &bull; ")}</p>
                <div style="height:1px;margin:24px 0 0;background:linear-gradient(90deg,transparent,#b68a35,transparent)"></div>
              </td>
            </tr>
            <tr><td style="height:4px;background:#b68a35;font-size:0;line-height:0">&nbsp;</td></tr>
            <tr>
              <td align="center" style="padding:30px 42px 32px;border-bottom:1px solid #eadfc9;background:#ffffff">
                <p style="margin:0 0 14px;color:#8a7146;font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:700;letter-spacing:.16em;line-height:16px;text-transform:uppercase">Executive CRM Notification</p>
                <h1 style="margin:0;color:#181512;font-family:Georgia,'Times New Roman',serif;font-size:34px;font-weight:700;line-height:40px">New Executive Inquiry Received</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:34px 42px 40px;background:#fffaf0">
                <p style="margin:0 0 20px;color:#655a4b;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:26px;text-align:center">A new enterprise contact request has been submitted through the Ractysh ecosystem.</p>
                <div style="margin:0 0 30px;text-align:center">
                  <span style="display:inline-block;margin:0 5px 8px;padding:8px 12px;border:1px solid #eadfc9;border-radius:999px;background:#ffffff;color:#181512;font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:700;letter-spacing:.1em;line-height:15px;text-transform:uppercase">Priority <span style="color:#7a0f16">NEW LEAD</span></span>
                  <span style="display:inline-block;margin:0 5px 8px;padding:8px 12px;border:1px solid #eadfc9;border-radius:999px;background:#ffffff;color:#181512;font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:700;letter-spacing:.1em;line-height:15px;text-transform:uppercase">Time <span style="color:#7a0f16">Received Just Now</span></span>
                </div>
                <div style="margin:0 0 28px;padding:24px;border:1px solid #eadfc9;border-radius:16px;background:#ffffff">
                  <p style="margin:0 0 18px;color:#181512;font-family:Georgia,'Times New Roman',serif;font-size:21px;font-weight:700;line-height:27px">Client Summary</p>
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${summaryRows(summary)}</table>
                </div>
                <h2 style="margin:0 0 18px;color:#181512;font-family:Georgia,'Times New Roman',serif;font-size:23px;font-weight:700;line-height:29px">Inquiry Details</h2>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 30px">${detailRows(details)}</table>
                <div style="margin:0 0 30px;padding:24px;border:1px solid #eadfc9;border-left:4px solid #b68a35;border-radius:14px;background:#fffdf8">
                  <p style="margin:0 0 8px;color:#8a7146;font-family:Arial,Helvetica,sans-serif;font-size:10px;font-weight:700;letter-spacing:.14em;line-height:14px;text-transform:uppercase">Client Message</p>
                  <p style="margin:0;color:#181512;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:27px;white-space:pre-wrap">${escapeHtml(display(input.message))}</p>
                </div>
                <div style="padding:24px;border:1px solid #eadfc9;border-radius:16px;background:#ffffff">
                  <p style="margin:0 0 16px;color:#181512;font-family:Georgia,'Times New Roman',serif;font-size:22px;font-weight:700;line-height:28px">Quick Actions</p>
                  <a href="mailto:${escapeHtml(input.email)}" style="display:block;margin:0 0 10px;padding:13px 16px;border-radius:8px;background:#181512;color:#fffaf0;font-family:Arial,Helvetica,sans-serif;font-size:12px;font-weight:700;letter-spacing:.08em;line-height:18px;text-align:center;text-decoration:none;text-transform:uppercase">Reply to Client</a>
                  <a href="${escapeHtml(input.phone ? `tel:${input.phone.replace(/[^\d+]/g, "")}` : adminUrl)}" style="display:block;margin:0 0 10px;padding:13px 16px;border:1px solid #eadfc9;border-radius:8px;background:#fffaf0;color:#7a0f16;font-family:Arial,Helvetica,sans-serif;font-size:12px;font-weight:700;letter-spacing:.08em;line-height:18px;text-align:center;text-decoration:none;text-transform:uppercase">Call Client</a>
                  <a href="${escapeHtml(adminUrl)}" style="display:block;margin:0;padding:13px 16px;border:1px solid #eadfc9;border-radius:8px;background:#fffaf0;color:#7a0f16;font-family:Arial,Helvetica,sans-serif;font-size:12px;font-weight:700;letter-spacing:.08em;line-height:18px;text-align:center;text-decoration:none;text-transform:uppercase">View in Admin Dashboard</a>
                </div>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding:30px 42px 36px;border-top:1px solid #eadfc9;background:#ffffff">
                <p style="margin:0;color:#181512;font-family:Georgia,'Times New Roman',serif;font-size:19px;font-weight:700;line-height:25px">Ractysh Group</p>
                <p style="margin:7px 0 18px;color:#8a7146;font-family:Arial,Helvetica,sans-serif;font-size:10px;font-weight:700;letter-spacing:.14em;line-height:16px;text-transform:uppercase">Enterprise Ecosystem</p>
                ${divisions.map((division) => `<p style="margin:0;color:#655a4b;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:22px">${escapeHtml(division)}</p>`).join("")}
                <a href="${escapeHtml(websiteUrl)}" style="display:inline-block;margin-top:18px;color:#7a0f16;font-family:Arial,Helvetica,sans-serif;font-size:12px;font-weight:700;text-decoration:none">${escapeHtml(websiteUrl)}</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}
