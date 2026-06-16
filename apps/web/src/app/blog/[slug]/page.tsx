import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, Eye, Heart, Tag } from "lucide-react";
import { MarketingChrome } from "@/components/MarketingChrome";
import { getBlogBySlug, getSiteContent, type BlogSummary } from "@/lib/api";

export const dynamic = "force-dynamic";

interface BlogArticlePageProps {
  params: Promise<{ slug: string }>;
}

type ContentBlock =
  | { type: "heading"; text: string }
  | { type: "quote"; text: string }
  | { type: "paragraph"; text: string };

function siteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || "https://ractysh.com").replace(/\/$/, "");
}

function canonicalUrl(article: BlogSummary) {
  return article.canonicalUrl || `${siteUrl()}/blog/${article.slug}`;
}

function formatDate(value: string | null): string {
  if (!value) return "Not published";
  return new Intl.DateTimeFormat("en", { month: "long", day: "2-digit", year: "numeric" }).format(new Date(value));
}

function contentBlocks(content: string): ContentBlock[] {
  return content
    .split(/\n{2,}/)
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => {
      if (item.startsWith("## ")) return { type: "heading", text: item.replace(/^##\s+/, "") };
      if (item.startsWith("> ")) return { type: "quote", text: item.replace(/^>\s+/, "") };
      return { type: "paragraph", text: item };
    });
}

function jsonLd(article: BlogSummary) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.seoDescription || article.excerpt,
    image: article.coverImage,
    author: {
      "@type": "Organization",
      name: article.author
    },
    publisher: {
      "@type": "Organization",
      name: "Ractysh Group"
    },
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    mainEntityOfPage: canonicalUrl(article),
    keywords: article.tags.join(", "),
    articleSection: article.category
  };
}

export async function generateMetadata({ params }: BlogArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getBlogBySlug(slug, { trackView: false });

  if (!article) {
    return {
      title: "Blog | Ractysh Group",
      description: "Ractysh enterprise insights and editorial publications."
    };
  }

  const title = article.seoTitle || `${article.title} | Ractysh Blog`;
  const description = article.seoDescription || article.excerpt;
  const canonical = canonicalUrl(article);

  return {
    title,
    description,
    alternates: {
      canonical
    },
    openGraph: {
      type: "article",
      url: canonical,
      title,
      description,
      publishedTime: article.publishedAt || undefined,
      modifiedTime: article.updatedAt,
      authors: [article.author],
      tags: article.tags,
      images: [
        {
          url: article.coverImage,
          alt: article.coverImageAlt || article.title
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [article.coverImage]
    }
  };
}

export default async function BlogArticlePage({ params }: BlogArticlePageProps) {
  const [{ slug }, content] = await Promise.all([params, getSiteContent()]);
  const article = await getBlogBySlug(slug);

  if (!article?.content) {
    notFound();
  }

  const blocks = contentBlocks(article.content);

  return (
    <MarketingChrome content={content}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd(article)) }} />
      <article className="bg-[#fbf5e9] text-[#211814]">
        <header className="relative min-h-[82svh] overflow-hidden bg-[#160b0d]">
          <img
            src={article.coverImage}
            alt={article.coverImageAlt || article.title}
            loading="eager"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(13,8,5,0.18)_0%,rgba(13,8,5,0.2)_38%,rgba(13,8,5,0.82)_100%),linear-gradient(90deg,rgba(13,8,5,0.48),transparent_58%)]" />

          <div className="absolute bottom-0 left-0 right-0 px-5 pb-12 pt-28 md:px-8 md:pb-16 xl:px-12">
            <div className="mx-auto max-w-[92rem]">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 rounded-full border border-white/18 bg-white/[0.08] px-4 py-2 text-[0.75rem] font-bold uppercase tracking-[0.16em] text-[#f4d98e] backdrop-blur-xl transition hover:bg-white/[0.13]"
              >
                <ArrowLeft className="h-4 w-4" />
                Ractysh Blog
              </Link>

              <div className="mt-10 max-w-[62rem]">
                <div className="flex flex-wrap items-center gap-3 text-[0.72rem] font-bold uppercase tracking-[0.16em] text-[#f4d98e]">
                  <span className="rounded-full border border-white/18 bg-white/[0.08] px-3 py-1.5 backdrop-blur-xl">
                    {article.category}
                  </span>
                  <span>{article.readTime}</span>
                  <span className="h-1 w-1 rounded-full bg-[#d6b45f]" />
                  <span>{article.author}</span>
                </div>
                <h1 className="mt-6 font-display text-[clamp(3.2rem,7vw,7.8rem)] font-semibold leading-[0.88] tracking-normal text-[#fff7ea]">
                  {article.title}
                </h1>
                <p className="mt-6 max-w-[46rem] text-[1rem] font-medium leading-[1.82] text-[#fff2dc] [text-shadow:0_2px_18px_rgba(0,0,0,0.34)] md:text-[1.14rem]">
                  {article.excerpt}
                </p>
              </div>
            </div>
          </div>
        </header>

        <section className="relative px-5 py-12 md:px-8 md:py-16 xl:px-12">
          <div className="mx-auto grid max-w-[92rem] gap-10 lg:grid-cols-[minmax(0,780px)_minmax(18rem,1fr)] lg:items-start">
            <div className="min-w-0">
              <div className="mb-10 flex flex-wrap gap-3 border-y border-[#ddc58e]/70 py-5 text-[0.75rem] font-bold uppercase tracking-[0.14em] text-[#70665d]">
                <span className="inline-flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-[#C6A45B]" />
                  {formatDate(article.publishedAt)}
                </span>
                <span className="inline-flex items-center gap-2">
                  <Eye className="h-4 w-4 text-[#C6A45B]" />
                  {article.views} views
                </span>
                <span className="inline-flex items-center gap-2">
                  <Heart className="h-4 w-4 text-[#C6A45B]" />
                  {article.likes} likes
                </span>
              </div>

              <div className="space-y-9">
                {blocks.map((block, index) => {
                  if (block.type === "heading") {
                    return (
                      <h2 key={`${block.type}-${index}`} className="border-t border-[#e2cfa0]/70 pt-9 font-display text-[clamp(2rem,4vw,3.25rem)] font-semibold leading-[1] tracking-normal text-[#211814]">
                        {block.text}
                      </h2>
                    );
                  }

                  if (block.type === "quote") {
                    return (
                      <blockquote key={`${block.type}-${index}`} className="border-y border-[#ddc58e]/70 py-8 text-center">
                        <p className="font-display text-[clamp(2rem,4.4vw,3.7rem)] font-semibold leading-[1.04] tracking-normal text-[#241814]">
                          {block.text}
                        </p>
                      </blockquote>
                    );
                  }

                  return (
                    <p key={`${block.type}-${index}`} className="text-[1.06rem] font-medium leading-[2] text-[#382a20] md:text-[1.16rem]">
                      {block.text}
                    </p>
                  );
                })}
              </div>
            </div>

            <aside className="lg:sticky lg:top-28">
              <div className="border-y border-[#dfca94]/70 py-6">
                <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#8b1118]">Article Signals</p>
                <div className="mt-5 grid gap-3">
                  <Signal label="Category" value={article.category} />
                  <Signal label="Published" value={formatDate(article.publishedAt)} />
                  <Signal label="Reading Time" value={article.readTime} />
                  <Signal label="Author" value={article.author} />
                </div>
              </div>

              {article.tags.length ? (
                <div className="mt-8 border-y border-[#dfca94]/70 py-6">
                  <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.24em] text-[#8b1118]">
                    <Tag className="h-4 w-4" />
                    Tags
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {article.tags.map((tag) => (
                      <span key={tag} className="rounded-full border border-[#dfca94] bg-white/58 px-3 py-1.5 text-[0.72rem] font-bold uppercase tracking-[0.12em] text-[#8b1118]">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}
            </aside>
          </div>
        </section>
      </article>
    </MarketingChrome>
  );
}

function Signal({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-[#ead9ad]/70 pb-3 text-sm last:border-b-0 last:pb-0">
      <span className="font-semibold text-[#675a4f]">{label}</span>
      <span className="text-right font-bold text-[#211814]">{value}</span>
    </div>
  );
}
