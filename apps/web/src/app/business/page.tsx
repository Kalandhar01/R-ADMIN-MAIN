import type { Metadata } from "next";
import { BlogStatus } from "@prisma/client";
import { BusinessEcosystemPage, type BusinessInsight } from "@/components/BusinessEcosystemPage";
import { MarketingChrome } from "@/components/MarketingChrome";
import { getSiteContent } from "@/lib/api";
import { prisma } from "@/lib/server/prisma";

export const metadata: Metadata = {
  title: "Ractysh Group Business Ecosystem | Five Enterprise Pillars",
  description:
    "A premium overview of the Ractysh five-pillar enterprise ecosystem across Architecture, Construction, Real Estate, Export & Import and OTC Exchange."
};

export const dynamic = "force-dynamic";

const insightSelect = {
  title: true,
  slug: true,
  excerpt: true,
  category: true,
  coverImage: true,
  coverImageAlt: true,
  publishedAt: true,
  createdAt: true,
  readTime: true
} as const;

async function getBusinessInsights(): Promise<BusinessInsight[]> {
  try {
    const targetedInsights = await prisma.blog.findMany({
      where: {
        status: BlogStatus.published,
        OR: [
          { category: { in: ["Business", "Strategy", "Operations", "Design", "Architecture", "Construction", "Real Estate", "Export & Import", "OTC Exchange"] } },
          { tags: { hasSome: ["Business", "Enterprise", "Strategy", "Operations", "Investment", "Market Expansion", "Commercial Development"] } }
        ]
      },
      orderBy: [{ featured: "desc" }, { publishedAt: "desc" }, { createdAt: "desc" }],
      take: 6,
      select: insightSelect
    });

    const insights = targetedInsights.length
      ? targetedInsights
      : await prisma.blog.findMany({
          where: { status: BlogStatus.published },
          orderBy: [{ featured: "desc" }, { publishedAt: "desc" }, { createdAt: "desc" }],
          take: 6,
          select: insightSelect
        });

    return insights.map((insight) => ({
      title: insight.title,
      slug: insight.slug,
      excerpt: insight.excerpt,
      category: insight.category,
      coverImage: insight.coverImage,
      coverImageAlt: insight.coverImageAlt,
      publishedAt: (insight.publishedAt ?? insight.createdAt).toISOString(),
      readTime: insight.readTime
    }));
  } catch (error) {
    console.error("Unable to load business insights from Prisma.", error);
    return [];
  }
}

export default async function BusinessPage() {
  const [content, insights] = await Promise.all([getSiteContent(), getBusinessInsights()]);

  return (
    <MarketingChrome content={content}>
      <BusinessEcosystemPage insights={insights} />
    </MarketingChrome>
  );
}
