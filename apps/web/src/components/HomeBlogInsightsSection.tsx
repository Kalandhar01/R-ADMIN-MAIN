"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type CSSProperties, type RefObject } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, BookOpenText, CalendarDays, Clock3 } from "lucide-react";
import type { BlogListPayload, BlogSummary } from "@/lib/api";

const smoothEase = [0.22, 1, 0.36, 1] as const;

export function HomeBlogInsightsSection({ data }: { data: BlogListPayload | null }) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const reduceMotion = Boolean(useReducedMotion());
  const motionScale = useMobileMotionScale();
  const { isInView, hasEntered } = useViewportSignal(sectionRef);

  const articles = useMemo(() => uniqueArticles([...(data?.featured ? [data.featured] : []), ...(data?.latest || []), ...(data?.recentInsights || []), ...(data?.blogs || [])]), [data]);
  const featured = data?.featured || articles[0] || null;
  const feedArticles = useMemo(() => articles.filter((article) => article.id !== featured?.id).slice(0, 5), [articles, featured?.id]);
  const newestArticleId = useMemo(() => newestArticle(articles)?.id || featured?.id || null, [articles, featured?.id]);
  const revealDistance = reduceMotion ? 0 : 30 * motionScale;
  const ambientActive = isInView && hasEntered && !reduceMotion;

  if (!featured && !feedArticles.length) {
    return null;
  }

  return (
    <motion.section
      ref={sectionRef}
      className="relative isolate overflow-hidden bg-[#fffdf8] px-5 py-20 text-[#201714] md:px-8 lg:py-24 xl:px-12"
      initial={reduceMotion ? false : { opacity: 0, y: revealDistance }}
      animate={hasEntered || reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: revealDistance }}
      transition={{ duration: reduceMotion ? 0 : 0.8, ease: smoothEase }}
    >
      <div className="absolute left-0 top-0 h-px w-full bg-[#efe3c5]" aria-hidden="true">
        <motion.div
          className="h-full origin-left bg-[#b68a35]"
          initial={reduceMotion ? false : { scaleX: 0 }}
          animate={hasEntered || reduceMotion ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.95, ease: smoothEase }}
        />
      </div>

      <motion.div
        className="pointer-events-none absolute inset-[-72px] opacity-[0.04] will-change-transform [background-image:linear-gradient(rgba(95,73,42,0.14)_1px,transparent_1px),linear-gradient(90deg,rgba(95,73,42,0.1)_1px,transparent_1px)] [background-size:84px_84px]"
        aria-hidden="true"
        animate={ambientActive ? { x: [0, 18 * motionScale, 0], y: [0, 12 * motionScale, 0] } : { x: 0, y: 0 }}
        transition={{ duration: 28, repeat: ambientActive ? Infinity : 0, ease: "easeInOut" }}
      />

      <div className="relative mx-auto max-w-[92rem]">
        <header className="mb-12 grid gap-7 border-y border-[#dcc891]/55 py-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div className="max-w-[58rem]">
            <motion.div
              className="flex items-center gap-4"
              initial={reduceMotion ? false : { opacity: 0, y: 12 * motionScale }}
              animate={hasEntered || reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 * motionScale }}
              transition={{ duration: reduceMotion ? 0 : 0.55, ease: smoothEase, delay: reduceMotion ? 0 : 0.08 }}
            >
              <span className="h-px w-12 bg-[#b68a35]" />
              <p className="text-[11px] font-semibold uppercase tracking-[0] text-[#8b1118]">CMS Insights</p>
            </motion.div>
            <motion.h2
              className="mt-5 font-display text-[2.6rem] font-semibold leading-[0.92] tracking-[0] text-[#1a120f] sm:text-[3.7rem] lg:text-[5rem]"
              initial={reduceMotion ? false : { opacity: 0, y: 16 * motionScale }}
              animate={hasEntered || reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 * motionScale }}
              transition={{ duration: reduceMotion ? 0 : 0.68, ease: smoothEase, delay: reduceMotion ? 0 : 0.16 }}
            >
              Enterprise intelligence, published from the CMS desk.
            </motion.h2>
          </div>

          <div className="flex flex-wrap items-center gap-3 lg:justify-end">
            <LiveCmsBadge active={ambientActive} reduceMotion={reduceMotion} />
            <Link
              href="/blog"
              className="group inline-flex min-h-11 items-center justify-center gap-2 rounded-[4px] border border-[#b68a35]/55 bg-[#1f1713] px-4 text-[0.78rem] font-bold uppercase tracking-[0] text-[#fff9ed] shadow-[0_14px_34px_rgba(68,45,20,0.14)] transition duration-300 hover:border-[#c69b42] hover:bg-[#2a1d16] hover:shadow-[0_18px_46px_rgba(68,45,20,0.2)]"
            >
              View Blog
              <ArrowUpRight className="h-4 w-4 text-[#d9b967] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </header>

        <div className="grid gap-10 xl:grid-cols-[minmax(0,1.08fr)_minmax(24rem,0.92fr)] xl:items-start">
          {featured ? (
            <FeaturedHomeBlog
              article={featured}
              hasEntered={hasEntered || reduceMotion}
              isNewest={featured.id === newestArticleId}
              motionScale={motionScale}
              reduceMotion={reduceMotion}
            />
          ) : null}

          {feedArticles.length ? (
            <BlogIntelligenceFeed
              articles={feedArticles}
              hasEntered={hasEntered || reduceMotion}
              newestArticleId={newestArticleId}
              motionScale={motionScale}
              reduceMotion={reduceMotion}
            />
          ) : null}
        </div>
      </div>
    </motion.section>
  );
}

function FeaturedHomeBlog({
  article,
  hasEntered,
  isNewest,
  motionScale,
  reduceMotion
}: {
  article: BlogSummary;
  hasEntered: boolean;
  isNewest: boolean;
  motionScale: number;
  reduceMotion: boolean;
}) {
  return (
    <motion.article
      className="will-change-transform"
      initial={reduceMotion ? false : { opacity: 0, y: 22 * motionScale }}
      animate={hasEntered ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 * motionScale }}
      transition={{ duration: reduceMotion ? 0 : 0.72, ease: smoothEase, delay: reduceMotion ? 0 : 0.1 }}
    >
      <Link
        href={`/blog/${article.slug}`}
        className="group grid overflow-hidden rounded-[8px] border border-[#dac58c]/70 bg-white shadow-[0_22px_60px_rgba(67,45,17,0.07)] transition-[border-color,box-shadow,background-color] duration-500 hover:border-[#b68a35] hover:bg-[#fffdf8] hover:shadow-[0_34px_90px_rgba(67,45,17,0.13)] lg:grid-cols-[minmax(0,0.98fr)_minmax(0,1.02fr)]"
      >
        <div className="relative aspect-[1.25] overflow-hidden bg-[#211711] lg:aspect-[0.98]">
          <img
            src={article.coverImage}
            alt={article.coverImageAlt || article.title}
            loading="lazy"
            decoding="async"
            onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80"; }}
            className="h-full w-full object-cover transition-transform duration-[800ms] ease-out group-hover:scale-[1.05]"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,10,6,0.02)_42%,rgba(15,10,6,0.42))]" />
          <div className="absolute left-5 top-5 flex flex-wrap gap-2">
            <span className="rounded-[3px] border border-[#f0d894]/70 bg-[#201714] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0] text-[#f5d780]">
              Featured
            </span>
            {isNewest ? <LatestBadge /> : null}
          </div>
          <ArticleReadSignal article={article} variant="image" />
        </div>

        <div className="flex min-w-0 flex-col justify-center p-6 sm:p-8 lg:p-10">
          <ArticleMeta article={article} />
          <ArticleReadSignal article={article} />
          <motion.div className="mt-6 transition-transform duration-500 ease-out group-hover:-translate-y-1">
            <RevealTitle title={article.title} active={hasEntered} reduceMotion={reduceMotion} motionScale={motionScale} />
          </motion.div>
          <p className="mt-6 max-w-[42rem] text-[15px] leading-[1.85] tracking-[0] text-[#65584d] md:text-[16px]">{article.excerpt}</p>
          <span className="mt-8 inline-flex items-center gap-2 text-[0.8rem] font-semibold uppercase tracking-[0] text-[#8b1118] transition-colors duration-500 group-hover:text-[#a57622]">
            Read Feature
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </span>
        </div>
      </Link>
    </motion.article>
  );
}

function BlogIntelligenceFeed({
  articles,
  hasEntered,
  newestArticleId,
  motionScale,
  reduceMotion
}: {
  articles: BlogSummary[];
  hasEntered: boolean;
  newestArticleId: string | null;
  motionScale: number;
  reduceMotion: boolean;
}) {
  return (
    <aside className="border-y border-[#dfca94]/58 py-7 xl:py-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <BookOpenText className="h-4 w-4 text-[#a57622]" />
          <h3 className="font-display text-[11px] font-semibold uppercase tracking-[0] text-[#8b1118]">Intelligence Feed</h3>
        </div>
        <span className="h-px flex-1 bg-[#ead9ad]" aria-hidden="true" />
      </div>

      <div className="grid gap-0">
        {articles.map((article, index) => (
          <motion.article
            key={article.id}
            initial={reduceMotion ? false : { opacity: 0, x: 34 * motionScale }}
            animate={hasEntered ? { opacity: 1, x: 0 } : { opacity: 0, x: 34 * motionScale }}
            transition={{ duration: reduceMotion ? 0 : 0.62, ease: smoothEase, delay: reduceMotion ? 0 : 0.22 + index * 0.1 }}
          >
            <Link
              href={`/blog/${article.slug}`}
              className="group relative grid grid-cols-[76px_minmax(0,1fr)] gap-5 border-b border-[#ead9ad]/75 py-5 transition-colors duration-500 first:pt-0 last:border-b-0 last:pb-0 sm:grid-cols-[96px_minmax(0,1fr)]"
            >
              <span className="absolute left-0 top-0 h-px w-full origin-left scale-x-0 bg-[#b68a35] transition-transform duration-500 ease-out group-hover:scale-x-100" aria-hidden="true" />
              <div className="aspect-square overflow-hidden rounded-[6px] bg-[#211711]">
                <img
                  src={article.coverImage}
                  alt={article.coverImageAlt || article.title}
                  loading="lazy"
                  decoding="async"
                  onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=200&q=80"; }}
                  className="h-full w-full object-cover transition-transform duration-[800ms] ease-out group-hover:scale-[1.04]"
                />
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-[3px] border border-[#d9c489] bg-[#fffdf8] px-2 py-1 text-[9px] font-semibold uppercase tracking-[0] text-[#8a6320]">
                    {article.category}
                  </span>
                  {article.id === newestArticleId ? <LatestBadge /> : null}
                </div>
                <p className="mt-3 line-clamp-2 break-words [font-family:var(--font-manrope)] text-[1.02rem] font-semibold leading-[1.2] tracking-[0] text-[#211714] transition-colors duration-500 group-hover:text-[#8b1118] sm:text-[1.12rem]">
                  {article.title}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] font-medium uppercase tracking-[0] text-[#7c7065]">
                  <span>{formatDate(article.publishedAt)}</span>
                  <span>{article.readTime}</span>
                </div>
                <ArticleReadSignal article={article} compact />
              </div>
            </Link>
          </motion.article>
        ))}
      </div>
    </aside>
  );
}

function RevealTitle({
  title,
  active,
  motionScale,
  reduceMotion
}: {
  title: string;
  active: boolean;
  motionScale: number;
  reduceMotion: boolean;
}) {
  let characterIndex = 0;

  if (reduceMotion) {
    return <h3 className="home-blog-featured-title break-words text-[1.85rem] text-[#1d1511] sm:text-[2.15rem] lg:text-[2.35rem] xl:text-[2.45rem]">{title}</h3>;
  }

  return (
    <h3 className="home-blog-featured-title break-words text-[1.85rem] text-[#1d1511] sm:text-[2.15rem] lg:text-[2.35rem] xl:text-[2.45rem]" aria-label={title}>
      <span aria-hidden="true">
        {title.split(" ").map((word, wordIndex, words) => (
          <span key={`${word}-${wordIndex}`} className="inline-block whitespace-nowrap">
            {Array.from(word).map((char) => {
              const delay = Math.min(characterIndex * 0.018, 0.58);
              characterIndex += 1;

              return (
                <motion.span
                  key={`${char}-${characterIndex}`}
                  className="inline-block will-change-transform"
                  initial={{ opacity: 0, y: 14 * motionScale }}
                  animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 * motionScale }}
                  transition={{ duration: 0.42, ease: smoothEase, delay: 0.28 + delay }}
                >
                  {char}
                </motion.span>
              );
            })}
            {wordIndex < words.length - 1 ? " " : null}
          </span>
        ))}
      </span>
    </h3>
  );
}

function LiveCmsBadge({ active, reduceMotion }: { active: boolean; reduceMotion: boolean }) {
  return (
    <div className="inline-flex min-h-9 items-center gap-2 rounded-[4px] border border-[#d8c286] bg-white px-3 text-[10px] font-bold uppercase tracking-[0] text-[#4d4034] shadow-[0_12px_28px_rgba(82,58,22,0.08)]">
      <motion.span
        className="h-2 w-2 rounded-full bg-[#b68a35]"
        animate={active && !reduceMotion ? { scale: [1, 1.18, 1], opacity: [0.72, 1, 0.72] } : { scale: 1, opacity: 0.82 }}
        transition={{ duration: 4, repeat: active && !reduceMotion ? Infinity : 0, ease: "easeInOut" }}
        aria-hidden="true"
      />
      LIVE CMS FEED
    </div>
  );
}

function LatestBadge() {
  return (
    <span className="rounded-[3px] border border-[#b68a35]/65 bg-[#fff5dc] px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0] text-[#7c5618]">
      Latest
    </span>
  );
}

function ArticleMeta({ article }: { article: BlogSummary }) {
  return (
    <div className="flex flex-wrap items-center gap-2 text-[10px] font-medium uppercase tracking-[0] text-[#7f7265]">
      <span className="rounded-[3px] border border-[#d9c489] bg-[#fffdf8] px-2.5 py-1.5 text-[#8a6320]">{article.category}</span>
      <span className="inline-flex items-center gap-1.5">
        <CalendarDays className="h-3.5 w-3.5 text-[#a57622]" />
        {formatDate(article.publishedAt)}
      </span>
      <span className="inline-flex items-center gap-1.5">
        <Clock3 className="h-3.5 w-3.5 text-[#a57622]" />
        {article.readTime}
      </span>
    </div>
  );
}

function ArticleReadSignal({ article, compact = false, variant = "inline" }: { article: BlogSummary; compact?: boolean; variant?: "inline" | "image" }) {
  const progress = useMemo(() => getReadProgress(article.readTime), [article.readTime]);
  const style = useMemo(() => ({ "--read-progress": progress }) as CSSProperties, [progress]);

  if (variant === "image") {
    return (
      <span className="absolute bottom-0 left-0 h-[3px] w-full overflow-hidden bg-white/22" aria-label={`${article.readTime} read progress`}>
        <span className="block h-full origin-left scale-x-[var(--read-progress)] bg-[#b68a35] transition-transform duration-700 ease-out group-hover:scale-x-100" style={style} />
      </span>
    );
  }

  return (
    <span className={`mt-3 block h-px overflow-hidden bg-[#ead9ad]/75 ${compact ? "max-w-[7rem]" : "max-w-[12rem]"}`} aria-label={`${article.readTime} read progress`}>
      <span className="block h-full origin-left scale-x-[var(--read-progress)] bg-[#b68a35] transition-transform duration-700 ease-out group-hover:scale-x-100" style={style} />
    </span>
  );
}

function useViewportSignal(ref: RefObject<HTMLElement | null>) {
  const [isInView, setIsInView] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      setIsInView(true);
      setHasEntered(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
        if (entry.isIntersecting) {
          setHasEntered(true);
        }
      },
      { threshold: 0.18, rootMargin: "0px 0px -12% 0px" }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [ref]);

  return { isInView, hasEntered };
}

function useMobileMotionScale() {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const query = window.matchMedia("(max-width: 767px)");
    const update = () => setScale(query.matches ? 0.6 : 1);
    update();

    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return scale;
}

function uniqueArticles(items: BlogSummary[]) {
  const seen = new Set<string>();
  return items.filter((article) => {
    if (seen.has(article.id)) return false;
    seen.add(article.id);
    return true;
  });
}

function newestArticle(items: BlogSummary[]) {
  return [...items].sort((a, b) => dateValue(b.publishedAt || b.createdAt) - dateValue(a.publishedAt || a.createdAt))[0] || null;
}

function dateValue(value: string | null) {
  if (!value) return 0;
  const parsed = new Date(value).getTime();
  return Number.isFinite(parsed) ? parsed : 0;
}

function getReadProgress(readTime: string) {
  const minutes = Number(readTime.match(/\d+/)?.[0] || 4);
  return Math.max(0.28, Math.min(0.92, minutes / 9));
}

function formatDate(value: string | null) {
  if (!value) return "Unscheduled";
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "2-digit",
    year: "numeric"
  }).format(new Date(value));
}
