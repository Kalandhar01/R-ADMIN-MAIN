import type { Metadata } from "next";
import { DirectorsExecutivePage } from "@/components/DirectorsExecutivePage";
import { MarketingChrome } from "@/components/MarketingChrome";
import { getSiteContent } from "@/lib/api";

export const metadata: Metadata = {
  title: "Directors | Ractysh Group",
  description: "Meet the Ractysh Group directors and executive leadership team."
};

export default async function DirectorsPage() {
  const content = await getSiteContent();

  return (
    <MarketingChrome content={content}>
      <DirectorsExecutivePage founder={content.founder} directors={content.directors} />
    </MarketingChrome>
  );
}
