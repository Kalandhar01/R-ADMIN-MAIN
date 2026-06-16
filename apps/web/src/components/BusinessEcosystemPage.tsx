"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Building2,
  CheckCircle2,
  Globe2,
  LineChart,
  Network
} from "lucide-react";

const ease = [0.22, 1, 0.36, 1] as const;

export interface BusinessInsight {
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  coverImage: string;
  coverImageAlt?: string | null;
  publishedAt?: string | null;
  readTime: string;
}

const pillars = [
  {
    number: "01",
    title: "Enterprise Operations",
    label: "Operating System",
    body: "Governance, delivery rhythm and operational visibility for multi-division execution.",
    image: "/visualization/gallery-lobby.webp",
    Icon: Network
  },
  {
    number: "02",
    title: "Business Intelligence",
    label: "Decision Layer",
    body: "Structured reporting, commercial signals and executive visibility across active mandates.",
    image: "/visualization/presentation-standards.webp",
    Icon: BarChart3
  },
  {
    number: "03",
    title: "Investment Strategy",
    label: "Capital Logic",
    body: "Market reading, asset posture and strategic evaluation for long-range enterprise value.",
    image: "/services/showcase-real-estate.webp",
    Icon: LineChart
  },
  {
    number: "04",
    title: "Commercial Development",
    label: "Growth Programs",
    body: "Business environments, service systems and commercial programs prepared for scale.",
    image: "/services/showcase-construction.webp",
    Icon: Building2
  },
  {
    number: "05",
    title: "Market Expansion",
    label: "Network Reach",
    body: "Trade pathways, partner readiness and private-market coordination for expansion conversations.",
    image: "/services/showcase-import-export.webp",
    Icon: Globe2
  }
] as const;

const metrics = [
  { value: 50, suffix: "+", label: "Projects", detail: "delivered across property, design and enterprise work" },
  { value: 5, suffix: "", label: "Divisions", detail: "connected through one operating standard" },
  { value: 100, suffix: "%", label: "Execution Focused", detail: "built around delivery discipline and accountability" },
  { value: 15, suffix: "+", label: "Strategic Partnerships", detail: "supporting trade, development and service reach" }
] as const;

const capabilities = [
  "Boardroom-grade business planning",
  "Division-level execution systems",
  "Investment and asset intelligence",
  "Commercial program development",
  "Cross-market expansion support"
] as const;

const operatingLayers = [
  { label: "01", title: "Intelligence", body: "Collect the commercial, spatial, trade and asset signals that shape strategic decisions." },
  { label: "02", title: "Execution", body: "Translate decisions into accountable workflows, stakeholders, documentation and delivery checkpoints." },
  { label: "03", title: "Expansion", body: "Use the Ractysh ecosystem to extend opportunities across divisions, partners and private networks." }
] as const;

function ButtonLink({ href, children, variant = "dark" }: { href: string; children: ReactNode; variant?: "dark" | "light" }) {
  return (
    <Link
      href={href}
      className={[
        "real-estate-service-button group inline-flex min-h-12 items-center justify-center gap-3 overflow-hidden rounded-[8px] border px-6 py-3 text-[0.78rem] font-bold uppercase tracking-[0] transition duration-300",
        variant === "dark"
          ? "border-[#8B1118] bg-[#8B1118] text-[#fff8ec] shadow-[0_20px_56px_rgba(139,17,24,0.2)] hover:-translate-y-0.5 hover:border-[#741016] hover:bg-[#741016]"
          : "border-[#C9A45C]/58 bg-[#fffaf0] text-[#15110d] shadow-[0_18px_46px_rgba(22,22,22,0.08)] hover:-translate-y-0.5 hover:border-[#8B1118]/45 hover:bg-white"
      ].join(" ")}
    >
      <span className="relative z-10">{children}</span>
      <ArrowRight className="relative z-10 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={1.7} />
    </Link>
  );
}

function SectionHeading({ eyebrow, title, text }: { eyebrow: string; title: string; text?: string }) {
  return (
    <div className="max-w-[55rem]">
      <p className="flex items-center gap-4 text-[0.7rem] font-semibold uppercase tracking-[0.26em] text-[#8b1118]">
        <span className="h-px w-10 bg-[#b88a44]" />
        {eyebrow}
      </p>
      <h2 className="mt-5 font-display text-[clamp(2.7rem,5vw,6rem)] font-semibold leading-[0.9] tracking-[0] text-[#15110d]">
        {title}
      </h2>
      {text ? <p className="mt-6 max-w-[36rem] text-[1rem] font-medium leading-8 text-[#62594f]">{text}</p> : null}
    </div>
  );
}

function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 34, scale: 0.985 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.24 }}
      transition={{ duration: reduceMotion ? 0 : 0.82, delay, ease }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function CountMetric({ value, suffix, label, detail, index }: (typeof metrics)[number] & { index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const reduceMotion = useReducedMotion();
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!inView) return undefined;

    if (reduceMotion) {
      setDisplayValue(value);
      return undefined;
    }

    const duration = 1450 + index * 160;
    const start = performance.now();
    let frameId = 0;

    const tick = (time: number) => {
      const progress = Math.min((time - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setDisplayValue(Math.floor(eased * value));

      if (progress < 1) {
        frameId = window.requestAnimationFrame(tick);
      } else {
        setDisplayValue(value);
      }
    };

    frameId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frameId);
  }, [inView, index, reduceMotion, value]);

  return (
    <motion.article
      ref={ref}
      initial={reduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: reduceMotion ? 0 : 0.72, delay: index * 0.06, ease }}
      className="real-estate-service-property relative overflow-hidden rounded-[8px] border border-[#dfcfaa] bg-white p-6 shadow-[0_24px_86px_rgba(58,41,18,0.08)]"
    >
      <div className="absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-[#c9a45c]/70 to-transparent" aria-hidden />
      <p className="font-display text-[clamp(3rem,5vw,5.4rem)] font-semibold leading-none tracking-[0] text-[#15110d]">
        {displayValue}
        {displayValue === value ? suffix : ""}
      </p>
      <p className="mt-4 text-[0.66rem] font-semibold uppercase tracking-[0.22em] text-[#8b1118]">{label}</p>
      <p className="mt-4 text-[0.95rem] font-medium leading-7 text-[#62594f]">{detail}</p>
    </motion.article>
  );
}

function BusinessBlueprint({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`pointer-events-none absolute inset-0 z-0 ${className}`}
      viewBox="0 0 1200 760"
      preserveAspectRatio="none"
      aria-hidden
    >
      <g fill="none" stroke="rgba(184,138,68,0.34)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.1">
        <path d="M94 612 H1102" />
        <path d="M188 612 L316 304 L452 612" />
        <path d="M442 612 L640 188 L848 612" />
        <path d="M560 612 V336 H778 V612" />
        <path d="M250 510 H960" />
        <path d="M328 414 H874" />
        <path d="M422 318 H786" />
        <path d="M116 198 C292 124 404 116 542 178 S828 238 1088 126" />
      </g>
    </svg>
  );
}

function InsightDate({ value }: { value?: string | null }) {
  const formatted = useMemo(() => {
    if (!value) return "Editorial";
    return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(value));
  }, [value]);

  return <>{formatted}</>;
}

export function BusinessEcosystemPage({ insights }: { insights: BusinessInsight[] }) {
  const reduceMotion = useReducedMotion();

  return (
    <article className="real-estate-service-page business-ecosystem-page relative isolate overflow-hidden bg-[#fffaf0] text-[#15110d]">
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden opacity-[0.24]" aria-hidden>
        <div className="absolute inset-[-10%] [background-image:linear-gradient(rgba(72,55,30,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(72,55,30,0.05)_1px,transparent_1px)] [background-size:96px_96px]" />
      </div>

      <section className="relative z-10 flex min-h-[100svh] items-center px-5 pb-14 pt-24 sm:px-6 md:px-8 lg:pb-20 lg:pt-36 xl:px-12">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_82%_16%,rgba(197,155,86,0.18),transparent_32rem),linear-gradient(180deg,#fffdf8,#f6ecdc)]" />
        <BusinessBlueprint className="opacity-35" />

        <div className="relative mx-auto grid w-full max-w-[1480px] gap-8 lg:grid-cols-[0.88fr_1.12fr] lg:items-center xl:gap-16">
          <div className="max-w-[48rem]">
            <motion.p
              initial={reduceMotion ? false : { opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.8, ease }}
              className="flex items-center gap-4 text-[0.72rem] font-semibold uppercase tracking-[0.3em] text-[#8b1118]"
            >
              <span className="h-px w-12 bg-[#b88a44]" />
              RACTYSH BUSINESS
            </motion.p>

            <h1
              aria-label="Business Ecosystem. Built For Strategic Growth."
              className="mt-7 max-w-[54rem] font-display text-[clamp(3.05rem,5.7vw,6.15rem)] font-semibold leading-[0.92] tracking-[0] text-[#111111]"
            >
              <span className="block overflow-hidden">
                <motion.span
                  initial={reduceMotion ? false : { opacity: 0, y: 88 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: reduceMotion ? 0 : 1.05, ease }}
                  className="block"
                >
                  Business Ecosystem.
                </motion.span>
              </span>
              <span className="block overflow-hidden text-[#8B1118]">
                <motion.span
                  initial={reduceMotion ? false : { opacity: 0, y: 88 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: reduceMotion ? 0 : 1.05, delay: 0.1, ease }}
                  className="block"
                >
                  Built For Strategic Growth.
                </motion.span>
              </span>
            </h1>

            <motion.p
              initial={reduceMotion ? false : { opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.9, delay: 0.35, ease }}
              className="mt-7 max-w-[36rem] text-[1rem] font-medium leading-8 text-[#5d5348] md:text-[1.08rem]"
            >
              Integrated business intelligence, execution systems and enterprise operations across the Ractysh ecosystem.
            </motion.p>

            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.9, delay: 0.48, ease }}
              className="mt-9 flex flex-col gap-3 sm:flex-row"
            >
              <ButtonLink href="/book-consultation">Book Strategic Consultation</ButtonLink>
              <ButtonLink href="/contact" variant="light">Contact Team</ButtonLink>
            </motion.div>

            <div className="mt-12 hidden max-w-[36rem] grid-cols-3 border-y border-[#d8c59d]/62 py-5 md:grid">
              {["Intelligence", "Execution", "Expansion"].map((item) => (
                <div key={item} className="border-r border-[#d8c59d]/52 px-4 first:pl-0 last:border-r-0 last:pr-0">
                  <p className="text-[0.58rem] font-semibold uppercase tracking-[0.18em] text-[#8b1118]/70">Business</p>
                  <p className="mt-2 font-display text-[1.35rem] font-semibold leading-none tracking-[0] text-[#211812]">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 34, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: reduceMotion ? 0 : 1.05, delay: 0.18, ease }}
            className="relative -mx-3 min-h-[35rem] overflow-hidden rounded-[8px] border border-[#dfcfaa] bg-[#15110d] shadow-[0_34px_120px_rgba(58,41,18,0.16)] sm:mx-0 md:min-h-[44rem]"
          >
            <Image
              src="/visualization/gallery-lobby.webp"
              alt="Premium enterprise boardroom for strategic business operations"
              fill
              priority
              sizes="(min-width: 1024px) 54vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(21,17,13,0.72),rgba(21,17,13,0.22)_50%,rgba(21,17,13,0.62)),linear-gradient(180deg,rgba(0,0,0,0.02),rgba(0,0,0,0.46))]" />
            <div className="real-estate-service-gold-sweep absolute inset-[-4%] z-10" aria-hidden />
            <div className="absolute left-5 top-5 z-20 rounded-[8px] border border-white/22 bg-white/14 px-4 py-3 text-[#fff8ec] shadow-[0_16px_48px_rgba(0,0,0,0.22)] backdrop-blur-xl">
              <p className="text-[0.56rem] font-semibold uppercase tracking-[0.22em] text-[#d8b765]">Executive Desk</p>
              <p className="mt-1 font-display text-[1.5rem] font-semibold leading-none tracking-[0]">Strategic Growth</p>
            </div>
            <div className="absolute bottom-5 right-5 z-20 w-[min(24rem,calc(100%-2.5rem))] rounded-[8px] border border-white/20 bg-[#15110d]/76 p-5 text-[#fff8ec] shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur-xl">
              <p className="text-[0.6rem] font-semibold uppercase tracking-[0.22em] text-[#d8b765]">Operating Signals</p>
              <div className="mt-5 grid gap-4">
                {["Division Sync", "Market Readiness", "Execution Control"].map((signal, index) => (
                  <div key={signal}>
                    <div className="flex items-center justify-between gap-4 text-[0.82rem] font-semibold">
                      <span>{signal}</span>
                      <span>{["5/5", "92%", "100%"][index]}</span>
                    </div>
                    <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/14">
                      <motion.span
                        initial={reduceMotion ? false : { scaleX: 0 }}
                        animate={{ scaleX: [0.72, 0.92, 0.82][index] }}
                        transition={{ duration: reduceMotion ? 0 : 1.1, delay: 0.55 + index * 0.1, ease }}
                        className="block h-full origin-left rounded-full bg-gradient-to-r from-[#8b1118] via-[#d6b45f] to-[#fff0b8]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="business-showcase" className="real-estate-service-showcase relative z-10 min-h-[100svh] overflow-hidden bg-[#fbf6ec] px-5 py-20 text-[#15110d] sm:px-6 md:px-8 lg:py-24 xl:px-12">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_22%,rgba(197,155,86,0.16),transparent_28rem),radial-gradient(circle_at_82%_66%,rgba(255,255,255,0.72),transparent_32rem),linear-gradient(180deg,#fffdf8,#f3e7d4)]" />
        <BusinessBlueprint className="opacity-28" />
        <div className="real-estate-service-progress absolute left-5 right-5 top-6 h-px bg-[#d8c59d]/70 md:left-8 md:right-8" aria-hidden />

        <div className="relative z-10 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4 lg:overflow-visible">
          <div className="real-estate-service-intro flex min-h-[38rem] w-[min(88vw,33rem)] shrink-0 snap-start flex-col justify-between rounded-[8px] border border-[#dfcfaa] bg-white/76 p-6 shadow-[0_28px_90px_rgba(184,138,68,0.08)] backdrop-blur-xl md:p-8">
            <div>
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-[#9d742a]">Premium Showcase</p>
              <h2 className="mt-6 font-display text-[clamp(2.55rem,5vw,5.7rem)] font-semibold leading-[0.9] tracking-[0] text-[#15110d]">
                Business pillars built for strategic movement.
              </h2>
              <p className="mt-6 max-w-[28rem] text-[15px] font-medium leading-[1.8] text-[#62594f]">
                A horizontal executive view of the systems that move business from intent to expansion.
              </p>
            </div>
            <div className="mt-10 flex items-center gap-3 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[#9d742a]">
              <span>Scroll</span>
              <ArrowRight className="h-4 w-4" />
              <span>Pillars</span>
            </div>
          </div>

          {pillars.map((pillar, index) => {
            const Icon = pillar.Icon;

            return (
              <motion.article
                key={pillar.title}
                initial={reduceMotion ? false : { opacity: 0, y: 42 }}
                whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.22 }}
                transition={{ duration: reduceMotion ? 0 : 0.78, delay: index * 0.04, ease }}
                className="real-estate-service-story group min-h-[38rem] w-[min(92vw,49rem)] shrink-0 snap-start overflow-hidden rounded-[8px] border border-[#dfcfaa] bg-[#fffdf8] text-[#15110d] shadow-[0_34px_110px_rgba(184,138,68,0.12)]"
              >
                <div className="grid h-full lg:grid-cols-[minmax(0,0.62fr)_minmax(19rem,0.38fr)]">
                  <figure className="relative min-h-[24rem] overflow-hidden bg-[#111]">
                    <Image
                      src={pillar.image}
                      alt={`${pillar.title} business pillar`}
                      fill
                      sizes="(min-width: 1024px) 32rem, 92vw"
                      className="object-cover transition duration-700 group-hover:scale-[1.05]"
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.02),rgba(0,0,0,0.5))]" />
                    <figcaption className="absolute bottom-5 left-5 rounded-full border border-white/22 bg-black/28 px-4 py-2 text-[0.66rem] font-semibold uppercase tracking-[0.18em] text-[#fff8ec] backdrop-blur-xl">
                      {pillar.number}
                    </figcaption>
                  </figure>

                  <div className="flex flex-col justify-between p-6 md:p-8">
                    <div>
                      <p className="text-[0.66rem] font-semibold uppercase tracking-[0.22em] text-[#8b1118]/72">
                        {pillar.label}
                      </p>
                      <h3 className="mt-5 font-display text-[clamp(2.65rem,4.6vw,5.2rem)] font-semibold leading-[0.88] tracking-[0] text-[#15110d]">
                        {pillar.title}
                      </h3>
                      <p className="mt-6 text-[15px] font-medium leading-[1.85] text-[#62564c]">{pillar.body}</p>
                    </div>
                    <div className="mt-10 flex items-center justify-between border-t border-[#d8c188]/48 pt-5">
                      <span className="text-[0.64rem] font-semibold uppercase tracking-[0.18em] text-[#9a7428]">
                        Business Capability
                      </span>
                      <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#d8c188] text-[#8b1118]">
                        <Icon className="h-4 w-4" strokeWidth={1.7} />
                      </span>
                    </div>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </section>

      <section className="relative z-10 bg-[#fffaf0] px-5 py-20 sm:px-6 md:px-8 lg:py-28 xl:px-12">
        <BusinessBlueprint className="opacity-22" />
        <div className="relative mx-auto max-w-[1420px]">
          <div className="grid gap-7 lg:grid-cols-[0.62fr_0.38fr] lg:items-end">
            <SectionHeading
              eyebrow="Executive Metrics"
              title="Business signals designed for leadership clarity."
              text="A concise view of scale, division coverage and execution discipline across the Ractysh enterprise ecosystem."
            />
            <p className="max-w-[31rem] text-[1rem] font-medium leading-8 text-[#62594f] lg:justify-self-end">
              Structured indicators keep leadership aligned on delivery, partnership depth and strategic growth readiness.
            </p>
          </div>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {metrics.map((metric, index) => (
              <CountMetric key={metric.label} {...metric} index={index} />
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 bg-[linear-gradient(180deg,#fffaf0,#f6ead8)] px-5 py-20 sm:px-6 md:px-8 lg:py-32 xl:px-12">
        <div className="mx-auto grid max-w-[1420px] gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(24rem,0.95fr)] lg:items-center">
          <Reveal>
            <figure className="real-estate-service-property group relative min-h-[34rem] overflow-hidden rounded-[8px] border border-[#dfcfaa] bg-[#15110d] shadow-[0_34px_120px_rgba(58,41,18,0.16)] md:min-h-[42rem]">
              <Image
                src="/services/showcase-architecture.webp"
                alt="Enterprise planning space for business capability development"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover transition duration-700 group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.04)_20%,rgba(0,0,0,0.56)_100%)]" />
              <figcaption className="absolute bottom-6 left-6 right-6 text-[#fff8ec] md:bottom-8 md:left-8 md:right-8">
                <p className="text-[0.64rem] font-semibold uppercase tracking-[0.22em] text-[#d8b765]">Enterprise Capability</p>
                <h3 className="mt-4 max-w-[42rem] font-display text-[clamp(2.55rem,4.8vw,5.6rem)] font-semibold leading-[0.88] tracking-[0]">
                  From business intent to operational control.
                </h3>
              </figcaption>
            </figure>
          </Reveal>

          <Reveal delay={0.08} className="lg:pl-6">
            <SectionHeading
              eyebrow="Capability System"
              title="A strategic operating layer for complex enterprise work."
              text="Ractysh Business connects planning, intelligence, commercial development and partner readiness into one execution language."
            />
            <div className="mt-9 grid gap-4">
              {capabilities.map((capability) => (
                <div key={capability} className="flex items-start gap-3 border-t border-[#dfcfaa] pt-4">
                  <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-[#8b1118]" strokeWidth={1.9} />
                  <p className="text-[0.98rem] font-medium leading-7 text-[#62594f]">{capability}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="relative z-10 bg-[#fffaf0] px-5 py-20 sm:px-6 md:px-8 lg:py-28 xl:px-12">
        <div className="mx-auto max-w-[1420px]">
          <SectionHeading
            eyebrow="Operating Flow"
            title="A disciplined sequence from insight to expansion."
            text="Every engagement is organized around clear intelligence, accountable execution and market-ready expansion pathways."
          />
          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {operatingLayers.map((layer, index) => (
              <Reveal key={layer.title} delay={index * 0.06}>
                <article className="real-estate-service-property min-h-[20rem] rounded-[8px] border border-[#dfcfaa] bg-white p-6 shadow-[0_24px_86px_rgba(58,41,18,0.08)]">
                  <p className="font-display text-[2.5rem] font-semibold leading-none text-[#8b1118]/18">{layer.label}</p>
                  <h3 className="mt-8 font-display text-[2rem] font-semibold leading-none tracking-[0] text-[#15110d]">{layer.title}</h3>
                  <p className="mt-5 text-[0.98rem] font-medium leading-8 text-[#62594f]">{layer.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 bg-[linear-gradient(180deg,#fffaf0,#f6ead8)] px-5 py-20 sm:px-6 md:px-8 lg:py-32 xl:px-12">
        <BusinessBlueprint className="opacity-20" />
        <div className="relative mx-auto max-w-[1420px]">
          <div className="grid gap-7 lg:grid-cols-[0.65fr_0.35fr] lg:items-end">
            <SectionHeading
              eyebrow="Business Insights"
              title="Featured intelligence from the Ractysh editorial desk."
              text="Published business perspectives selected for strategic relevance across markets, assets and enterprise operations."
            />
            <ButtonLink href="/blog" variant="light">View All Insights</ButtonLink>
          </div>

          <div className="mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {insights.length ? (
              insights.map((insight, index) => (
                <Reveal key={insight.slug} delay={index * 0.04}>
                  <Link
                    href={`/blog/${insight.slug}`}
                    className="real-estate-service-property group block h-full overflow-hidden rounded-[8px] border border-[#dfcfaa] bg-white shadow-[0_24px_86px_rgba(58,41,18,0.08)]"
                  >
                    <figure className="relative aspect-[16/10] overflow-hidden bg-[#15110d]">
                      <Image
                        src={insight.coverImage}
                        alt={insight.coverImageAlt || insight.title}
                        fill
                        loading="lazy"
                        sizes="(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 100vw"
                        className="object-cover transition duration-700 group-hover:scale-[1.05]"
                      />
                      <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_38%,rgba(0,0,0,0.48))]" />
                      <p className="absolute left-4 top-4 rounded-full border border-white/28 bg-white/16 px-3 py-1.5 text-[0.58rem] font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-xl">
                        {insight.category}
                      </p>
                    </figure>
                    <div className="p-5 md:p-6">
                      <div className="flex items-center justify-between gap-4 text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-[#9d742a]">
                        <span>{insight.readTime}</span>
                        <span><InsightDate value={insight.publishedAt} /></span>
                      </div>
                      <h3 className="mt-5 font-display text-[clamp(1.85rem,3vw,2.65rem)] font-semibold leading-[0.98] tracking-[0] text-[#15110d]">
                        {insight.title}
                      </h3>
                      <p className="mt-5 line-clamp-3 text-[0.96rem] font-medium leading-8 text-[#62594f]">{insight.excerpt}</p>
                      <div className="mt-7 inline-flex items-center gap-2 text-[0.72rem] font-bold uppercase tracking-[0.16em] text-[#8b1118]">
                        Read Insight
                        <ArrowUpRight className="h-4 w-4" strokeWidth={1.8} />
                      </div>
                    </div>
                  </Link>
                </Reveal>
              ))
            ) : (
              <article className="real-estate-service-property rounded-[8px] border border-[#dfcfaa] bg-white p-6 shadow-[0_24px_86px_rgba(58,41,18,0.08)] md:col-span-2 xl:col-span-3">
                <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-[#8b1118]">CMS Status</p>
                <h3 className="mt-4 font-display text-[2.4rem] font-semibold leading-none tracking-[0] text-[#15110d]">
                  No published business insights are available yet.
                </h3>
                <p className="mt-5 max-w-[38rem] text-[0.98rem] font-medium leading-8 text-[#62594f]">
                  This section is connected to Prisma and will populate automatically when published blog records are available.
                </p>
              </article>
            )}
          </div>
        </div>
      </section>

      <section className="relative z-10 overflow-hidden bg-[#15110d] px-5 py-20 text-[#fff8ec] sm:px-6 md:px-8 lg:py-28 xl:px-12">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(214,180,95,0.18),transparent_30rem),linear-gradient(90deg,rgba(21,17,13,0.94),rgba(21,17,13,0.72))]" />
        <div className="relative mx-auto grid max-w-[1420px] gap-9 lg:grid-cols-[0.72fr_0.28fr] lg:items-end">
          <div>
            <p className="flex items-center gap-4 text-[0.7rem] font-semibold uppercase tracking-[0.26em] text-[#d8b765]">
              <span className="h-px w-10 bg-[#d8b765]" />
              Consultation
            </p>
            <h2 className="mt-5 max-w-[58rem] font-display text-[clamp(2.8rem,5.4vw,6.4rem)] font-semibold leading-[0.9] tracking-[0]">
              Build the next business system with Ractysh.
            </h2>
            <p className="mt-6 max-w-[38rem] text-[1rem] font-medium leading-8 text-[#fff8ec]/72">
              Start with a strategic consultation or connect directly with the enterprise contact desk.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <ButtonLink href="/book-consultation">Book Strategic Consultation</ButtonLink>
            <ButtonLink href="/contact" variant="light">Contact</ButtonLink>
          </div>
        </div>
      </section>
    </article>
  );
}
