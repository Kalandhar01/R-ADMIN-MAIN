import type { Metadata } from "next";
import { MarketingChrome } from "@/components/MarketingChrome";
import { TurnkeyProjectsExperience } from "@/components/TurnkeyProjectsExperience";
import { getServicePage } from "@/data/servicePages";
import { getSiteContent } from "@/lib/api";

const service = getServicePage("turnkey-projects")!;

export const metadata: Metadata = {
  title: `${service.eyebrow} | Ractysh Services`,
  description: service.summary
};

export default async function TurnkeyProjectsPage() {
  const content = await getSiteContent();

  return (
    <MarketingChrome content={content}>
      <TurnkeyProjectsExperience />
    </MarketingChrome>
  );
}
