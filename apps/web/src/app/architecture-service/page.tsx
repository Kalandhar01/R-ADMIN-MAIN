import type { Metadata } from "next";
import { ArchitectureServiceHubPage } from "@/components/ArchitectureServiceHubPage";
import { MarketingChrome } from "@/components/MarketingChrome";
import { getSiteContent } from "@/lib/api";

export const metadata: Metadata = {
  title: "Architecture Service Hub | Ractysh Group",
  description:
    "Ractysh Architecture Services hub for architecture design, interior design, landscape planning and 3D visualization."
};

export default async function ArchitectureServicePage() {
  const content = await getSiteContent();

  return (
    <MarketingChrome content={content}>
      <ArchitectureServiceHubPage />
    </MarketingChrome>
  );
}
