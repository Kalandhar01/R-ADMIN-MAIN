import type { Metadata } from "next";
import { SitemapDirectoryExperience } from "@/components/SitemapDirectoryExperience";
import { getSiteContent } from "@/lib/api";

export const metadata: Metadata = {
  title: "Sitemap | Ractysh Group",
  description: "A premium enterprise navigation directory for Ractysh Group pages, services and governance records."
};

export default async function SitemapPage() {
  const content = await getSiteContent();
  return <SitemapDirectoryExperience content={content} />;
}
