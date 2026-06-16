import type { Metadata } from "next";
import { MarketingChrome } from "@/components/MarketingChrome";
import { OurProjectsPage } from "@/components/OurProjectsPage";
import { getSiteContent } from "@/lib/api";

export const metadata: Metadata = {
  title: "Our Recent Works | Ractysh Group",
  description: "Selected Architecture, Construction, Real Estate, Export-Import and OTC Exchange work from Ractysh Group."
};

export default async function OurWorkRoute() {
  const content = await getSiteContent();

  return (
    <MarketingChrome content={content} className="ractysh-work-typography">
      <OurProjectsPage />
    </MarketingChrome>
  );
}
