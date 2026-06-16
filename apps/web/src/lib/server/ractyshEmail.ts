export type EmailBrand = {
  websiteUrl: string;
  logoUrl: string;
};

export type EmailField = {
  label: string;
  value?: string | null;
  href?: string;
};

export type EmailSection = {
  title: string;
  fields?: EmailField[];
  body?: string | null;
  bodyLabel?: string;
};

export type EmailLayoutProps = {
  eyebrow: string;
  title: string;
  previewText?: string;
  sections: EmailSection[];
  brand?: EmailBrand;
};

const defaultLocalUrl = "http://localhost:3000";
const divisions = ["Architecture", "Construction", "Real Estate", "Import & Export", "OTC Exchange"];
const divisionLine = "Architecture &bull; Construction &bull; Real Estate &bull; Import &amp; Export &bull; OTC Exchange";
const defaultSender = "Ractysh <noreply@ractysh.com>";
const productionSenderByKey: Partial<Record<string, string>> = {
  NEWSLETTER_FROM: "Ractysh Newsletter <newsletter@ractysh.com>",
  CONTACT_NOTIFICATION_FROM: "Ractysh Contact <contact@ractysh.com>",
  CONTACT_MAIL_FROM: "Ractysh Contact <contact@ractysh.com>",
  DEMO_MAIL_FROM: "Ractysh Contact <contact@ractysh.com>",
  CONSULTATION_NOTIFY_FROM: "Ractysh Contact <contact@ractysh.com>",
  SERVICE_REQUEST_MAIL_FROM: "Ractysh Contact <contact@ractysh.com>",
  CAREERS_MAIL_FROM: "Ractysh Careers <careers@ractysh.com>",
  MAIL_FROM: defaultSender,
  RESEND_FROM: defaultSender
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

export function getRactyshEmailBrand(request?: Request): EmailBrand {
  const websiteUrl =
    absoluteUrl(process.env.EMAIL_PUBLIC_BASE_URL) ||
    absoluteUrl(process.env.NEXT_PUBLIC_SITE_URL) ||
    absoluteUrl(process.env.SITE_URL) ||
    absoluteUrl(process.env.PUBLIC_SITE_URL) ||
    absoluteUrl(process.env.WEB_ORIGIN) ||
    absoluteUrl(process.env.VERCEL_PROJECT_PRODUCTION_URL) ||
    absoluteUrl(process.env.VERCEL_URL) ||
    requestOrigin(request) ||
    defaultLocalUrl;

  return {
    websiteUrl,
    logoUrl: `${websiteUrl}/brand/ractysh-logo.png`
  };
}

export function senderFromEnv(...keys: string[]): string | undefined {
  for (const key of keys) {
    const value = process.env[key]?.trim();
    if (value) return value;

    const productionDefault = productionSenderByKey[key];
    if (productionDefault) return productionDefault;
  }

  return defaultSender;
}

export function escapeEmailHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function displayEmailValue(value: string | undefined | null): string {
  const trimmed = value?.trim();
  return trimmed ? trimmed : "Not provided";
}

function multiline(value: string): string {
  return escapeEmailHtml(value).replace(/\r?\n/g, "<br>");
}

function renderPreviewText(value: string | undefined): string {
  if (!value) return "";

  return `
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent">
      ${escapeEmailHtml(value)}
    </div>
  `;
}

function renderField(field: EmailField): string {
  const value = displayEmailValue(field.value);
  const valueHtml =
    field.href && field.value
      ? `<a href="${escapeEmailHtml(field.href)}" style="color:#7a0f16;text-decoration:none;font-weight:700">${escapeEmailHtml(
          value
        )}</a>`
      : escapeEmailHtml(value);

  return `
    <tr>
      <td style="padding:0 0 12px">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:separate;border-spacing:0;border:1px solid #eadfc9;border-radius:12px;background:#ffffff">
          <tr>
            <td style="padding:13px 16px 4px;color:#8a7146;font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:700;line-height:1.4;text-transform:uppercase;letter-spacing:.08em">
              ${escapeEmailHtml(field.label)}
            </td>
          </tr>
          <tr>
            <td style="padding:0 16px 14px;color:#181512;font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:700;line-height:1.6">
              ${valueHtml}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `;
}

function renderSection(section: EmailSection): string {
  const fields = section.fields?.length
    ? `
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse">
        ${section.fields.map(renderField).join("")}
      </table>
    `
    : "";
  const body = section.body
    ? `
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:separate;border-spacing:0;border:1px solid #eadfc9;border-radius:12px;background:#ffffff">
        <tr>
          <td style="padding:16px 18px;color:#181512;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.8">
            ${section.bodyLabel ? `<p style="margin:0 0 8px;color:#8a7146;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.08em">${escapeEmailHtml(section.bodyLabel)}</p>` : ""}
            <div>${multiline(displayEmailValue(section.body))}</div>
          </td>
        </tr>
      </table>
    `
    : "";

  return `
    <tr>
      <td style="padding:0 30px 24px">
        <h2 style="margin:0 0 14px;color:#181512;font-family:Georgia,'Times New Roman',serif;font-size:21px;line-height:1.25;font-weight:700">
          ${escapeEmailHtml(section.title)}
        </h2>
        ${fields}
        ${body}
      </td>
    </tr>
  `;
}

export function EmailLayout({ eyebrow, title, previewText, sections, brand = getRactyshEmailBrand() }: EmailLayoutProps): string {
  return `<!doctype html>
<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="x-apple-disable-message-reformatting">
    <title>${escapeEmailHtml(title)}</title>
  </head>
  <body style="margin:0;padding:0;background:#f7f2e8;color:#181512;-webkit-text-size-adjust:100%;text-size-adjust:100%">
    ${renderPreviewText(previewText)}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;background:#f7f2e8">
      <tr>
        <td align="center" style="padding:30px 14px 12px">
          <img src="${escapeEmailHtml(brand.logoUrl)}" width="104" height="104" alt="Ractysh Logo" style="display:block;width:104px;max-width:34vw;height:auto;border:0;outline:none;text-decoration:none">
          <p style="margin:10px 0 0;color:#8a7146;font-family:Arial,Helvetica,sans-serif;font-size:12px;font-weight:700;line-height:1.4;text-transform:uppercase;letter-spacing:.12em">
            Enterprise Ecosystem
          </p>
        </td>
      </tr>
      <tr>
        <td align="center" style="padding:0 14px 36px">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width:100%;max-width:720px;border-collapse:separate;border-spacing:0;overflow:hidden;border:1px solid #e3d4b7;border-radius:18px;background:#fffefa;box-shadow:0 22px 68px rgba(24,18,12,.13)">
            <tr>
              <td style="padding:0;background:#b68a35;height:4px;font-size:0;line-height:0">&nbsp;</td>
            </tr>
            <tr>
              <td align="center" style="padding:28px 30px 24px;background:#ffffff;border-bottom:1px solid #eadfc9">
                <p style="margin:0 0 9px;color:#8a7146;font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:700;line-height:1.4;text-transform:uppercase;letter-spacing:.12em">
                  ${escapeEmailHtml(eyebrow)}
                </p>
                <h1 style="margin:0;color:#181512;font-family:Georgia,'Times New Roman',serif;font-size:30px;line-height:1.15;font-weight:700">
                  Ractysh Group
                </h1>
                <p style="margin:10px 0 0;color:#5f5648;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.7">
                  ${divisionLine}
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:26px 30px 22px;background:#fffaf0">
                <h2 style="margin:0;color:#181512;font-family:Georgia,'Times New Roman',serif;font-size:26px;line-height:1.2;font-weight:700">
                  ${escapeEmailHtml(title)}
                </h2>
              </td>
            </tr>
            ${sections.map(renderSection).join("")}
            <tr>
              <td style="padding:24px 30px 30px;background:#ffffff;border-top:1px solid #eadfc9">
                <p style="margin:0 0 12px;color:#181512;font-family:Georgia,'Times New Roman',serif;font-size:19px;line-height:1.3;font-weight:700">
                  Ractysh Group
                </p>
                <p style="margin:0;color:#5f5648;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.8">
                  ${divisions.map(escapeEmailHtml).join("<br>")}
                </p>
                <p style="margin:16px 0 0;color:#5f5648;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.7">
                  Website:<br>
                  <a href="${escapeEmailHtml(brand.websiteUrl)}" style="color:#7a0f16;text-decoration:none;font-weight:700">${escapeEmailHtml(
                    brand.websiteUrl
                  )}</a>
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}
