import type { Metadata } from "next";
import { TermsConditionsExperience } from "@/components/TermsConditionsExperience";
import { getSiteContent } from "@/lib/api";

export const metadata: Metadata = {
  title: "Terms & Conditions | Ractysh Group",
  description: "The operational terms governing the use of the Ractysh enterprise ecosystem."
};

export default async function TermsPage() {
  const content = await getSiteContent();
  const document = content.legal.documents.find((item) => item.slug === "terms-and-conditions") || content.legal.documents[0];
  return <TermsConditionsExperience content={content} document={document} />;
}
