import type { Metadata } from "next";
import { EcosystemExpansionExperience } from "@/components/EcosystemExpansionExperience";
import { MarketingChrome } from "@/components/MarketingChrome";
import { getSiteContent } from "@/lib/api";

export const metadata: Metadata = {
  title: "Ractysh Design | Spatial Intelligence",
  description: "A premium transition experience for the evolving Ractysh Design architecture and visualization ecosystem."
};

export default async function RactyshDesignPage() {
  const content = await getSiteContent();

  return (
    <MarketingChrome content={content}>
      <EcosystemExpansionExperience division="design" />
    </MarketingChrome>
  );
}
