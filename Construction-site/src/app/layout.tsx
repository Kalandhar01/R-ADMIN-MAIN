import type { Metadata } from "next";
import "./globals.css";
import { Geist, Inter } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-heading",
});

export const metadata: Metadata = {
  title: "Ractysh Construction",
  description:
    "Premium design-build construction, engineering, project management, approvals, and infrastructure services by Ractysh Construction.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable, inter.variable)}>
      <body>{children}</body>
    </html>
  );
}
