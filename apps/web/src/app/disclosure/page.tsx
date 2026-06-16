import type { Metadata } from "next";
import { DisclosureExperience } from "@/components/DisclosureExperience";
import { getSiteContent } from "@/lib/api";

export const metadata: Metadata = {
  title: "Disclosure | Ractysh Group",
  description: "Important business, project and professional disclosure notes for the Ractysh enterprise ecosystem."
};

export default async function DisclosurePage() {
  const content = await getSiteContent();
  const document = content.legal.documents.find((item) => item.slug === "disclosure") || content.legal.documents[0];
  return <DisclosureExperience content={content} document={document} />;
}
