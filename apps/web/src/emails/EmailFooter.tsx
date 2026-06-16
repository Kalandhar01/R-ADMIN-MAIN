import { Link, Section, Text } from "./emailPrimitives";
import * as React from "react";
import type { CSSProperties } from "react";
import { ractyshEmailPalette, type RactyshEmailBrand } from "./branding";

interface EmailFooterProps {
  brand: RactyshEmailBrand;
}

const palette = ractyshEmailPalette;
const fontSans = "Arial, Helvetica, sans-serif";
const fontSerif = "Georgia, 'Times New Roman', serif";

const styles = {
  wrapper: {
    padding: "30px 42px 36px",
    borderTop: `1px solid ${palette.goldSoft}`,
    backgroundColor: palette.paper,
    textAlign: "center"
  } satisfies CSSProperties,
  name: {
    margin: "0",
    color: palette.ink,
    fontFamily: fontSerif,
    fontSize: "19px",
    fontWeight: 700,
    lineHeight: "25px"
  } satisfies CSSProperties,
  ecosystem: {
    margin: "7px 0 18px",
    color: palette.deepGold,
    fontFamily: fontSans,
    fontSize: "10px",
    fontWeight: 700,
    letterSpacing: "0.14em",
    lineHeight: "16px",
    textTransform: "uppercase"
  } satisfies CSSProperties,
  division: {
    margin: "0",
    color: palette.muted,
    fontFamily: fontSans,
    fontSize: "13px",
    lineHeight: "22px"
  } satisfies CSSProperties,
  link: {
    display: "inline-block",
    marginTop: "18px",
    color: palette.red,
    fontFamily: fontSans,
    fontSize: "12px",
    fontWeight: 700,
    textDecoration: "none"
  } satisfies CSSProperties
};

export function EmailFooter({ brand }: EmailFooterProps) {
  return (
    <Section style={styles.wrapper}>
      <Text style={styles.name}>Ractysh Group</Text>
      <Text style={styles.ecosystem}>Enterprise Ecosystem</Text>
      {brand.divisions.map((division) => (
        <Text key={division} style={styles.division}>
          {division}
        </Text>
      ))}
      <Link href={brand.homepageUrl} style={styles.link}>
        {brand.homepageUrl}
      </Link>
    </Section>
  );
}
