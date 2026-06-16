import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Building2,
  DraftingCompass,
  Globe2,
  HardHat,
  Landmark,
  ShieldCheck,
  Target
} from "lucide-react";
import { ScrollReveal } from "@/components/animation/ScrollReveal";
import { AboutWhoWeAreEditorial } from "@/components/AboutWhoWeAreEditorial";
import { MarketingChrome } from "@/components/MarketingChrome";
import { getSiteContent } from "@/lib/api";

export const metadata: Metadata = {
  title: "About Ractysh | Premium Enterprise Ecosystem",
  description:
    "Ractysh connects Architecture, Construction, Real Estate, Export & Import and OTC Exchange into one premium business ecosystem."
};

const divisions = [
  {
    title: "Architecture Division",
    description: "Architecture, planning, visualization and premium spatial systems.",
    href: "/architecture",
    image: "/visualization/gallery-exterior.webp",
    imagePosition: "50% 52%",
    Icon: DraftingCompass
  },
  {
    title: "Construction Division",
    description: "Construction execution, structural systems, MEP and turnkey delivery.",
    href: "/construction",
    image: "/services/infrastructure-premium-bg.webp",
    imagePosition: "50% 44%",
    Icon: HardHat
  },
  {
    title: "Real Estate Division",
    description: "Asset positioning, development advisory, sales readiness and investor presentation.",
    href: "/real-estate",
    image: "/visualization/gallery-lobby.webp",
    imagePosition: "52% 50%",
    Icon: Building2
  },
  {
    title: "Export & Import Division",
    description: "Global export, import and enterprise trade coordination systems designed for modern commercial operations.",
    href: "/import-export",
    image: "/services/global-trade-transport.webp",
    imagePosition: "56% 50%",
    Icon: Globe2
  },
  {
    title: "OTC Exchange Division",
    description: "Private counterparty intake, deal-room documentation and transaction-readiness workflows.",
    href: "/otc-exchange",
    image: "/contact/enterprise-architecture-workspace.webp",
    imagePosition: "54% 48%",
    Icon: ShieldCheck
  }
];

type AboutDivisionCardStyle = CSSProperties & {
  "--about-division-image": string;
  "--about-division-position": string;
};

const values = [
  {
    title: "Strategic Thinking",
    description: "Decisions shaped around durable business direction, risk awareness and long-term value.",
    Icon: Target
  },
  {
    title: "Premium Delivery",
    description: "Execution quality that feels disciplined, refined and accountable from brief to handover.",
    Icon: Landmark
  },
  {
    title: "Operational Transparency",
    description: "Clear coordination, documented progress and direct visibility across every enterprise layer.",
    Icon: ShieldCheck
  }
];

const journey = ["Foundation", "Architecture", "Construction", "Real Estate + Trade", "OTC Ecosystem"];

export default async function AboutPage() {
  const content = await getSiteContent();

  return (
    <MarketingChrome content={content}>
      <div className="relative isolate overflow-x-clip bg-[#f8f3e9] text-[#1d1714]">
        <div className="about-page-texture pointer-events-none absolute inset-0 -z-10 opacity-[0.42]" />
        <div className="pointer-events-none absolute left-1/2 top-10 -z-10 h-[28rem] w-[44rem] -translate-x-1/2 rounded-full bg-[#d6b45f]/14 blur-3xl" />
        <div className="pointer-events-none absolute right-0 top-[42rem] -z-10 h-[32rem] w-[32rem] rounded-full bg-[#8b1118]/8 blur-3xl" />

        <AboutWhoWeAreEditorial sectionId="about-who-we-are" anchorId="about-who-we-are-anchor" />

        <section className="px-5 py-14 md:px-8 md:py-20">
          <div className="mx-auto max-w-[86rem]">
            <ScrollReveal className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-[#8b1118]">Core Divisions</p>
                <h2 className="mt-4 font-display text-[24px] font-semibold leading-[1.04] tracking-[-0.04em] text-[#201714] md:text-[30px] lg:text-[36px]">
                  Our Enterprise Divisions
                </h2>
              </div>
              <p className="max-w-[25rem] text-[15px] leading-[1.7] text-[#6a625b]">
                Five focused operating pillars connected by a single premium enterprise standard.
              </p>
            </ScrollReveal>

            <div className="mt-10 grid auto-rows-fr gap-5 md:grid-cols-2 xl:grid-cols-5">
              {divisions.map((division, index) => {
                const Icon = division.Icon;
                return (
                  <ScrollReveal key={division.title} delay={index * 0.06} className="h-full">
                    <Link
                      href={division.href}
                      className="about-division-card group flex h-full min-h-[17.5rem] flex-col rounded-[1.2rem] border border-[#e0cfaa] bg-white/88 p-7 shadow-[0_18px_54px_rgba(53,39,20,0.055)] transition duration-300 hover:-translate-y-1 hover:border-[#d6b45f]/80 hover:shadow-[0_26px_70px_rgba(53,39,20,0.09)]"
                      style={
                        {
                          "--about-division-image": `url(${division.image})`,
                          "--about-division-position": division.imagePosition
                        } as AboutDivisionCardStyle
                      }
                    >
                      <span className="flex h-12 w-12 items-center justify-center rounded-[0.9rem] border border-[#eadfc6] bg-[#fbf6ec] text-[#8b1118] transition duration-300 group-hover:border-[#d6b45f]/70 group-hover:text-[#a37a2b]">
                        <Icon className="h-5 w-5" strokeWidth={1.9} />
                      </span>
                      <h3 className="mt-7 min-h-[2.55rem] max-w-[16rem] font-display text-[18px] font-semibold leading-[1.12] tracking-[-0.03em] text-[#201714] md:min-h-[3.1rem] md:text-[22px]">
                        {division.title}
                      </h3>
                      <p className="mt-4 flex-1 text-[15px] leading-[1.7] text-[#665e57]">{division.description}</p>
                      <span className="inline-flex items-center gap-2 pt-7 text-[0.82rem] font-semibold uppercase tracking-[0.16em] text-[#8b1118] transition duration-300 group-hover:text-[#a37a2b]">
                        Explore <ArrowUpRight className="h-3.5 w-3.5" />
                      </span>
                    </Link>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>
        </section>

        <section className="px-5 py-14 md:px-8 md:py-20">
          <ScrollReveal className="mx-auto max-w-[76rem] text-center">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-[#8b1118]">Enterprise Values</p>
            <h2 className="mx-auto mt-4 max-w-[38rem] font-display text-[24px] font-semibold leading-[1.04] tracking-[-0.04em] text-[#201714] md:text-[30px] lg:text-[36px]">
              Built on trust, precision and execution.
            </h2>
          </ScrollReveal>

          <div className="mx-auto mt-10 max-w-[76rem] divide-y divide-[#ddd0ba] border-y border-[#ddd0ba]">
            {values.map((value, index) => {
              const Icon = value.Icon;
              return (
                <ScrollReveal key={value.title} delay={index * 0.05}>
                  <div className="grid gap-5 py-8 md:grid-cols-[3rem_0.45fr_1fr] md:items-center">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full border border-[#e1d4bb] bg-white/70 text-[#8b1118]">
                      <Icon className="h-4 w-4" strokeWidth={1.9} />
                    </span>
                    <h3 className="font-display text-[18px] font-semibold tracking-[-0.03em] text-[#201714] md:text-[22px]">{value.title}</h3>
                    <p className="max-w-[35rem] text-[15px] leading-[1.7] text-[#665e57] md:justify-self-end">
                      {value.description}
                    </p>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </section>

        <section className="px-5 py-14 md:px-8 md:py-20">
          <div className="mx-auto max-w-[82rem]">
            <ScrollReveal className="text-center">
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-[#8b1118]">Enterprise Journey</p>
              <h2 className="mx-auto mt-4 max-w-[36rem] font-display text-[24px] font-semibold leading-[1.04] tracking-[-0.04em] text-[#201714] md:text-[30px] lg:text-[36px]">
                A focused journey from foundation to ecosystem.
              </h2>
            </ScrollReveal>

            <ScrollReveal className="mt-10">
              <div className="relative grid gap-8 md:grid-cols-5">
                <div className="absolute left-0 top-[1.45rem] hidden h-px w-full overflow-hidden bg-[#ded0b9] md:block">
                  <div className="about-timeline-line h-full w-full origin-left" />
                </div>
                {journey.map((step, index) => (
                  <div key={step} className="relative">
                    <span className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full border border-[#d6b45f]/70 bg-[#fffaf0] text-[0.82rem] font-semibold text-[#8b1118] shadow-[0_10px_30px_rgba(68,45,18,0.08)]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h3 className="mt-5 font-display text-[18px] font-semibold tracking-[-0.03em] text-[#201714] md:text-[20px]">{step}</h3>
                    <p className="mt-3 max-w-[14rem] text-[15px] leading-[1.7] text-[#6a625b]">
                      {index === 0
                        ? "The first operating foundation for premium enterprise coordination."
                        : index === 1
                          ? "Design, business and client operations expand into structured systems."
                          : index === 2
                            ? "Construction delivery becomes a core enterprise execution layer."
                            : index === 3
                              ? "Real estate positioning and export-import trade systems expand the group."
                              : "Ractysh connects all five pillars into one premium enterprise ecosystem."}
                    </p>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </section>

        <section className="px-5 py-16 md:px-8 md:py-20">
          <ScrollReveal className="relative mx-auto max-w-[72rem] overflow-hidden rounded-[1.5rem] border border-[#e0cfaa] bg-[#18110f] px-6 py-14 text-center text-white shadow-[0_28px_86px_rgba(26,16,10,0.18)] md:px-10 md:py-16">
            <div className="pointer-events-none absolute left-1/2 top-0 h-[18rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#d6b45f]/24 blur-3xl" />
            <Building2 className="relative mx-auto h-9 w-9 text-[#d6b45f]" strokeWidth={1.6} />
            <h2 className="relative mx-auto mt-6 max-w-[36rem] font-display text-[24px] font-semibold leading-[1.04] tracking-[-0.04em] md:text-[30px] lg:text-[36px]">
              Build with a connected enterprise ecosystem.
            </h2>
            <p className="relative mx-auto mt-5 max-w-[34rem] text-[15px] leading-[1.7] text-white/68 md:text-[16px]">
              Architecture, Construction, Real Estate, Export & Import and OTC Exchange designed for long-term growth.
            </p>
            <Link
              href="/book-consultation"
              className="premium-cta relative mt-8"
            >
              Book a Demo
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </ScrollReveal>
        </section>
      </div>
    </MarketingChrome>
  );
}
