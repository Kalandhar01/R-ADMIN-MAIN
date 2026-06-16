/* eslint-disable @next/next/no-head-element -- Email markup renders raw HTML outside the Next page tree. */
import * as React from "react";
import type {
  AnchorHTMLAttributes,
  CSSProperties,
  HTMLAttributes,
  ReactNode,
  TableHTMLAttributes,
  TdHTMLAttributes
} from "react";

type ChildrenProps = {
  children?: ReactNode;
};

type BaseProps<TElement> = HTMLAttributes<TElement> & ChildrenProps;

type TableProps = TableHTMLAttributes<HTMLTableElement> & ChildrenProps;
type CellProps = TdHTMLAttributes<HTMLTableCellElement> & ChildrenProps;
type TextProps = BaseProps<HTMLParagraphElement>;
type HeadingProps = BaseProps<HTMLHeadingElement> & {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
};
type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & ChildrenProps;
type ButtonProps = LinkProps;

const hiddenPreviewStyle: CSSProperties = {
  display: "none",
  maxHeight: 0,
  maxWidth: 0,
  overflow: "hidden",
  opacity: 0,
  lineHeight: "1px"
};

function EmailTable({ children, style, ...props }: TableProps) {
  return (
    <table
      role="presentation"
      border={0}
      cellPadding="0"
      cellSpacing="0"
      width="100%"
      style={style}
      {...props}
    >
      <tbody>{children}</tbody>
    </table>
  );
}

export function Html({ children, ...props }: BaseProps<HTMLHtmlElement>) {
  return <html {...props}>{children}</html>;
}

export function Head({ children }: ChildrenProps) {
  return <head>{children}</head>;
}

export function Preview({ children }: ChildrenProps) {
  return <div style={hiddenPreviewStyle}>{children}</div>;
}

export function Body({ children, ...props }: BaseProps<HTMLBodyElement>) {
  return <body {...props}>{children}</body>;
}

export function Container({ children, ...props }: TableProps) {
  return (
    <EmailTable align="center" {...props}>
      <tr>
        <td>{children}</td>
      </tr>
    </EmailTable>
  );
}

export function Section({ children, ...props }: TableProps) {
  return (
    <EmailTable align="center" {...props}>
      <tr>
        <td>{children}</td>
      </tr>
    </EmailTable>
  );
}

export function Row({ children, ...props }: TableProps) {
  return (
    <EmailTable {...props}>
      <tr>{children}</tr>
    </EmailTable>
  );
}

export function Column({ children, ...props }: CellProps) {
  return <td {...props}>{children}</td>;
}

export function Text({ children, ...props }: TextProps) {
  return <p {...props}>{children}</p>;
}

export function Link({ children, ...props }: LinkProps) {
  return <a {...props}>{children}</a>;
}

export function Button({ children, ...props }: ButtonProps) {
  return <a {...props}>{children}</a>;
}

export function Heading({ as = "h1", children, ...props }: HeadingProps) {
  const Tag = as;
  return <Tag {...props}>{children}</Tag>;
}

export function Hr(props: HTMLAttributes<HTMLHRElement>) {
  return <hr {...props} />;
}
