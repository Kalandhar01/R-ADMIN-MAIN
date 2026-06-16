import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Row,
  Section,
  Text
} from "./emailPrimitives";
import { render } from "@react-email/render";
import * as React from "react";
import type { CSSProperties } from "react";

export interface WelcomeNewsletterEmailProps {
  name?: string;
  email?: string;
  unsubscribeUrl?: string;
  websiteUrl?: string;
}

const defaultWebsiteUrl = "http://localhost:3000";
const fontSans = "Arial, Helvetica, sans-serif";
const fontSerif = "Georgia, 'Times New Roman', serif";

const welcomeNewsletterSubject = "Welcome to the Ractysh Network";

const ecosystemCards = [
  { title: "Architecture", icon: "⌖" },
  { title: "Construction", icon: "▱" },
  { title: "Real Estate", icon: "▥" },
  { title: "Import & Export", icon: "↻" }
] as const;

function cleanUrl(value: string | undefined): string {
  const trimmed = value?.trim().replace(/\/+$/, "");
  if (!trimmed) return defaultWebsiteUrl;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

const styles = {
  body: {
    margin: 0,
    padding: 0,
    backgroundColor: "#FFFFFF",
    color: "#111111",
    WebkitTextSizeAdjust: "100%"
  } satisfies CSSProperties,
  outer: {
    width: "100%",
    padding: "0",
    backgroundColor: "#FFFFFF"
  } satisfies CSSProperties,
  container: {
    width: "100%",
    maxWidth: "640px",
    margin: "0 auto",
    overflow: "hidden",
    border: "1px solid #E7E2D9",
    borderRadius: "24px",
    backgroundColor: "#FFFFFF",
    boxShadow: "0 18px 70px rgba(17, 17, 17, 0.08)"
  } satisfies CSSProperties,
  topBar: {
    padding: "34px 46px 0"
  } satisfies CSSProperties,
  topText: {
    margin: "0",
    color: "#5F5F5F",
    fontFamily: fontSans,
    fontSize: "13px",
    lineHeight: "20px"
  } satisfies CSSProperties,
  topLink: {
    color: "#5F5F5F",
    fontFamily: fontSans,
    fontSize: "13px",
    lineHeight: "20px",
    textDecoration: "underline"
  } satisfies CSSProperties,
  header: {
    padding: "34px 46px 0",
    textAlign: "center"
  } satisfies CSSProperties,
  logoBlock: {
    margin: "0 auto",
    textAlign: "center"
  } satisfies CSSProperties,
  logoMark: {
    margin: "0",
    color: "#8F1118",
    fontFamily: fontSerif,
    fontSize: "48px",
    fontWeight: 700,
    letterSpacing: "-0.08em",
    lineHeight: "44px",
    textAlign: "center"
  } satisfies CSSProperties,
  wordmark: {
    margin: "6px 0 0",
    color: "#111827",
    fontFamily: fontSerif,
    fontSize: "30px",
    fontWeight: 700,
    letterSpacing: "0.12em",
    lineHeight: "34px",
    textAlign: "center"
  } satisfies CSSProperties,
  logoGroup: {
    margin: "3px 0 0",
    color: "#6B5653",
    fontFamily: fontSans,
    fontSize: "11px",
    fontWeight: 500,
    letterSpacing: "0.52em",
    lineHeight: "14px",
    textAlign: "center",
    textTransform: "uppercase"
  } satisfies CSSProperties,
  eyebrow: {
    margin: "50px 0 0",
    color: "#A47A2D",
    fontFamily: fontSans,
    fontSize: "13px",
    fontWeight: 700,
    letterSpacing: "0.32em",
    lineHeight: "18px",
    textAlign: "center",
    textTransform: "uppercase"
  } satisfies CSSProperties,
  heroTitle: {
    margin: "18px 0 0",
    color: "#111111",
    fontFamily: fontSerif,
    fontSize: "56px",
    fontWeight: 400,
    letterSpacing: "-0.04em",
    lineHeight: "62px",
    textAlign: "center"
  } satisfies CSSProperties,
  shortRule: {
    width: "44px",
    height: "2px",
    margin: "28px auto 0",
    border: "0",
    backgroundColor: "#A47A2D"
  } satisfies CSSProperties,
  subheading: {
    maxWidth: "440px",
    margin: "28px auto 0",
    color: "#5F5F5F",
    fontFamily: fontSans,
    fontSize: "17px",
    fontWeight: 400,
    lineHeight: "29px",
    textAlign: "center"
  } satisfies CSSProperties,
  ecosystem: {
    padding: "58px 40px 0"
  } satisfies CSSProperties,
  labelLine: {
    height: "1px",
    backgroundColor: "#E5E0D8"
  } satisfies CSSProperties,
  sectionLabel: {
    margin: "0",
    color: "#A47A2D",
    fontFamily: fontSans,
    fontSize: "12px",
    fontWeight: 700,
    letterSpacing: "0.32em",
    lineHeight: "16px",
    textAlign: "center",
    textTransform: "uppercase",
    whiteSpace: "nowrap"
  } satisfies CSSProperties,
  cardWrap: {
    paddingTop: "28px"
  } satisfies CSSProperties,
  cardRow: {
    width: "100%",
    tableLayout: "fixed"
  } satisfies CSSProperties,
  cardColumn: {
    width: "20%",
    padding: "0 5px"
  } satisfies CSSProperties,
  card: {
    width: "100%",
    boxSizing: "border-box",
    height: "158px",
    minHeight: "126px",
    padding: "24px 6px 18px",
    border: "1px solid #ECE8E0",
    borderRadius: "12px",
    backgroundColor: "#FFFFFF",
    boxShadow: "0 12px 30px rgba(17, 17, 17, 0.07)",
    textAlign: "center"
  } satisfies CSSProperties,
  cardIcon: {
    margin: "0 0 16px",
    color: "#9A0F17",
    fontFamily: "Georgia, 'Times New Roman', serif",
    fontSize: "34px",
    lineHeight: "36px",
    textAlign: "center"
  } satisfies CSSProperties,
  cardTitle: {
    margin: "0",
    color: "#151515",
    fontFamily: fontSans,
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "0.06em",
    lineHeight: "17px",
    textAlign: "center",
    textTransform: "uppercase"
  } satisfies CSSProperties,
  cardRule: {
    width: "38px",
    height: "1px",
    margin: "12px auto 0",
    border: "0",
    backgroundColor: "#B58733"
  } satisfies CSSProperties,
  executive: {
    padding: "58px 54px 0"
  } satisfies CSSProperties,
  executiveTitleColumn: {
    width: "47%",
    paddingRight: "28px",
    verticalAlign: "top"
  } satisfies CSSProperties,
  executiveCopyColumn: {
    width: "53%",
    paddingLeft: "32px",
    borderLeft: "1px solid #C9A45C",
    verticalAlign: "top"
  } satisfies CSSProperties,
  executiveTitle: {
    margin: "0",
    color: "#111111",
    fontFamily: fontSerif,
    fontSize: "29px",
    fontWeight: 400,
    letterSpacing: "-0.02em",
    lineHeight: "38px"
  } satisfies CSSProperties,
  executiveRule: {
    width: "44px",
    height: "2px",
    margin: "22px 0 0",
    border: "0",
    backgroundColor: "#A47A2D"
  } satisfies CSSProperties,
  paragraph: {
    margin: "0 0 18px",
    color: "#5E5E5E",
    fontFamily: fontSans,
    fontSize: "16px",
    fontWeight: 400,
    lineHeight: "28px"
  } satisfies CSSProperties,
  ctaSection: {
    padding: "42px 46px 58px",
    textAlign: "center"
  } satisfies CSSProperties,
  cta: {
    display: "inline-block",
    minWidth: "268px",
    padding: "18px 34px",
    borderRadius: "10px",
    backgroundColor: "#A3121A",
    boxShadow: "0 16px 34px rgba(163, 18, 26, 0.28)",
    color: "#FFFFFF",
    fontFamily: fontSans,
    fontSize: "14px",
    fontWeight: 700,
    letterSpacing: "0.14em",
    lineHeight: "18px",
    textAlign: "center",
    textDecoration: "none",
    textTransform: "uppercase"
  } satisfies CSSProperties,
  footer: {
    padding: "0 46px 42px",
    textAlign: "center"
  } satisfies CSSProperties,
  footerRule: {
    margin: "0 0 28px",
    borderColor: "#E5E0D8"
  } satisfies CSSProperties,
  footerName: {
    margin: "0 0 14px",
    color: "#111111",
    fontFamily: fontSerif,
    fontSize: "20px",
    fontWeight: 700,
    lineHeight: "26px",
    textAlign: "center"
  } satisfies CSSProperties,
  footerDivisions: {
    margin: "0",
    color: "#5F5F5F",
    fontFamily: fontSans,
    fontSize: "12px",
    fontWeight: 600,
    letterSpacing: "0.16em",
    lineHeight: "22px",
    textAlign: "center",
    textTransform: "uppercase"
  } satisfies CSSProperties,
  goldDot: {
    color: "#B58733",
    padding: "0 10px"
  } satisfies CSSProperties,
  footerLocation: {
    margin: "22px 0 0",
    color: "#6A6A6A",
    fontFamily: fontSans,
    fontSize: "15px",
    lineHeight: "24px",
    textAlign: "center"
  } satisfies CSSProperties,
  copyright: {
    margin: "18px 0 0",
    color: "#6A6A6A",
    fontFamily: fontSans,
    fontSize: "14px",
    lineHeight: "22px",
    textAlign: "center"
  } satisfies CSSProperties,
  unsubscribe: {
    margin: "10px 0 0",
    color: "#8A8A8A",
    fontFamily: fontSans,
    fontSize: "12px",
    lineHeight: "18px",
    textAlign: "center"
  } satisfies CSSProperties,
  unsubscribeLink: {
    color: "#8A7146",
    textDecoration: "underline"
  } satisfies CSSProperties
};

function WelcomeNewsletterEmail({
  name,
  email,
  unsubscribeUrl,
  websiteUrl = defaultWebsiteUrl
}: WelcomeNewsletterEmailProps) {
  const normalizedWebsiteUrl = cleanUrl(websiteUrl);
  const previewName = name?.trim() ? `, ${name.trim()}` : "";

  return (
    <Html>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="x-apple-disable-message-reformatting" />
        <style>
          {`
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
                letter-spacing: -0.035em !important;
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
          `}
        </style>
      </Head>
      <Preview>{`Welcome to the Ractysh Network${previewName}.`}</Preview>
      <Body style={styles.body}>
        <Section style={styles.outer}>
          <Container className="ractysh-container" style={styles.container}>
            <Section className="mobile-top" style={styles.topBar}>
              <Row>
                <Column>
                  <Text style={styles.topText}>Welcome to the Ractysh Network</Text>
                </Column>
                <Column align="right">
                  <Link href={normalizedWebsiteUrl} style={styles.topLink}>
                    View in browser
                  </Link>
                </Column>
              </Row>
            </Section>

            <Section className="mobile-pad" style={styles.header}>
              <Section aria-label="Ractysh Logo" style={styles.logoBlock}>
                <Text style={styles.logoMark}>R</Text>
                <Text style={styles.wordmark}>RACTYSH</Text>
                <Text style={styles.logoGroup}>GROUP</Text>
              </Section>
              <Text style={styles.eyebrow}>Enterprise Ecosystem</Text>
              <Heading className="mobile-hero-title" as="h1" style={styles.heroTitle}>
                Welcome To
                <br />
                The Ractysh Network
              </Heading>
              <Hr style={styles.shortRule} />
              <Text className="mobile-subheading" style={styles.subheading}>
                You now have access to enterprise intelligence, ecosystem updates and strategic insights across the
                Ractysh Group.
              </Text>
            </Section>

            <Section className="mobile-pad" style={styles.ecosystem}>
              <Row>
                <Column style={{ width: "36%" }}>
                  <Section style={styles.labelLine} />
                </Column>
                <Column style={{ width: "28%" }}>
                  <Text style={styles.sectionLabel}>Our Ecosystem</Text>
                </Column>
                <Column style={{ width: "36%" }}>
                  <Section style={styles.labelLine} />
                </Column>
              </Row>

              <Section style={styles.cardWrap}>
                <Row style={styles.cardRow}>
                  {ecosystemCards.map((card) => (
                    <Column key={card.title} className="ecosystem-card-column" style={styles.cardColumn}>
                      <Section style={styles.card}>
                        <Text style={styles.cardIcon}>{card.icon}</Text>
                        <Text style={styles.cardTitle}>{card.title}</Text>
                        <Hr style={styles.cardRule} />
                      </Section>
                    </Column>
                  ))}
                </Row>
              </Section>
            </Section>

            <Section className="mobile-pad" style={styles.executive}>
              <Row>
                <Column className="executive-title-column" style={styles.executiveTitleColumn}>
                  <Heading as="h2" style={styles.executiveTitle}>
                    Connected To A Higher Standard Of Execution
                  </Heading>
                  <Hr style={styles.executiveRule} />
                </Column>
                <Column className="executive-copy-column" style={styles.executiveCopyColumn}>
                  <Text style={styles.paragraph}>
                    The Ractysh ecosystem is built to unite architecture, construction, real estate, trade and private
                    trade operations into one intelligent enterprise network.
                  </Text>
                  <Text style={{ ...styles.paragraph, marginBottom: 0 }}>
                    You will periodically receive curated updates, project intelligence, strategic developments and
                    ecosystem announcements.
                  </Text>
                </Column>
              </Row>
            </Section>

            <Section className="mobile-pad" style={styles.ctaSection}>
              <Button className="mobile-cta" href={normalizedWebsiteUrl} style={styles.cta}>
                Explore Ractysh&nbsp;&nbsp;→
              </Button>
            </Section>

            <Section className="mobile-pad" style={styles.footer}>
              <Hr style={styles.footerRule} />
              <Text style={styles.footerName}>Ractysh Group</Text>
              <Text style={styles.footerDivisions}>
                Architecture <span style={styles.goldDot}>•</span> Construction <span style={styles.goldDot}>•</span>{" "}
                Real Estate <span style={styles.goldDot}>•</span> Import &amp; Export
              </Text>
              <Text style={styles.footerLocation}>Coimbatore <span style={styles.goldDot}>•</span> Palani <span style={styles.goldDot}>•</span> Dindigul</Text>
              <Text style={styles.copyright}>© 2026 Ractysh Group. All rights reserved.</Text>
              {unsubscribeUrl ? (
                <Text style={styles.unsubscribe}>
                  Sent to {email || "your inbox"} ·{" "}
                  <Link href={unsubscribeUrl} style={styles.unsubscribeLink}>
                    Unsubscribe
                  </Link>
                </Text>
              ) : null}
            </Section>
          </Container>
        </Section>
      </Body>
    </Html>
  );
}

function renderWelcomeNewsletterText({
  name,
  email,
  unsubscribeUrl,
  websiteUrl = defaultWebsiteUrl
}: WelcomeNewsletterEmailProps): string {
  const greeting = name?.trim() ? `Hello ${name.trim()},` : "Hello,";

  return [
    greeting,
    "",
    "Welcome to the Ractysh Network.",
    "",
    "You now have access to enterprise intelligence, ecosystem updates and strategic insights across the Ractysh Group.",
    "",
    "Our ecosystem:",
    "Architecture",
    "Construction",
    "Real Estate",
    "Import & Export",
    "",
    "Connected To A Higher Standard Of Execution",
    "",
    "The Ractysh ecosystem is built to unite architecture, construction, real estate and trade operations into one intelligent enterprise network.",
    "You will periodically receive curated updates, project intelligence, strategic developments and ecosystem announcements.",
    "",
    `Explore Ractysh: ${cleanUrl(websiteUrl)}`,
    "",
    "Ractysh Group",
    "Architecture • Construction • Real Estate • Import & Export",
    "Coimbatore • Palani • Dindigul",
    "© 2026 Ractysh Group. All rights reserved.",
    unsubscribeUrl ? `Unsubscribe (${email || "subscriber"}): ${unsubscribeUrl}` : ""
  ]
    .filter(Boolean)
    .join("\n");
}

export async function renderWelcomeNewsletterEmail(props: WelcomeNewsletterEmailProps = {}) {
  const html = await render(<WelcomeNewsletterEmail {...props} />, { pretty: true });

  return {
    html,
    text: renderWelcomeNewsletterText(props),
    subject: welcomeNewsletterSubject
  };
}
