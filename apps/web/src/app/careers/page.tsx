import type { Metadata } from "next";
import { MarketingChrome } from "@/components/MarketingChrome";
import { PremiumCareersPage } from "@/components/PremiumCareersPage";
import { getSiteContent } from "@/lib/api";

export const metadata: Metadata = {
  title: "Careers | Ractysh Group",
  description: "Premium career opportunities across the Ractysh enterprise ecosystem."
};

export default async function CareersPage() {
  const content = await getSiteContent();

  return (
    <MarketingChrome content={content}>
      <PremiumCareersPage />
    </MarketingChrome>
  );
}
