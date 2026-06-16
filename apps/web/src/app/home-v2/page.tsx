import type { Metadata } from "next";
import { HomeV2TestingPage } from "@/components/HomeV2TestingPage";
import { MarketingChrome } from "@/components/MarketingChrome";
import { getSiteContent } from "@/lib/api";

export const metadata: Metadata = {
  title: "Home V2 Testing | Ractysh Group",
  description:
    "A cinematic testing version of the Ractysh homepage for enterprise ecosystem storytelling, premium execution and architectural operations."
};

export default async function HomeV2Route() {
  const content = await getSiteContent();

  return (
    <MarketingChrome content={content} className="home-v2-typography">
      <HomeV2TestingPage />
    </MarketingChrome>
  );
}
