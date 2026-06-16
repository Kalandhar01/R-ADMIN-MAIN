import type { Metadata } from "next";
import { MarketingChrome } from "@/components/MarketingChrome";
import { RealEstateServiceExperience } from "@/components/RealEstateServiceExperience";
import { getCommercialServicePage } from "@/data/commercialServices";
import { getSiteContent } from "@/lib/api";

const service = getCommercialServicePage("real-estate-service")!;

export const metadata: Metadata = {
  title: `${service.title} | Ractysh Group`,
  description: service.summary
};

export default async function RealEstateServicePage() {
  const content = await getSiteContent();

  return (
    <MarketingChrome content={content}>
      <RealEstateServiceExperience />
    </MarketingChrome>
  );
}
