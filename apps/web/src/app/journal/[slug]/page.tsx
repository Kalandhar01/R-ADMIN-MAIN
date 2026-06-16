import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CalendarDays, Eye } from "lucide-react";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { getNewsletterBySlug, getSiteContent } from "@/lib/api";

export const dynamic = "force-dynamic";

interface JournalArticlePageProps {
  params: Promise<{ slug: string }>;
}

function formatDate(value: string | null): string {
  if (!value) return "Not published";
  return new Intl.DateTimeFormat("en", { month: "long", day: "2-digit", year: "numeric" }).format(new Date(value));
}

function paragraphs(content: string): string[] {
  return content
    .split(/\n{2,}/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Ractysh Journal | Executive Intelligence",
    description: "Executive intelligence published by Ractysh Group."
  };
}

export default async function JournalArticlePage({ params }: JournalArticlePageProps) {
  const [{ slug }, content] = await Promise.all([params, getSiteContent()]);
  const article = await getNewsletterBySlug(slug);

  if (!article?.content) {
    notFound();
  }

  return (
    <>
      <Navbar logoText={content.nav.logoText} items={content.nav.items} />
      <main className="bg-white text-[#111111]">
        <article className="mx-auto max-w-[1180px] px-5 pb-24 pt-32 sm:px-8 lg:px-12">
          <Link
            href="/#executive-intelligence-center"
            className="inline-flex items-center gap-2 text-[0.75rem] font-bold uppercase tracking-[0.16em] text-[#8B1118]"
          >
            <ArrowLeft className="h-4 w-4" />
            Ractysh Journal
          </Link>

          <header className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-end">
            <div>
              <p className="text-[0.72rem] font-bold uppercase tracking-[0.22em] text-[#8B1118]">{article.category}</p>
              <h1 className="mt-5 font-display text-[3.45rem] font-semibold leading-[0.92] tracking-normal text-[#111111] md:text-[5.4rem]">
                {article.title}
              </h1>
              <p className="mt-6 max-w-2xl text-[1.05rem] font-medium leading-8 text-[#5b5148]">{article.excerpt}</p>
              <div className="mt-7 flex flex-wrap items-center gap-4 text-[0.78rem] font-bold uppercase tracking-[0.14em] text-[#70665d]">
                <span>{article.author}</span>
                <span className="h-1 w-1 rounded-full bg-[#C6A45B]" />
                <span className="inline-flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-[#C6A45B]" />
                  {formatDate(article.publishDate)}
                </span>
                <span className="inline-flex items-center gap-2">
                  <Eye className="h-4 w-4 text-[#C6A45B]" />
                  {article.views} views
                </span>
              </div>
            </div>
            <div className="overflow-hidden rounded-[8px] border border-[#ECECEC] shadow-[0_28px_80px_rgba(17,17,17,0.1)]">
              <img src={article.coverImage} alt={article.title} className="aspect-[4/3] w-full object-cover" />
            </div>
          </header>

          <div className="mx-auto mt-14 max-w-[760px]">
            <div className="mb-8 flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <span key={tag} className="rounded-full border border-[#ECECEC] bg-[#FAFAFA] px-3 py-1.5 text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[#8B1118]">
                  {tag}
                </span>
              ))}
            </div>
            <div className="space-y-7 text-[1.05rem] font-medium leading-8 text-[#332d27]">
              {paragraphs(article.content).map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
        </article>
      </main>
      <Footer
        headline={content.footer.headline}
        description={content.footer.description}
        links={content.footer.links}
        socialLinks={content.footer.socialLinks}
      />
    </>
  );
}
