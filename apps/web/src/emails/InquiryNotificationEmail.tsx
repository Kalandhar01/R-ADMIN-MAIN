import { Button, Column, Heading, Link, Row, Section, Text } from "./emailPrimitives";
import { render } from "@react-email/render";
import * as React from "react";
import type { CSSProperties } from "react";
import { EmailLayout } from "./EmailLayout";
import { EmailSummaryCard, type EmailSummaryItem } from "./EmailSummaryCard";
import { getRactyshEmailBrand, ractyshEmailPalette, type RactyshEmailBrand } from "./branding";

export interface InquiryDetail {
  label: string;
  value?: string | null;
  href?: string;
}

export interface InquiryNotificationEmailProps {
  adminPath?: string;
  brand?: RactyshEmailBrand;
  clientName: string;
  company?: string | null;
  email: string;
  inquiryId?: string;
  message?: string | null;
  phone?: string | null;
  receivedAt: string;
  requestedService?: string | null;
  sourceLabel?: string;
  sourceUrl?: string | null;
  extraDetails?: InquiryDetail[];
}

const palette = ractyshEmailPalette;
const fontSans = "Arial, Helvetica, sans-serif";
const fontSerif = "Georgia, 'Times New Roman', serif";

const styles = {
  intro: {
    margin: "0 0 20px",
    color: palette.muted,
    fontFamily: fontSans,
    fontSize: "15px",
    lineHeight: "26px",
    textAlign: "center"
  } satisfies CSSProperties,
  badgeRow: {
    margin: "0 0 30px",
    textAlign: "center"
  } satisfies CSSProperties,
  badge: {
    display: "inline-block",
    margin: "0 5px 8px",
    padding: "8px 12px",
    border: `1px solid ${palette.goldSoft}`,
    borderRadius: "999px",
    backgroundColor: palette.paper,
    color: palette.ink,
    fontFamily: fontSans,
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "0.1em",
    lineHeight: "15px",
    textTransform: "uppercase"
  } satisfies CSSProperties,
  badgeAccent: {
    color: palette.red
  } satisfies CSSProperties,
  sectionTitle: {
    margin: "0 0 18px",
    color: palette.ink,
    fontFamily: fontSerif,
    fontSize: "23px",
    fontWeight: 700,
    lineHeight: "29px"
  } satisfies CSSProperties,
  detailCard: {
    padding: "18px",
    border: `1px solid ${palette.goldSoft}`,
    borderRadius: "14px",
    backgroundColor: palette.paper,
    verticalAlign: "top"
  } satisfies CSSProperties,
  detailLabel: {
    margin: "0 0 8px",
    color: palette.deepGold,
    fontFamily: fontSans,
    fontSize: "10px",
    fontWeight: 700,
    letterSpacing: "0.14em",
    lineHeight: "14px",
    textTransform: "uppercase"
  } satisfies CSSProperties,
  detailValue: {
    margin: "0",
    color: palette.ink,
    fontFamily: fontSans,
    fontSize: "14px",
    fontWeight: 700,
    lineHeight: "22px"
  } satisfies CSSProperties,
  detailsWrap: {
    margin: "0 0 30px"
  } satisfies CSSProperties,
  messagePanel: {
    margin: "0 0 30px",
    padding: "24px",
    border: `1px solid ${palette.goldSoft}`,
    borderLeft: `4px solid ${palette.gold}`,
    borderRadius: "14px",
    backgroundColor: "#fffdf8"
  } satisfies CSSProperties,
  message: {
    margin: "0",
    color: palette.ink,
    fontFamily: fontSans,
    fontSize: "15px",
    lineHeight: "27px",
    whiteSpace: "pre-wrap"
  } satisfies CSSProperties,
  actionPanel: {
    padding: "24px",
    border: `1px solid ${palette.goldSoft}`,
    borderRadius: "16px",
    backgroundColor: palette.paper
  } satisfies CSSProperties,
  actionTitle: {
    margin: "0 0 16px",
    color: palette.ink,
    fontFamily: fontSerif,
    fontSize: "22px",
    fontWeight: 700,
    lineHeight: "28px"
  } satisfies CSSProperties,
  actionButton: {
    display: "block",
    margin: "0 0 10px",
    padding: "13px 16px",
    borderRadius: "8px",
    backgroundColor: palette.ink,
    color: palette.ivory,
    fontFamily: fontSans,
    fontSize: "12px",
    fontWeight: 700,
    letterSpacing: "0.08em",
    lineHeight: "18px",
    textAlign: "center",
    textDecoration: "none",
    textTransform: "uppercase"
  } satisfies CSSProperties,
  secondaryButton: {
    backgroundColor: palette.ivory,
    color: palette.red,
    border: `1px solid ${palette.goldSoft}`
  } satisfies CSSProperties
};

function display(value?: string | null): string {
  const trimmed = value?.trim();
  return trimmed ? trimmed : "Not provided";
}

function absoluteOrigin(value: string | undefined): string | undefined {
  const trimmed = value?.trim().replace(/\/+$/, "");
  if (!trimmed) return undefined;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

function adminOrigin(): string {
  return (
    absoluteOrigin(process.env.ADMIN_ORIGIN) ||
    absoluteOrigin(process.env.NEXT_PUBLIC_ADMIN_URL) ||
    absoluteOrigin(process.env.ADMIN_PUBLIC_BASE_URL) ||
    "http://localhost:3001"
  );
}

function adminUrl(_brand: RactyshEmailBrand, path = "/contact-inquiries"): string {
  return new URL(path.replace(/^\/admin(?=\/|$)/, ""), adminOrigin()).href;
}

function detailRows(details: InquiryDetail[]): InquiryDetail[][] {
  const rows = [];
  for (let index = 0; index < details.length; index += 2) {
    rows.push(details.slice(index, index + 2));
  }
  return rows;
}

function DetailsGrid({ details }: { details: InquiryDetail[] }) {
  return (
    <Section style={styles.detailsWrap}>
      <Heading as="h2" style={styles.sectionTitle}>
        Inquiry Details
      </Heading>
      {detailRows(details).map((row, index) => (
        <Row key={`detail-row-${index}`}>
          {row.map((detail) => (
            <Column key={detail.label} style={{ width: "50%", padding: "0 8px 12px 0" }}>
              <Section style={styles.detailCard}>
                <Text style={styles.detailLabel}>{detail.label}</Text>
                {detail.href && detail.value ? (
                  <Link href={detail.href} style={{ ...styles.detailValue, color: palette.red, textDecoration: "none" }}>
                    {display(detail.value)}
                  </Link>
                ) : (
                  <Text style={styles.detailValue}>{display(detail.value)}</Text>
                )}
              </Section>
            </Column>
          ))}
        </Row>
      ))}
    </Section>
  );
}

export function InquiryNotificationEmail({
  adminPath,
  brand = getRactyshEmailBrand(),
  clientName,
  company,
  email,
  inquiryId,
  message,
  phone,
  receivedAt,
  requestedService,
  sourceLabel,
  sourceUrl,
  extraDetails = []
}: InquiryNotificationEmailProps) {
  const summaryItems: EmailSummaryItem[] = [
    { label: "Client Name", value: clientName },
    { label: "Company", value: company },
    { label: "Email", value: email },
    { label: "Phone", value: phone },
    { label: "Requested Service", value: requestedService },
    { label: "Received At", value: receivedAt }
  ];
  const details: InquiryDetail[] = [
    { label: "Client", value: company || clientName },
    { label: "Service", value: requestedService },
    { label: "Email", value: email, href: `mailto:${email}` },
    { label: "Phone", value: phone, href: phone ? `tel:${phone.replace(/[^\d+]/g, "")}` : undefined },
    { label: "Source", value: sourceLabel || sourceUrl, href: sourceUrl || undefined },
    { label: "Inquiry ID", value: inquiryId },
    ...extraDetails
  ];
  const dashboardUrl = adminUrl(brand, adminPath);

  return (
    <EmailLayout
      brand={brand}
      eyebrow="Executive CRM Notification"
      headerDeskLabel="Enterprise Consultation Desk"
      preview={`New enterprise inquiry from ${clientName}`}
      title="New Executive Inquiry Received"
    >
      <Text style={styles.intro}>
        A new enterprise contact request has been submitted through the Ractysh ecosystem.
      </Text>

      <Section style={styles.badgeRow}>
        <Text style={styles.badge}>
          Priority <span style={styles.badgeAccent}>NEW LEAD</span>
        </Text>
        <Text style={styles.badge}>
          Time <span style={styles.badgeAccent}>Received Just Now</span>
        </Text>
      </Section>

      <EmailSummaryCard items={summaryItems} />
      <DetailsGrid details={details} />

      <Section style={styles.messagePanel}>
        <Text style={styles.detailLabel}>Client Message</Text>
        <Text style={styles.message}>{display(message)}</Text>
      </Section>

      <Section style={styles.actionPanel}>
        <Text style={styles.actionTitle}>Quick Actions</Text>
        <Button href={`mailto:${email}`} style={styles.actionButton}>
          Reply to Client
        </Button>
        <Button href={phone ? `tel:${phone.replace(/[^\d+]/g, "")}` : dashboardUrl} style={{ ...styles.actionButton, ...styles.secondaryButton }}>
          Call Client
        </Button>
        <Button href={dashboardUrl} style={{ ...styles.actionButton, ...styles.secondaryButton }}>
          View in Admin Dashboard
        </Button>
      </Section>
    </EmailLayout>
  );
}

export function inquiryNotificationPlainText(input: InquiryNotificationEmailProps): string {
  const lines = [
    "New Executive Inquiry Received",
    "A new enterprise contact request has been submitted through the Ractysh ecosystem.",
    "",
    `Priority: NEW LEAD`,
    `Time: Received Just Now`,
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
  ];

  return lines.filter(Boolean).join("\n");
}

export async function renderInquiryNotificationEmail(input: InquiryNotificationEmailProps) {
  const component = <InquiryNotificationEmail {...input} />;
  const html = await render(component, { pretty: true });

  return {
    html,
    text: inquiryNotificationPlainText(input)
  };
}
