import type { Metadata } from "next";
import { CopyrightPolicyExperience } from "@/components/CopyrightPolicyExperience";
import { getSiteContent } from "@/lib/api";

export const metadata: Metadata = {
  title: "Copyright Policy | Ractysh Group",
  description: "The intellectual property and content usage standards governing the Ractysh ecosystem."
};

export default async function CopyrightPolicyPage() {
  const content = await getSiteContent();
  const document = content.legal.documents.find((item) => item.slug === "copyright-policy") || content.legal.documents[0];
  return <CopyrightPolicyExperience content={content} document={document} />;
}
