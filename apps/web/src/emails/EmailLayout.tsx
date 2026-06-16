import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text
} from "./emailPrimitives";
import * as React from "react";
import type { CSSProperties, ReactNode } from "react";
import { getRactyshNewsletterEmailBrand, ractyshEmailPalette, type RactyshEmailBrand } from "./branding";
import { EmailFooter } from "./EmailFooter";
import { EmailHeader } from "./EmailHeader";

interface EmailLayoutProps {
  brand?: RactyshEmailBrand;
  children: ReactNode;
  eyebrow: string;
  headerDeskLabel?: string;
  preview: string;
  title: string;
}

const fontSans = "Arial, Helvetica, sans-serif";
const fontSerif = "Georgia, 'Times New Roman', serif";
const palette = ractyshEmailPalette;

const styles = {
  body: {
    margin: 0,
    padding: 0,
    backgroundColor: palette.page,
    color: palette.ink,
    WebkitTextSizeAdjust: "100%"
  } satisfies CSSProperties,
  wrapper: {
    padding: "34px 14px 40px"
  } satisfies CSSProperties,
  container: {
    width: "100%",
    maxWidth: "680px",
    margin: "0 auto",
    overflow: "hidden",
    border: `1px solid ${palette.goldSoft}`,
    borderRadius: "18px",
    backgroundColor: palette.paper,
    boxShadow: "0 26px 84px rgba(24,18,12,0.14)"
  } satisfies CSSProperties,
  topRule: {
    height: "4px",
    backgroundColor: palette.gold
  } satisfies CSSProperties,
  hero: {
    padding: "30px 42px 32px",
    borderBottom: `1px solid ${palette.goldSoft}`,
    backgroundColor: palette.paper,
    textAlign: "center"
  } satisfies CSSProperties,
  eyebrow: {
    margin: "0 0 14px",
    color: palette.deepGold,
    fontFamily: fontSans,
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "0.16em",
    lineHeight: "16px",
    textTransform: "uppercase"
  } satisfies CSSProperties,
  title: {
    margin: 0,
    color: palette.ink,
    fontFamily: fontSerif,
    fontSize: "34px",
    fontWeight: 700,
    lineHeight: "40px"
  } satisfies CSSProperties,
  content: {
    padding: "34px 42px 40px",
    backgroundColor: palette.ivory
  } satisfies CSSProperties
};

export function EmailLayout({
  brand = getRactyshNewsletterEmailBrand(),
  children,
  eyebrow,
  headerDeskLabel,
  preview,
  title
}: EmailLayoutProps) {
  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Body style={styles.body}>
        <Section style={styles.wrapper}>
          <Container style={styles.container}>
            <EmailHeader brand={brand} deskLabel={headerDeskLabel} />
            <Section style={styles.topRule} />
            <Section style={styles.hero}>
              <Text style={styles.eyebrow}>{eyebrow}</Text>
              <Heading as="h1" style={styles.title}>
                {title}
              </Heading>
            </Section>
            <Section style={styles.content}>{children}</Section>
            <EmailFooter brand={brand} />
          </Container>
        </Section>
      </Body>
    </Html>
  );
}
