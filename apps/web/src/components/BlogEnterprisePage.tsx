"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { ComponentType, FormEvent } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpenText,
  Building2,
  DraftingCompass,
  Globe2,
  HardHat,
  Loader2,
  Mail,
  Newspaper,
  Search,
  ShieldCheck,
  Sparkles
} from "lucide-react";
import type { BlogListPayload, BlogSummary } from "@/lib/api";
import { subscribeToRactyshNewsletter } from "@/lib/newsletterSubscribe";

const ease = [0.22, 1, 0.36, 1] as const;

const topicIcons: Record<string, ComponentType<{ className?: string }>> = {
  "Export & Import": Globe2,
  Architecture: DraftingCompass,
  Construction: HardHat,
  "Real Estate": Building2,
  "OTC Exchange": ShieldCheck,
  Enterprise: Building2,
  Infrastructure: Building2,
  Design: DraftingCompass,
  Insights: BookOpenText,
  News: Newspaper
};

export function BlogEnterprisePage({ data }: { data: BlogListPayload | null }) {
  const shouldReduceMotion = useReducedMotion();
  const [activeCategory, setActiveCategory] = useState("All Articles");
  const [query, setQuery] = useState("");
  const articles = useMemo(() => data?.blogs || [], [data?.blogs]);
  const categories = useMemo(() => ["All Articles", ...(data?.categories || [])], [data?.categories]);
  const categoryCounts = useMemo(() => {
    const counts = new Map<string, number>();
    articles.forEach((article) => counts.set(article.category, (counts.get(article.category) || 0) + 1));
    return counts;
  }, [articles]);
  const filteredArticles = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return articles.filter((article) => {
      const matchesCategory = activeCategory === "All Articles" || article.category === activeCategory;
      const matchesQuery =
        !normalizedQuery ||
        `${article.title} ${article.category} ${article.excerpt} ${article.tags.join(" ")}`.toLowerCase().includes(normalizedQuery);

      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, articles, query]);
  const featuredArticle =
    activeCategory === "All Articles" && !query.trim()
      ? data?.featured || filteredArticles[0] || null
      : filteredArticles[0] || null;
  const secondaryArticles = featuredArticle
    ? filteredArticles.filter((article) => article.id !== featuredArticle.id)
    : filteredArticles;

  return (
    <div className="relative isolate overflow-hidden bg-[#fbf5e9] text-[#1f1511]">
      <BlogBackground />

      <section className="relative z-10 px-5 pb-14 pt-28 md:px-8 md:pb-20 md:pt-[8.5rem] xl:px-12">
        <div className="mx-auto grid max-w-[92rem] gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(28rem,0.72fr)] lg:items-end xl:gap-16">
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.86, ease }}
            className="max-w-[58rem]"
          >
            <div className="flex items-center gap-4">
              <span className="h-px w-14 bg-[#d6b45f]" />
              <p className="text-[12px] font-bold uppercase tracking-[0.28em] text-[#8b1118]">BLOG & INSIGHTS</p>
            </div>

            <h1 className="mt-7 max-w-[57rem] font-display text-[clamp(3.45rem,8vw,8.8rem)] font-semibold leading-[0.86] tracking-normal text-[#1d120f]">
              Enterprise
              <br aria-hidden="true" />
              Editorial Journal
            </h1>

            <div className="mt-7 max-w-[47rem]">
              <h2 className="font-display text-[clamp(2.05rem,4vw,3.85rem)] font-semibold leading-[0.96] tracking-normal text-[#241814]">
                Insights That Drive Enterprise Evolution.
              </h2>
              <p className="mt-5 max-w-[43rem] text-[15px] font-medium leading-[1.85] tracking-normal text-[#5c5149] md:text-[17px]">
                Expert perspectives published from the Ractysh CMS across design, construction, trade, private exchange and enterprise operations.
              </p>
            </div>

            <motion.a
              href="#articles"
              whileHover={shouldReduceMotion ? undefined : { y: -3, scale: 1.015 }}
              whileTap={{ scale: 0.985 }}
              transition={{ duration: 0.35, ease }}
              className="premium-cta mt-7"
            >
              Explore All Articles
              <ArrowRight className="h-4 w-4" />
            </motion.a>
          </motion.div>

          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 32, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, delay: 0.12, ease }}
            className="group relative min-h-[25rem] overflow-hidden rounded-[0.45rem] border border-[#d8bd79]/48 bg-[#180c0e] shadow-[0_34px_100px_rgba(72,42,19,0.19)] md:min-h-[32rem]"
          >
            <img
              src={featuredArticle?.coverImage || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1700&q=88"}
              alt={featuredArticle?.coverImageAlt || featuredArticle?.title || "Luxury enterprise editorial environment"}
              loading="eager"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover transition duration-[1400ms] ease-out group-hover:scale-[1.035]"
            />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(21,9,11,0.12),transparent_45%),linear-gradient(180deg,transparent_52%,rgba(20,8,10,0.66))]" />
            <div className="absolute bottom-6 left-6 right-6 flex flex-wrap items-center justify-between gap-3 border-t border-white/18 pt-5 text-white">
              <div>
                <p className="text-[12px] font-bold uppercase tracking-[0.22em] text-[#d6b45f]">Ractysh Editorial</p>
                <p className="mt-2 font-display text-[1.45rem] font-semibold tracking-normal text-[#fff7e8]">
                  {featuredArticle?.category || "Enterprise intelligence desk"}
                </p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#d6b45f]/50 bg-white/[0.06] text-[#d6b45f]">
                <Sparkles className="h-5 w-5" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="articles" className="relative z-10 px-5 pb-20 md:px-8 lg:pb-24 xl:px-12">
        <div className="mx-auto max-w-[92rem]">
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.7, ease }}
            className="border-y border-[#dcc891]/62 py-6"
          >
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,22rem)] lg:items-start">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#8b1118]">Journal filters</p>
                <div className="mt-4 flex flex-wrap gap-2.5">
                  {categories.map((category) => {
                    const active = activeCategory === category;

                    return (
                      <button
                        key={category}
                        type="button"
                        onClick={() => setActiveCategory(category)}
                        aria-pressed={active}
                        className={`rounded-full border px-4 py-2.5 text-[13px] font-semibold normal-case tracking-normal transition duration-300 ${
                          active
                            ? "border-[#8b1118] bg-[#8b1118] text-[#fff7e8] shadow-[0_14px_34px_rgba(139,17,24,0.18)]"
                            : "border-[#e1cf9f] bg-white/48 text-[#6b5c51] hover:-translate-y-0.5 hover:border-[#d6b45f] hover:bg-white hover:text-[#8b1118]"
                        }`}
                      >
                        {category}
                      </button>
                    );
                  })}
                </div>
              </div>

              <label className="relative block w-full">
                <span className="mb-3 block text-[11px] font-bold uppercase tracking-[0.24em] text-[#8b1118]">Search archive</span>
                <Search className="pointer-events-none absolute left-4 top-[calc(50%+0.9rem)] h-4 w-4 -translate-y-1/2 text-[#8b1118]" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search articles..."
                  className="h-12 w-full rounded-full border border-[#dfca94] bg-white/74 pl-11 pr-4 text-[14px] font-medium text-[#241814] outline-none shadow-[0_18px_48px_rgba(82,49,20,0.06)] backdrop-blur-xl transition duration-300 placeholder:text-[#9a8d7f] focus:border-[#d6b45f] focus:bg-white"
                />
              </label>
            </div>
          </motion.div>

          <div className="mt-12 grid gap-12 xl:grid-cols-[minmax(0,1fr)_20rem] xl:items-start">
            <div className="min-w-0">
              {featuredArticle ? <FeaturedArticle article={featuredArticle} reduceMotion={Boolean(shouldReduceMotion)} /> : <EmptyBlogState />}

              <div className="mt-12 flex items-end justify-between gap-5 border-t border-[#dec995]/70 pt-8">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#8b1118]">Latest Stories</p>
                  <h2 className="mt-3 font-display text-[clamp(2rem,4vw,3.8rem)] font-semibold leading-[0.95] tracking-normal text-[#20130f]">
                    Current Journal
                  </h2>
                </div>
                <p className="hidden max-w-[13rem] text-right text-[13px] leading-[1.7] text-[#796d62] sm:block">
                  {filteredArticles.length} published {filteredArticles.length === 1 ? "story" : "stories"} in this view.
                </p>
              </div>

              {secondaryArticles.length ? (
                <motion.div layout className="mt-8 grid gap-x-7 gap-y-10 md:grid-cols-2">
                  {secondaryArticles.map((article, index) => (
                    <BlogCard key={article.id} article={article} index={index} reduceMotion={Boolean(shouldReduceMotion)} />
                  ))}
                </motion.div>
              ) : featuredArticle ? (
                <div className="mt-8 border-y border-[#dec995]/70 py-10 text-[15px] leading-7 text-[#675a4f]">
                  This article is the only story in the selected editorial view.
                </div>
              ) : null}
            </div>

            <aside className="grid gap-7 xl:sticky xl:top-28">
              <PopularTopics
                categories={categories}
                categoryCounts={categoryCounts}
                total={articles.length}
                activeCategory={activeCategory}
                onSelectCategory={setActiveCategory}
              />
              <NewsletterBox />
              <ContributionBox />
            </aside>
          </div>
        </div>
      </section>

      <section className="relative z-10 px-5 pb-20 md:px-8 lg:pb-24 xl:px-12">
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          whileHover={shouldReduceMotion ? undefined : { y: -4 }}
          transition={{ duration: 0.3, ease }}
          className="mx-auto grid max-w-[92rem] gap-7 border-y border-[#d8bd79]/70 bg-[#fffaf0]/54 py-9 md:grid-cols-[1fr_auto] md:items-center"
        >
          <div>
            <h2 className="font-display text-[22px] font-semibold leading-[1.08] tracking-normal text-[#20130f] md:text-[28px] lg:text-[34px]">
              Explore. Learn. Lead.
            </h2>
            <p className="mt-4 max-w-[34rem] text-[14px] leading-[1.7] text-[#675a4f] md:text-[15px]">
              Knowledge is the foundation of every great enterprise.
            </p>
          </div>
          <Link
            href="/#enterprise-solutions"
            className="group inline-flex min-h-[3rem] items-center justify-center gap-2 rounded-full border border-[#d6b45f]/55 bg-[linear-gradient(135deg,#d6b45f_0%,#b98a2c_38%,#8b1118_100%)] px-5 py-3 text-[0.9rem] font-semibold text-[#fff7e6] shadow-[0_20px_50px_rgba(139,17,24,0.22)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_26px_62px_rgba(139,17,24,0.3)]"
          >
            Explore Our Ecosystem
            <ArrowUpRight className="h-4 w-4 transition duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </motion.div>
      </section>
    </div>
  );
}

function FeaturedArticle({ article, reduceMotion }: { article: BlogSummary; reduceMotion: boolean }) {
  return (
    <motion.article
      layout
      initial={reduceMotion ? false : { opacity: 0, y: 34 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.72, ease }}
      className="group grid overflow-hidden border-y border-[#d8bd79]/72 bg-[#fffaf0]/48 py-6 lg:grid-cols-[minmax(0,1.08fr)_minmax(22rem,0.92fr)] lg:gap-9 lg:py-8"
    >
      <Link
        href={`/blog/${article.slug}`}
        className="relative block aspect-[1.35] overflow-hidden bg-[#160b0d] text-left outline-none focus-visible:ring-4 focus-visible:ring-[#d6b45f]/26 lg:aspect-[1.18]"
        aria-label={`Read featured article: ${article.title}`}
      >
        <img
          src={article.coverImage}
          alt={article.coverImageAlt || article.title}
          loading="eager"
          decoding="async"
          className="h-full w-full object-cover transition duration-[1400ms] ease-out group-hover:scale-[1.045]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_52%,rgba(18,8,10,0.56))]" />
        <span className="absolute left-5 top-5 rounded-full border border-white/18 bg-[#13090b]/72 px-3.5 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[#f4d98e] backdrop-blur-xl">
          Featured
        </span>
      </Link>

      <div className="flex flex-col justify-center py-7 lg:py-0">
        <ArticleMeta article={article} />
        <h2 className="mt-5 max-w-[42rem] font-display text-[clamp(2.4rem,5vw,5.6rem)] font-semibold leading-[0.9] tracking-normal text-[#20130f]">
          {article.title}
        </h2>
        <p className="mt-6 max-w-[37rem] text-[16px] leading-[1.85] text-[#5f5146] md:text-[18px]">
          {article.excerpt}
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Link
            href={`/blog/${article.slug}`}
            className="group/button inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[#8b1118]/18 bg-[#8b1118] px-5 text-[0.86rem] font-bold uppercase tracking-[0.13em] text-[#fff7e8] shadow-[0_18px_46px_rgba(139,17,24,0.18)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_24px_58px_rgba(139,17,24,0.26)]"
          >
            Read Feature
            <ArrowUpRight className="h-4 w-4 transition duration-300 group-hover/button:translate-x-0.5 group-hover/button:-translate-y-0.5" />
          </Link>
          <span className="text-[13px] font-semibold uppercase tracking-[0.16em] text-[#9a8d7f]">{article.author}</span>
        </div>
      </div>
    </motion.article>
  );
}

function BlogCard({ article, index, reduceMotion }: { article: BlogSummary; index: number; reduceMotion: boolean }) {
  return (
    <motion.article
      layout
      initial={reduceMotion ? false : { opacity: 0, y: 34 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      whileHover={reduceMotion ? undefined : { y: -7 }}
      transition={{ duration: 0.32, ease, delay: Math.min(index * 0.035, 0.18) }}
      className="group border-t border-[#dec995]/72 pt-5 transition duration-300"
    >
      <Link
        href={`/blog/${article.slug}`}
        className="relative block aspect-[1.48] w-full overflow-hidden bg-[#160b0d] text-left outline-none focus-visible:ring-4 focus-visible:ring-[#d6b45f]/26"
        aria-label={`Read article: ${article.title}`}
      >
        <img
          src={article.coverImage}
          alt={article.coverImageAlt || article.title}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition duration-[1200ms] ease-out group-hover:scale-[1.045]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_50%,rgba(18,8,10,0.42))]" />
        <span className="absolute left-4 top-4 rounded-full border border-white/18 bg-[#13090b]/70 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.17em] text-[#f4d98e] backdrop-blur-xl">
          {article.category}
        </span>
      </Link>
      <div className="pt-5">
        <ArticleMeta article={article} muted />
        <h3 className="mt-4 font-display text-[clamp(1.65rem,3vw,2.35rem)] font-semibold leading-[1] tracking-normal text-[#20130f]">
          {article.title}
        </h3>
        <p className="mt-4 text-[15px] leading-[1.8] text-[#675a4f]">{article.excerpt}</p>
        <Link
          href={`/blog/${article.slug}`}
          className="mt-5 inline-flex items-center gap-2 rounded-full text-[0.82rem] font-bold uppercase tracking-[0.13em] text-[#8b1118] outline-none transition duration-300 hover:text-[#5f0c11] focus-visible:ring-4 focus-visible:ring-[#d6b45f]/24"
          aria-label={`Read article: ${article.title}`}
        >
          Read Story
          <ArrowUpRight className="h-4 w-4 transition duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>
    </motion.article>
  );
}

function ArticleMeta({ article, muted = false }: { article: BlogSummary; muted?: boolean }) {
  return (
    <div className={`flex flex-wrap gap-x-4 gap-y-2 text-[11px] font-bold uppercase tracking-[0.11em] ${muted ? "text-[#8a7b6d]" : "text-[#8b1118]"}`}>
      <span>{article.category}</span>
      <span className={muted ? undefined : "text-[#b08a37]"}>{formatDate(article.publishedAt)}</span>
      <span className={muted ? undefined : "text-[#796d62]"}>{article.readTime}</span>
    </div>
  );
}

function PopularTopics({
  categories,
  categoryCounts,
  total,
  activeCategory,
  onSelectCategory
}: {
  categories: string[];
  categoryCounts: Map<string, number>;
  total: number;
  activeCategory: string;
  onSelectCategory: (category: string) => void;
}) {
  return (
    <div className="border-y border-[#dfca94]/70 py-6">
      <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#8b1118]">Editorial Index</p>
      <div className="mt-5 grid gap-1">
        {categories.map((category) => {
          const Icon = category === "All Articles" ? Newspaper : topicIcons[category] || BookOpenText;
          const active = activeCategory === category;
          const count = category === "All Articles" ? total : categoryCounts.get(category) || 0;

          return (
            <button
              key={category}
              type="button"
              onClick={() => onSelectCategory(category)}
              className={`group flex items-center justify-between border-b border-[#ead9ad]/70 py-3 text-left transition duration-300 last:border-b-0 ${
                active ? "text-[#8b1118]" : "text-[#5f5146] hover:text-[#8b1118]"
              }`}
            >
              <span className="flex min-w-0 items-center gap-3">
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition duration-300 ${
                    active
                      ? "border-[#8b1118]/20 bg-[#8b1118] text-[#fff7e8]"
                      : "border-[#dfca94]/80 bg-white/42 text-[#9a7428] group-hover:border-[#d6b45f] group-hover:bg-white"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                </span>
                <span className="truncate text-[14px] font-semibold">{category}</span>
              </span>
              <span className="text-[0.76rem] font-bold text-[#a27b2d]">{count}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function EmptyBlogState() {
  return (
    <div className="border-y border-[#d8bd79]/72 bg-[#fffaf0]/48 py-14 text-center">
      <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#8b1118]">CMS awaiting content</p>
      <h2 className="mx-auto mt-4 max-w-2xl font-display text-[clamp(2.2rem,5vw,4.8rem)] font-semibold leading-[0.95] tracking-normal text-[#20130f]">
        No published blogs are available yet.
      </h2>
      <p className="mx-auto mt-5 max-w-xl text-[15px] leading-7 text-[#675a4f]">
        Published records from the admin Blog CMS will appear here automatically.
      </p>
    </div>
  );
}

function NewsletterBox() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("loading");
    setMessage("");

    try {
      const payload = await subscribeToRactyshNewsletter(email.trim().toLowerCase(), "blog-insights-sidebar");
      setEmail("");
      setState("success");
      setMessage(payload.message);
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : "Unable to confirm subscription.");
    }
  }

  return (
    <div className="border-y border-[#dfca94]/70 py-6">
      <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#d6b45f]/38 bg-white/54 text-[#8b1118]">
        <Mail className="h-5 w-5" />
      </div>
      <h3 className="mt-5 font-display text-[22px] font-semibold leading-[1.04] tracking-normal text-[#20130f]">
        Stay Updated with Ractysh Insights
      </h3>
      <form onSubmit={submit} className="mt-5">
        <div className="flex overflow-hidden rounded-full border border-[#dfca94] bg-white/66 shadow-[0_16px_46px_rgba(82,49,20,0.06)]">
          <input
            type="email"
            required
            disabled={state === "loading"}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Email address"
            className="min-w-0 flex-1 bg-transparent px-4 text-[14px] font-medium text-[#241814] outline-none placeholder:text-[#9a8d7f]"
          />
          <button
            type="submit"
            disabled={state === "loading"}
            aria-label="Subscribe to Ractysh Insights"
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#8b1118] text-[#fff7e8] transition duration-300 hover:bg-[#6f0e13]"
          >
            {state === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
          </button>
        </div>
        {message ? (
          <p className={`mt-3 text-[12px] font-semibold leading-5 ${state === "error" ? "text-[#8b1118]" : "text-[#315c3f]"}`}>
            {message}
          </p>
        ) : null}
      </form>
    </div>
  );
}

function ContributionBox() {
  return (
    <div className="border-y border-[#dfca94]/70 py-6">
      <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#d6b45f]/45 bg-white/60 text-[#8b1118]">
        <Globe2 className="h-5 w-5" />
      </div>
      <h3 className="mt-5 font-display text-[22px] font-semibold leading-[1.04] tracking-normal text-[#20130f]">Want to contribute?</h3>
      <p className="mt-3 text-[14px] leading-[1.7] text-[#675a4f] md:text-[15px]">
        We welcome thought leadership from industry experts and innovators.
      </p>
      <a
        href="mailto:noorulsmart1998@gmail.com?subject=Ractysh%20Insights%20Contribution"
        className="mt-5 inline-flex items-center gap-2 text-[0.8rem] font-bold uppercase tracking-[0.13em] text-[#8b1118] transition duration-300 hover:text-[#5f0c11]"
      >
        Submit Your Article
        <ArrowUpRight className="h-4 w-4" />
      </a>
    </div>
  );
}

function BlogBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#fbf5e9_0%,#f8efe1_56%,#fbf5e9_100%)]" />
      <div className="absolute inset-0 opacity-[0.18] [background-image:linear-gradient(rgba(95,73,42,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(95,73,42,0.065)_1px,transparent_1px)] [background-size:72px_72px]" />
      <div className="absolute inset-x-[-8rem] top-[7rem] h-px bg-[linear-gradient(90deg,transparent,rgba(214,180,95,0.34),transparent)]" />
      <div className="absolute inset-x-[-8rem] top-[38rem] h-px bg-[linear-gradient(90deg,transparent,rgba(139,17,24,0.12),rgba(214,180,95,0.26),transparent)]" />
    </div>
  );
}

function formatDate(value: string | null) {
  if (!value) return "Unscheduled";
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "2-digit",
    year: "numeric"
  }).format(new Date(value));
}
