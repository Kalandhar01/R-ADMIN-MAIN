import type { Metadata } from "next";
import { BookDemoExecutivePage } from "@/components/BookDemoExecutivePage";
import { MarketingChrome } from "@/components/MarketingChrome";
import { getSiteContent } from "@/lib/api";

export const metadata: Metadata = {
  title: "Book a Demo | Ractysh",
  description:
    "Book a private executive consultation with Ractysh for Architecture, Construction, Real Estate, Export & Import or OTC Exchange planning."
};

export default async function BookDemoPage() {
  const content = await getSiteContent();

  return (
    <MarketingChrome content={content}>
      <BookDemoExecutivePage />
    </MarketingChrome>
  );
}
