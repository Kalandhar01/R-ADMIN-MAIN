import type { Metadata } from "next";
import { MarketingChrome } from "@/components/MarketingChrome";
import { OtcExchangeServiceExperience } from "@/components/OtcExchangeServiceExperience";
import { getSiteContent } from "@/lib/api";

export const metadata: Metadata = {
  title: "OTC Exchange Operations | Ractysh Group",
  description: "Private transaction coordination, settlement governance and institutional exchange management."
};

export default async function OtcExchangeServicePage() {
  const content = await getSiteContent();

  return (
    <MarketingChrome content={content}>
      <OtcExchangeServiceExperience />
    </MarketingChrome>
  );
}
