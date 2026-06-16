import type { Metadata } from "next";
import { EcosystemExpansionExperience } from "@/components/EcosystemExpansionExperience";
import { MarketingChrome } from "@/components/MarketingChrome";
import { getSiteContent } from "@/lib/api";

export const metadata: Metadata = {
  title: "Ractysh Import & Export | Global Trade Systems",
  description: "A premium transition experience for the expanding Ractysh Import & Export global trade ecosystem."
};

export default async function RactyshImportExportPage() {
  const content = await getSiteContent();

  return (
    <MarketingChrome content={content}>
      <EcosystemExpansionExperience division="import-export" />
    </MarketingChrome>
  );
}
