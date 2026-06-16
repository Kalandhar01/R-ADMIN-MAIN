import type { Metadata } from "next";
import { MarketingChrome } from "@/components/MarketingChrome";
import { getSiteContent } from "@/lib/api";
import { ServicesClient } from "./ServicesClient";

export const metadata: Metadata = {
  title: "Premium Services | Ractysh Group",
  description:
    "Ractysh professional service offerings across Architecture, Construction, Real Estate, Import & Export and OTC Exchange."
};

export default async function ServicesPage() {
  const content = await getSiteContent();

  return (
    <MarketingChrome content={content}>
      <ServicesClient />
    </MarketingChrome>
  );
}
