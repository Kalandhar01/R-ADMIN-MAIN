import { Img, Section, Text } from "./emailPrimitives";
import * as React from "react";
import type { CSSProperties } from "react";
import { ractyshEmailPalette, type RactyshEmailBrand } from "./branding";

interface EmailHeaderProps {
  brand: RactyshEmailBrand;
  deskLabel?: string;
}

const palette = ractyshEmailPalette;
const fontSans = "Arial, Helvetica, sans-serif";
const fontSerif = "Georgia, 'Times New Roman', serif";

const styles = {
  wrapper: {
    padding: "32px 42px 28px",
    backgroundColor: palette.paper,
    textAlign: "center"
  } satisfies CSSProperties,
  logo: {
    display: "block",
    width: "74px",
    height: "74px",
    margin: "0 auto 14px",
    border: 0,
    outline: "none",
    textDecoration: "none"
  } satisfies CSSProperties,
  wordmark: {
    margin: "0",
    color: palette.ink,
    fontFamily: fontSerif,
    fontSize: "27px",
    fontWeight: 700,
    lineHeight: "32px"
  } satisfies CSSProperties,
  desk: {
    margin: "8px 0 0",
    color: palette.deepGold,
    fontFamily: fontSans,
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "0.14em",
    lineHeight: "16px",
    textTransform: "uppercase"
  } satisfies CSSProperties,
  divisions: {
    margin: "13px auto 0",
    color: palette.muted,
    fontFamily: fontSans,
    fontSize: "12px",
    lineHeight: "20px"
  } satisfies CSSProperties,
  divider: {
    height: "1px",
    margin: "24px 0 0",
    background: `linear-gradient(90deg, transparent, ${palette.gold}, transparent)`
  } satisfies CSSProperties
};

export function EmailHeader({ brand, deskLabel = "Enterprise Ecosystem" }: EmailHeaderProps) {
  return (
    <Section style={styles.wrapper}>
      <Img src={brand.logoUrl} width="74" height="74" alt="Ractysh Group" style={styles.logo} />
      <Text style={styles.wordmark}>Ractysh Group</Text>
      <Text style={styles.desk}>{deskLabel}</Text>
      <Text style={styles.divisions}>{brand.divisions.join(" • ")}</Text>
      <Section style={styles.divider} />
    </Section>
  );
}
