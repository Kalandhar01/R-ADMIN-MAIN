import type { Metadata } from "next";
import { Bodoni_Moda, Inter, Manrope } from "next/font/google";
import "./globals.css";
import { seoContent } from "@/lib/architecturePremiumContent";

const siteUrl = "https://architecture.ractysh.com";
const siteTitle = seoContent.metaTitle;
const siteDescription = seoContent.metaDescription;
const ogTitle = seoContent.ogTitle;
const ogDescription = seoContent.ogDescription;
const twitterTitle = seoContent.twitterTitle;
const twitterDescription = seoContent.twitterDescription;
const previewImage = "/images/architecture/ractysh-built-beyond-blueprints-poster.webp";
const iconImage = "/images/architecture/ractysh-architecture-logo.webp";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap"
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap"
});

const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap"
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: siteTitle,
  description: siteDescription,
  alternates: {
    canonical: "/"
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Ractysh Architecture",
    title: ogTitle,
    description: ogDescription,
    images: [
      {
        url: previewImage,
        width: 1200,
        height: 675,
        alt: "Ractysh Architecture luxury residence with composed light and proportion"
      }
    ],
    locale: "en_IN"
  },
  twitter: {
    card: "summary_large_image",
    title: twitterTitle,
    description: twitterDescription,
    images: [previewImage]
  },
  keywords: [...seoContent.keywords],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1
    }
  },
  icons: {
    icon: iconImage,
    apple: iconImage
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${manrope.variable} ${inter.variable} ${bodoni.variable}`}>
      <body>{children}</body>
    </html>
  );
}
