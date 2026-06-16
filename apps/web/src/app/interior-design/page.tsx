import type { Metadata } from "next";
import { InteriorDesignCinematicPage } from "@/components/InteriorDesignCinematicPage";
import { MarketingChrome } from "@/components/MarketingChrome";
import { getServicePage } from "@/data/servicePages";
import { getSiteContent } from "@/lib/api";

const service = getServicePage("interior-design")!;

export const metadata: Metadata = {
  title: `${service.eyebrow} | Ractysh Services`,
  description: service.summary
};

export default async function InteriorDesignPage() {
  const content = await getSiteContent();

  return (
    <MarketingChrome content={content}>
      <InteriorDesignCinematicPage />
    </MarketingChrome>
  );
}
