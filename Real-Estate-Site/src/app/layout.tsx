import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ractysh Real Estate | Premium Property Acquisition",
  description: "A premium real estate acquisition platform for residences, commercial assets and investment opportunities across the Ractysh ecosystem.",
  icons: {
    icon: "/favicon.png"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
