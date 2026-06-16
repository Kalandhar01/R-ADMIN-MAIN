import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ractysh OTC Exchange",
  description:
    "Private OTC exchange desk for verified mandates, controlled quotes, protected routing, and clean settlement reporting.",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
