import type { Metadata } from "next";
import { FounderEnterprisePage } from "@/components/FounderEnterprisePage";
import { MarketingChrome } from "@/components/MarketingChrome";
import { getSiteContent } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getSiteContent();

  return {
    title: `${content.founder.name} | Chairman & Founder | Ractysh Group`,
    description:
      "Founder profile for Ractysh Group, presenting enterprise leadership, vision, trust and long-term execution."
  };
}

export default async function FounderPage() {
  const content = await getSiteContent();

  return (
    <MarketingChrome content={content}>
      <FounderEnterprisePage founder={content.founder} />
    </MarketingChrome>
  );
}
