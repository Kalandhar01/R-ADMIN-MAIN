import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-manrope",
  display: "swap"
});

const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap"
});

export const metadata: Metadata = {
  title: "Ractysh Command Center | Admin",
  description: "Enterprise command center for Ractysh operations."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn(manrope.variable, cormorantGaramond.variable, "font-sans", geist.variable)}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
