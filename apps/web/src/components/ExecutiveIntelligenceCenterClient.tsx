"use client";

import { type FormEvent, type MouseEvent, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import {
  ArrowUpRight,
  BarChart3,
  CalendarDays,
  ChevronRight,
  Eye,
  Loader2,
  Mail,
  Newspaper,
  Sparkles,
  UsersRound
} from "lucide-react";
import type { ExecutiveIntelligencePayload, NewsletterSummary } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { subscribeToRactyshNewsletter } from "@/lib/newsletterSubscribe";
import { cn } from "@/lib/utils";

const ease = [0.22, 1, 0.36, 1] as const;

interface ExecutiveIntelligenceCenterClientProps {
  intelligence: ExecutiveIntelligencePayload;
}

function formatDate(value: string | null): string {
  if (!value) return "Not published";
  return new Intl.DateTimeFormat("en", { month: "short", day: "2-digit", year: "numeric" }).format(new Date(value));
}

function formatCount(value: number): string {
  return new Intl.NumberFormat("en", { notation: value > 9999 ? "compact" : "standard" }).format(value);
}

function ArticleImage({ issue, priority = false }: { issue: NewsletterSummary; priority?: boolean }) {
  return (
    <img
      src={issue.coverImage}
      alt={issue.title}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.035]"
    />
  );
}

function IssueMeta({ issue, light = false }: { issue: NewsletterSummary; light?: boolean }) {
  return (
    <div className={cn("flex flex-wrap items-center gap-2 text-[0.68rem] font-bold uppercase tracking-[0.16em]", light ? "text-white/72" : "text-[#8B1118]")}>
      <span>{issue.category}</span>
      <span className={cn("h-1 w-1 rounded-full", light ? "bg-white/38" : "bg-[#C6A45B]")} />
      <span>{formatDate(issue.publishDate)}</span>
      <span className={cn("h-1 w-1 rounded-full", light ? "bg-white/38" : "bg-[#C6A45B]")} />
      <span>{issue.readTime}</span>
    </div>
  );
}

function useCardParallax() {
  const frameRef = useRef<number | null>(null);
  const reduceMotion = useReducedMotion();

  const onMove = (event: MouseEvent<HTMLElement>) => {
    if (reduceMotion) return;
    const card = event.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    if (frameRef.current) window.cancelAnimationFrame(frameRef.current);
    frameRef.current = window.requestAnimationFrame(() => {
      card.style.setProperty("--ei-rotate-x", `${(-y * 4).toFixed(2)}deg`);
      card.style.setProperty("--ei-rotate-y", `${(x * 4).toFixed(2)}deg`);
      card.style.setProperty("--ei-shift-x", `${(x * 8).toFixed(2)}px`);
      card.style.setProperty("--ei-shift-y", `${(y * 8).toFixed(2)}px`);
    });
  };

  const onLeave = (event: MouseEvent<HTMLElement>) => {
    if (frameRef.current) window.cancelAnimationFrame(frameRef.current);
    event.currentTarget.style.setProperty("--ei-rotate-x", "0deg");
    event.currentTarget.style.setProperty("--ei-rotate-y", "0deg");
    event.currentTarget.style.setProperty("--ei-shift-x", "0px");
    event.currentTarget.style.setProperty("--ei-shift-y", "0px");
  };

  return { onMove, onLeave };
}

function FeaturedCard({ issue, compact = false }: { issue: NewsletterSummary; compact?: boolean }) {
  const parallax = useCardParallax();

  return (
    <motion.article
      className={cn(
        "group relative overflow-hidden rounded-[8px] border border-[#ECECEC] bg-white shadow-[0_26px_70px_rgba(24,20,17,0.09)]",
        compact ? "min-h-[31rem]" : "min-h-[38rem]"
      )}
      onMouseMove={parallax.onMove}
      onMouseLeave={parallax.onLeave}
      whileHover={{ y: -4, scale: 1.006 }}
      transition={{ duration: 0.35, ease }}
      style={{
        transform:
          "perspective(1200px) rotateX(var(--ei-rotate-x,0deg)) rotateY(var(--ei-rotate-y,0deg)) translate3d(var(--ei-shift-x,0px),var(--ei-shift-y,0px),0)"
      }}
    >
      <div className={cn("relative overflow-hidden", compact ? "h-56" : "h-[22rem]")}>
        <ArticleImage issue={issue} priority />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111111]/72 via-[#111111]/16 to-transparent" />
        <div className="absolute bottom-5 left-5 right-5">
          <IssueMeta issue={issue} light />
          <h3 className="mt-3 font-display text-[2.25rem] font-semibold leading-[0.96] tracking-normal text-white md:text-[3.25rem]">
            {issue.title}
          </h3>
        </div>
      </div>

      <div className={cn("grid gap-6", compact ? "p-5" : "p-7")}>
        <p className="max-w-[36rem] text-[0.98rem] font-medium leading-7 text-[#4f4840]">{issue.excerpt}</p>
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#ECECEC] pt-5">
          <div className="flex items-center gap-3 text-[0.76rem] font-semibold uppercase tracking-[0.14em] text-[#6e6256]">
            <Eye className="h-4 w-4 text-[#C6A45B]" />
            {formatCount(issue.views)} views
          </div>
          <Button asChild size="lg" className="rounded-[8px]">
            <Link href={`/journal/${issue.slug}`}>
              Read Article
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </motion.article>
  );
}

function RecentIssueCard({ issue, index }: { issue: NewsletterSummary; index: number }) {
  return (
    <motion.article
      className="group min-w-[17.5rem] overflow-hidden rounded-[8px] border border-[#ECECEC] bg-white shadow-[0_18px_46px_rgba(24,20,17,0.055)] transition duration-300 hover:-translate-y-1 hover:border-[#C6A45B]/55 hover:shadow-[0_22px_58px_rgba(24,20,17,0.085)] md:min-w-0"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.48, ease, delay: index * 0.06 }}
    >
      <div className="h-36 overflow-hidden">
        <ArticleImage issue={issue} />
      </div>
      <div className="p-4">
        <IssueMeta issue={issue} />
        <h4 className="mt-2 text-[1rem] font-semibold leading-snug tracking-normal text-[#111111]">{issue.title}</h4>
        <p className="mt-2 line-clamp-2 text-[0.82rem] leading-5 text-[#5d554c]">{issue.excerpt}</p>
        <Link
          href={`/journal/${issue.slug}`}
          className="mt-4 inline-flex items-center gap-1.5 text-[0.74rem] font-bold uppercase tracking-[0.14em] text-[#8B1118]"
        >
          Read
          <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </motion.article>
  );
}

function SubscribeForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("loading");
    setMessage("");

    try {
      const payload = await subscribeToRactyshNewsletter(email.trim().toLowerCase(), "executive-intelligence-center");
      setEmail("");
      setState("success");
      setMessage(payload.message);
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : "Unable to confirm subscription.");
    }
  }

  return (
    <form onSubmit={submit} className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
      <label className="relative block">
        <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8B1118]" />
        <input
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="executive@email.com"
          className="h-12 w-full rounded-[8px] border border-[#ECECEC] bg-white pl-11 pr-4 text-[0.9rem] font-medium text-[#111111] outline-none transition duration-300 placeholder:text-[#948b82] focus:border-[#C6A45B] focus:shadow-[0_0_0_3px_rgba(198,164,91,0.14)]"
        />
      </label>
      <Button type="submit" disabled={state === "loading"} className="h-12 rounded-[8px] px-5">
        {state === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
        Subscribe
      </Button>
      {message ? (
        <p className={cn("sm:col-span-2 text-[0.8rem] font-medium", state === "error" ? "text-[#8B1118]" : "text-[#315c3f]")}>
          {message}
        </p>
      ) : null}
    </form>
  );
}

function IntelligenceTicker({ ticker }: { ticker: ExecutiveIntelligencePayload["ticker"] }) {
  if (!ticker.length) return null;

  const tickerItems = [...ticker, ...ticker];

  return (
    <div className="ei-ticker mt-12 overflow-hidden border-y border-[#ECECEC] bg-white/72 py-3">
      <div className="ei-ticker-track flex w-max items-center gap-8">
        {tickerItems.map((item, index) => (
          <Link
            key={`${item.slug}-${index}`}
            href={`/journal/${item.slug}`}
            className="flex items-center gap-3 whitespace-nowrap text-[0.76rem] font-bold uppercase tracking-[0.18em] text-[#111111]"
          >
            <span className="text-[#8B1118]">{item.label}</span>
            <span className="h-1.5 w-1.5 rounded-full bg-[#C6A45B]" />
            <span>{item.title}</span>
            <span className="text-[#7a7167]">{item.category}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function ExecutiveIntelligenceCenterClient({ intelligence }: ExecutiveIntelligenceCenterClientProps) {
  const featured = intelligence.featured || intelligence.latest;
  const recentIssues = useMemo(
    () => intelligence.recentIssues.filter((issue) => issue.slug !== featured?.slug).slice(0, 4),
    [featured?.slug, intelligence.recentIssues]
  );

  const metrics = [
    { label: "Subscribers", value: formatCount(intelligence.metrics.subscriberCount), Icon: UsersRound },
    { label: "Published Issues", value: formatCount(intelligence.metrics.issueCount), Icon: Newspaper },
    { label: "Recent Publication", value: formatDate(intelligence.metrics.recentPublication), Icon: CalendarDays }
  ];

  return (
    <section
      id="executive-intelligence-center"
      className="executive-intelligence-center relative isolate overflow-hidden bg-[#FFFFFF] px-5 py-20 text-[#111111] sm:px-8 md:py-24 lg:px-12"
      aria-label="Executive Intelligence Center"
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(17,17,17,0.035)_1px,transparent_1px),linear-gradient(rgba(17,17,17,0.03)_1px,transparent_1px)] bg-[size:72px_72px]" />
        <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-[#C6A45B]/60 to-transparent" />
        <div className="absolute right-[12%] top-16 h-60 w-60 rounded-full bg-[#C6A45B]/[0.08]" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1440px]">
        <div className="hidden grid-cols-12 gap-8 lg:grid">
          <motion.div
            className="col-span-5 flex min-h-[40rem] flex-col justify-between"
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-12%" }}
            transition={{ duration: 0.72, ease }}
          >
            <div>
              <div className="inline-flex items-center gap-3 rounded-full border border-[#ECECEC] bg-white px-4 py-2 text-[0.72rem] font-bold uppercase tracking-[0.22em] text-[#8B1118] shadow-[0_12px_32px_rgba(17,17,17,0.04)]">
                <BarChart3 className="h-4 w-4 text-[#C6A45B]" />
                Ractysh Journal
              </div>
              <h2 className="mt-8 max-w-[36rem] font-display text-[4.8rem] font-semibold leading-[0.88] tracking-normal text-[#111111]">
                Executive Intelligence Center
              </h2>
              <p className="mt-7 max-w-[31rem] text-[1.02rem] font-medium leading-8 text-[#5b5148]">
                Database-published intelligence for Architecture, Construction, Real Estate, Global Trade and Private Exchange decision makers.
              </p>
            </div>

            <div className="grid gap-3">
              {metrics.map(({ label, value, Icon }) => (
                <Card key={label} className="grid grid-cols-[auto_1fr] items-center gap-4 rounded-[8px] border-[#ECECEC] bg-white/86 p-4 shadow-[0_14px_36px_rgba(17,17,17,0.045)]">
                  <span className="flex h-11 w-11 items-center justify-center rounded-[8px] border border-[#F0E6D1] bg-[#FFF9EA] text-[#C6A45B]">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-[0.68rem] font-bold uppercase tracking-[0.18em] text-[#8B1118]">{label}</span>
                    <span className="mt-1 block text-[1.18rem] font-semibold text-[#111111]">{value}</span>
                  </span>
                </Card>
              ))}
            </div>

            <div className="rounded-[8px] border border-[#ECECEC] bg-[#FAFAFA] p-5">
              <p className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[#8B1118]">Private Briefing List</p>
              <p className="mt-2 text-[0.9rem] leading-6 text-[#5b5148]">Receive new executive publications when they are released from the Ractysh database.</p>
              <div className="mt-4">
                <SubscribeForm />
              </div>
            </div>
          </motion.div>

          <div className="col-span-7">
            {featured ? <FeaturedCard issue={featured} /> : null}

            {recentIssues.length ? (
              <div className="mt-6 grid grid-cols-2 gap-4">
                {recentIssues.map((issue, index) => (
                  <RecentIssueCard key={issue.id} issue={issue} index={index} />
                ))}
              </div>
            ) : null}
          </div>
        </div>

        <div className="lg:hidden">
          {featured ? <FeaturedCard issue={featured} compact /> : null}

          <div className="mt-10">
            <div className="inline-flex items-center gap-3 rounded-full border border-[#ECECEC] bg-white px-3.5 py-2 text-[0.68rem] font-bold uppercase tracking-[0.2em] text-[#8B1118]">
              <BarChart3 className="h-3.5 w-3.5 text-[#C6A45B]" />
              Ractysh Journal
            </div>
            <h2 className="mt-5 font-display text-[3rem] font-semibold leading-[0.92] tracking-normal text-[#111111]">
              Executive Intelligence Center
            </h2>
            <p className="mt-5 text-[0.98rem] font-medium leading-7 text-[#5b5148]">
              Published intelligence from the Ractysh operating ecosystem.
            </p>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-3">
            {metrics.map(({ label, value, Icon }) => (
              <div key={label} className="flex items-center justify-between rounded-[8px] border border-[#ECECEC] bg-white p-4">
                <span className="flex items-center gap-3 text-[0.72rem] font-bold uppercase tracking-[0.16em] text-[#8B1118]">
                  <Icon className="h-4 w-4 text-[#C6A45B]" />
                  {label}
                </span>
                <span className="text-[0.95rem] font-semibold text-[#111111]">{value}</span>
              </div>
            ))}
          </div>

          {recentIssues.length ? (
            <div className="mt-8 -mx-5 overflow-x-auto px-5 pb-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <div className="flex gap-4">
                {recentIssues.map((issue, index) => (
                  <RecentIssueCard key={issue.id} issue={issue} index={index} />
                ))}
              </div>
            </div>
          ) : null}

          <div className="mt-8 rounded-[8px] border border-[#ECECEC] bg-[#FAFAFA] p-4">
            <p className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[#8B1118]">Private Briefing List</p>
            <div className="mt-4">
              <SubscribeForm />
            </div>
          </div>
        </div>

        <IntelligenceTicker ticker={intelligence.ticker} />
      </div>
    </section>
  );
}
