export function buildAdminNotificationHtml(data: {
  fullName: string;
  email: string;
  phone: string;
  selectedServices: string[];
  projectType: string;
  projectLocation: string;
  budgetRange: string;
  timeline: string;
  message: string;
  createdAt: string;
}) {
  const servicesList =
    data.selectedServices.length > 0
      ? data.selectedServices.join(", ")
      : "Not specified";

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#f4f4f4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">
          <!-- Header -->
          <tr>
            <td style="background-color:#1A1A1A;padding:32px 40px;text-align:center;">
              <h1 style="margin:0;font-size:22px;font-weight:700;color:#C4A87C;letter-spacing:1px;">NEW CONSULTATION REQUEST</h1>
              <p style="margin:8px 0 0;font-size:13px;color:#888888;">Ractysh Construction & Engineering</p>
            </td>
          </tr>
          <!-- Badge -->
          <tr>
            <td style="padding:24px 40px 0;">
              <table cellpadding="0" cellspacing="0" style="background-color:#fef8e7;border-radius:8px;padding:12px 20px;width:100%;">
                <tr>
                  <td>
                    <p style="margin:0;font-size:13px;color:#8B6B4A;font-weight:600;">A new consultation request was submitted on ${data.createdAt}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Fields -->
          <tr>
            <td style="padding:24px 40px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                ${fieldRow("Name", data.fullName)}
                ${fieldRow("Email", data.email)}
                ${fieldRow("Phone", data.phone || "Not provided")}
                ${fieldRow("Services Requested", servicesList)}
                ${fieldRow("Project Type", data.projectType || "Not specified")}
                ${fieldRow("Location", data.projectLocation || "Not specified")}
                ${fieldRow("Budget Range", data.budgetRange || "Not specified")}
                ${fieldRow("Timeline", data.timeline || "Not specified")}
              </table>
            </td>
          </tr>
          <!-- Message -->
          ${
            data.message
              ? `<tr>
            <td style="padding:0 40px 24px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#fafafa;border-radius:8px;border-left:3px solid #C4A87C;">
                <tr>
                  <td style="padding:16px 20px;">
                    <p style="margin:0 0 6px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:1px;color:#888888;">Project Details</p>
                    <p style="margin:0;font-size:14px;line-height:1.6;color:#333333;">${data.message}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>`
              : ""
          }
          <!-- CTA -->
          <tr>
            <td style="padding:0 40px 32px;">
              <table cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center">
                    <a href="${process.env.ADMIN_ORIGIN || "http://localhost:3000"}/admin/leads" style="display:inline-block;background-color:#8B6B4A;color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:8px;font-size:14px;font-weight:600;">View in Admin Panel</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background-color:#fafafa;padding:20px 40px;text-align:center;border-top:1px solid #eeeeee;">
              <p style="margin:0;font-size:12px;color:#999999;">Ractysh Group — Construction Division</p>
              <p style="margin:4px 0 0;font-size:11px;color:#bbbbbb;">This is an automated notification from your consultation request system.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function buildClientConfirmationHtml(data: {
  fullName: string;
  selectedServices: string[];
  projectType: string;
}) {
  const servicesList =
    data.selectedServices.length > 0
      ? `<ul style="margin:12px 0 0;padding:0;list-style:none;">
${data.selectedServices.map((s) => `  <li style="padding:8px 12px;margin-bottom:6px;background-color:#f8f6f2;border-radius:6px;font-size:14px;color:#333333;">${s}</li>`).join("\n")}
</ul>`
      : `<p style="margin:8px 0 0;font-size:14px;color:#666666;">General consultation</p>`;

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#f4f4f4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">
          <!-- Header -->
          <tr>
            <td style="background-color:#1A1A1A;padding:40px;text-align:center;">
              <h1 style="margin:0;font-size:24px;font-weight:700;color:#C4A87C;">Thank You, ${data.fullName}.</h1>
              <p style="margin:10px 0 0;font-size:15px;color:#cccccc;">We've received your construction inquiry.</p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <p style="margin:0;font-size:15px;line-height:1.7;color:#333333;">Dear ${data.fullName},</p>
              <p style="margin:16px 0 0;font-size:15px;line-height:1.7;color:#333333;">
                Thank you for reaching out to <strong>Ractysh Construction & Engineering</strong>. 
                Our team has received your consultation request and will review it shortly.
              </p>

              <h3 style="margin:28px 0 0;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:1px;color:#8B6B4A;">Services Requested</h3>
              ${servicesList}

              <h3 style="margin:28px 0 0;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:1px;color:#8B6B4A;">Next Steps</h3>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:12px;">
                <tr>
                  <td style="padding:12px 16px;background-color:#f8f6f2;border-radius:8px;">
                    <p style="margin:0;font-size:14px;line-height:1.8;color:#333333;">
                      <strong>1.</strong> Our team reviews your requirements<br>
                      <strong>2.</strong> We prepare a tailored proposal<br>
                      <strong>3.</strong> You'll hear from us within 24 hours
                    </p>
                  </td>
                </tr>
              </table>

              <h3 style="margin:28px 0 0;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:1px;color:#8B6B4A;">Need Immediate Assistance?</h3>
              <p style="margin:8px 0 0;font-size:14px;line-height:1.7;color:#333333;">
                Call us: <strong style="color:#8B6B4A;">+91 98765 43210</strong><br>
                Email: <strong style="color:#8B6B4A;">construction@ractysh.com</strong>
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background-color:#fafafa;padding:24px 40px;text-align:center;border-top:1px solid #eeeeee;">
              <p style="margin:0;font-size:13px;font-weight:600;color:#1A1A1A;">Ractysh Construction & Engineering</p>
              <p style="margin:4px 0 0;font-size:12px;color:#999999;">ISO-aligned · 25+ integrated services · PAN-India delivery</p>
              <p style="margin:8px 0 0;font-size:11px;color:#bbbbbb;">This email was sent in response to your consultation request.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function fieldRow(label: string, value: string): string {
  return `<tr>
    <td style="padding:6px 0;border-bottom:1px solid #f0f0f0;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td width="160" style="padding:8px 0;">
            <span style="font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;color:#888888;">${label}</span>
          </td>
          <td style="padding:8px 0;">
            <span style="font-size:14px;color:#333333;">${value}</span>
          </td>
        </tr>
      </table>
    </td>
  </tr>`;
}

export async function sendEmail({
  to,
  subject,
  html,
  replyTo,
}: {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail =
    process.env.RESEND_FROM_EMAIL ||
    "Ractysh Construction <newsletter@ractysh.com>";

  if (!apiKey) {
    console.warn("RESEND_API_KEY not set — email not sent");
    return { sent: false, reason: "no_api_key" };
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [to],
      subject,
      html,
      ...(replyTo ? { reply_to: replyTo } : {}),
    }),
    signal: AbortSignal.timeout(15_000),
  });

  if (!res.ok) {
    const errBody = await res.text().catch(() => "unknown");
    console.error("Resend email send failed:", res.status, errBody);
    return { sent: false, reason: `resend_error: ${res.status}` };
  }

  return { sent: true };
}
