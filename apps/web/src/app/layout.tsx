import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import localFont from "next/font/local";
import { Suspense } from "react";
import "./globals.css";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import { TransitionProvider } from "@/components/providers/TransitionProvider";
import { ChatBot } from "@/components/ChatBot";

const buildManifestFont = localFont({
  src: "../../../../node_modules/next/dist/next-devtools/server/font/geist-latin.woff2",
  variable: "--font-build-manifest",
  display: "swap"
});

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
  title: "Ractysh Group",
  description:
    "A five-pillar private enterprise group across Architecture, Construction, Real Estate, Export & Import and OTC Exchange.",
  icons: {
    icon: [{ url: "/brand/ractysh-icon-32.png", type: "image/png", sizes: "32x32" }],
    apple: [{ url: "/brand/ractysh-icon-192.png", type: "image/png", sizes: "192x192" }]
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${buildManifestFont.variable} ${manrope.variable} ${cormorantGaramond.variable}`}>
      <head>
        <link rel="preload" as="image" href="/landingpage-light-theme.avif" type="image/avif" fetchPriority="high" />
      </head>
      <body className="page-noise font-sans">
        <SmoothScrollProvider>
          <Suspense fallback={null}>
            <TransitionProvider>
              {children}
              <ChatBot />
            </TransitionProvider>
          </Suspense>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
