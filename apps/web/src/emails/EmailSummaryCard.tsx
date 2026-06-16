import { Column, Row, Section, Text } from "./emailPrimitives";
import * as React from "react";
import type { CSSProperties } from "react";
import { ractyshEmailPalette } from "./branding";

export interface EmailSummaryItem {
  label: string;
  value?: string | null;
}

interface EmailSummaryCardProps {
  items: EmailSummaryItem[];
  title?: string;
}

const palette = ractyshEmailPalette;
const fontSans = "Arial, Helvetica, sans-serif";
const fontSerif = "Georgia, 'Times New Roman', serif";

const styles = {
  wrapper: {
    margin: "0 0 28px",
    padding: "24px",
    border: `1px solid ${palette.goldSoft}`,
    borderRadius: "16px",
    backgroundColor: palette.paper
  } satisfies CSSProperties,
  title: {
    margin: "0 0 18px",
    color: palette.ink,
    fontFamily: fontSerif,
    fontSize: "21px",
    fontWeight: 700,
    lineHeight: "27px"
  } satisfies CSSProperties,
  label: {
    margin: "0 0 6px",
    color: palette.deepGold,
    fontFamily: fontSans,
    fontSize: "10px",
    fontWeight: 700,
    letterSpacing: "0.13em",
    lineHeight: "15px",
    textTransform: "uppercase"
  } satisfies CSSProperties,
  value: {
    margin: "0",
    color: palette.ink,
    fontFamily: fontSans,
    fontSize: "14px",
    fontWeight: 700,
    lineHeight: "21px"
  } satisfies CSSProperties,
  cell: {
    width: "50%",
    padding: "0 10px 16px 0",
    verticalAlign: "top"
  } satisfies CSSProperties
};

function display(value?: string | null): string {
  const trimmed = value?.trim();
  return trimmed ? trimmed : "Not provided";
}

export function EmailSummaryCard({ items, title = "Client Summary" }: EmailSummaryCardProps) {
  const rows = [];

  for (let index = 0; index < items.length; index += 2) {
    rows.push(items.slice(index, index + 2));
  }

  return (
    <Section style={styles.wrapper}>
      <Text style={styles.title}>{title}</Text>
      {rows.map((row, rowIndex) => (
        <Row key={`summary-row-${rowIndex}`}>
          {row.map((item) => (
            <Column key={item.label} style={styles.cell}>
              <Text style={styles.label}>{item.label}</Text>
              <Text style={styles.value}>{display(item.value)}</Text>
            </Column>
          ))}
        </Row>
      ))}
    </Section>
  );
}
