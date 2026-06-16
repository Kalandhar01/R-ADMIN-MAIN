import type { Metadata } from "next";
import { ServiceDetailPage } from "@/components/ServiceDetailPage";
import { MarketingChrome } from "@/components/MarketingChrome";
import { getServicePage } from "@/data/servicePages";
import { getSiteContent } from "@/lib/api";

const service = getServicePage("architectural-design")!;

export const metadata: Metadata = {
  title: `${service.eyebrow} | Ractysh Services`,
  description: service.summary
};

export default async function ArchitecturalDesignPage() {
  const content = await getSiteContent();

  return (
    <MarketingChrome content={content}>
      <ServiceDetailPage service={service} />
    </MarketingChrome>
  );
}
