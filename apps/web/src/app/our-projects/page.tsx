import type { Metadata } from "next";
import { MarketingChrome } from "@/components/MarketingChrome";
import { OurProjectsPage } from "@/components/OurProjectsPage";
import { getSiteContent } from "@/lib/api";

export const metadata: Metadata = {
  title: "Our Work | Ractysh Group",
  description:
    "Selected enterprise work shaped through Architecture, Construction, Real Estate, Export & Import and OTC Exchange workflows."
};

export default async function OurProjectsRoute() {
  const content = await getSiteContent();

  return (
    <MarketingChrome content={content} className="ractysh-work-typography">
      <OurProjectsPage />
    </MarketingChrome>
  );
}
