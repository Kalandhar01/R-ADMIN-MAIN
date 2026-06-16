import type { Metadata } from "next";
import { ConstructionServiceCommandCenter } from "@/components/ConstructionServiceCommandCenter";
import { MarketingChrome } from "@/components/MarketingChrome";
import { getSiteContent } from "@/lib/api";

export const metadata: Metadata = {
  title: "Construction Service | Ractysh Group",
  description:
    "Premium Ractysh Group construction services across infrastructure, commercial buildings, residential developments and turnkey execution."
};

export default async function ConstructionServicePage() {
  const content = await getSiteContent();

  return (
    <MarketingChrome content={content}>
      <ConstructionServiceCommandCenter />
    </MarketingChrome>
  );
}
