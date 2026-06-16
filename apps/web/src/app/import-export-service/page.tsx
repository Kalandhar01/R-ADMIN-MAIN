import type { Metadata } from "next";
import { ImportExportGlobalTradePage } from "@/components/ImportExportGlobalTradePage";
import { MarketingChrome } from "@/components/MarketingChrome";
import { getCommercialServicePage } from "@/data/commercialServices";
import { getSiteContent } from "@/lib/api";

const service = getCommercialServicePage("import-export-service")!;

export const metadata: Metadata = {
  title: `${service.title} | Ractysh Group`,
  description: service.summary
};

export default async function ImportExportServicePage() {
  const content = await getSiteContent();

  return (
    <MarketingChrome content={content}>
      <ImportExportGlobalTradePage />
    </MarketingChrome>
  );
}
