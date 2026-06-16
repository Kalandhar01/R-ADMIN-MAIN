import type { Metadata } from "next";
import { BlogEnterprisePage } from "@/components/BlogEnterprisePage";
import { MarketingChrome } from "@/components/MarketingChrome";
import { getBlogIndex, getSiteContent } from "@/lib/api";

export const metadata: Metadata = {
  title: "Enterprise Blog | Ractysh Group",
  description:
    "Ractysh articles on Architecture, Construction, Real Estate, Export & Import, OTC Exchange and enterprise coordination."
};

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const [content, blogData] = await Promise.all([getSiteContent(), getBlogIndex({ limit: 24 })]);

  return (
    <MarketingChrome content={content}>
      <BlogEnterprisePage data={blogData} />
    </MarketingChrome>
  );
}
