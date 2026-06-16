import type { Metadata } from "next";
import { MarketingChrome } from "@/components/MarketingChrome";
import { StructuralWorkExperience } from "@/components/StructuralWorkExperience";
import { getServicePage } from "@/data/servicePages";
import { getSiteContent } from "@/lib/api";

const service = getServicePage("structural-work")!;

export const metadata: Metadata = {
  title: `${service.eyebrow} | Ractysh Services`,
  description: service.summary
};

export default async function StructuralWorkPage() {
  const content = await getSiteContent();

  return (
    <MarketingChrome content={content}>
      <StructuralWorkExperience />
    </MarketingChrome>
  );
}
