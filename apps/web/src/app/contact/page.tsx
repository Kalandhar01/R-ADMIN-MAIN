import type { Metadata } from "next";
import { ContactEnterprisePage } from "@/components/ContactEnterprisePage";
import { MarketingChrome } from "@/components/MarketingChrome";
import { getSiteContent } from "@/lib/api";

export const metadata: Metadata = {
  title: "Contact Ractysh Group",
  description:
    "Contact Ractysh Group for Architecture, Construction, Real Estate, Export & Import and OTC Exchange inquiries."
};

export default async function ContactPage() {
  const content = await getSiteContent();
  const location = content.locations[0];

  return (
    <MarketingChrome content={content}>
      <ContactEnterprisePage location={location} />
    </MarketingChrome>
  );
}
