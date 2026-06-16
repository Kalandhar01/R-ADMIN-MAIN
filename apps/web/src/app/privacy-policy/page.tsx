import type { Metadata } from "next";
import { PrivacyPolicyExperience } from "@/components/PrivacyPolicyExperience";
import { getSiteContent } from "@/lib/api";

export const metadata: Metadata = {
  title: "Privacy Policy | Ractysh Group",
  description: "How Ractysh collects, manages and protects enterprise information across the ecosystem."
};

export default async function PrivacyPolicyPage() {
  const content = await getSiteContent();
  const document = content.legal.documents.find((item) => item.slug === "privacy-policy") || content.legal.documents[0];
  return <PrivacyPolicyExperience content={content} document={document} />;
}
