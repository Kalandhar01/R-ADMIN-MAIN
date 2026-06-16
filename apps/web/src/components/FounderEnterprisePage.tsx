"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowUpRight,
  BadgeCheck,
  DraftingCompass,
  Globe2,
  HardHat,
  Landmark,
  ShieldCheck,
  Target
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import founderPortrait from "@/assets/founder-portrait.png";
import { BrandLogo } from "@/components/BrandLogo";
import { CompanyContactPanel } from "@/components/CompanyContactPanel";
import type { FounderProfile } from "@/lib/types";

gsap.registerPlugin(ScrollTrigger);

const motionEase = [0.22, 1, 0.36, 1] as const;

const philosophyCards = [
  {
    title: "Operational Precision",
    description:
      "A leadership culture built around documented decisions, clear controls and accountable execution across every operating layer.",
    Icon: Target
  },
  {
    title: "Long-Term Enterprise Thinking",
    description:
      "Systems are planned as durable foundations, connecting Architecture, Construction, Real Estate, Trade and Private Exchange into one enterprise frame.",
    Icon: Landmark
  },
  {
    title: "Enterprise Trust & Execution",
    description:
      "Premium clients need confidentiality, consistency and visible ownership from first conversation to final handover.",
    Icon: ShieldCheck
  }
];

const timelineSteps = [
  {
    title: "Architecture Division",
    eyebrow: "Architecture and spatial systems",
    description:
      "Premium architecture, interiors, planning and visualization brought into a disciplined enterprise design studio.",
    Icon: DraftingCompass
  },
  {
    title: "Construction Division",
    eyebrow: "Construction execution",
    description:
      "Civil & MEP engineering, commercial & residential buildings, PEB, turnkey, interiors, landscape, swimming pools, lifts, mega structures, government tenders and testing under one accountable platform.",
    Icon: HardHat
  },
  {
    title: "Real Estate Division",
    eyebrow: "Asset strategy",
    description:
      "Asset positioning, development advisory, sales readiness and investor material shaped for premium property opportunities.",
    Icon: Landmark
  },
  {
    title: "Export & Import Division",
    eyebrow: "Export-import operations",
    description:
      "Global trade coordination, supplier network management and enterprise supply systems shaped for modern commercial operations.",
    Icon: Globe2
  },
  {
    title: "OTC Exchange Division",
    eyebrow: "Private exchange workflow",
    description:
      "Qualified counterparty intake, deal-room documentation and transaction-readiness coordination for private opportunities.",
    Icon: ShieldCheck
  }
];

interface FounderEnterprisePageProps {
  founder: FounderProfile;
}

export function FounderEnterprisePage({ founder }: FounderEnterprisePageProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);
  const founderName = "AR. P.M.S. NOORUL FAWAS";
  const founderRole = "FOUNDER & CHAIRMAN";
  const founderSubtitle = "Visionary Behind The Ractysh Ecosystem";
  const founderDescription =
    "Leading the Ractysh ecosystem across Architecture, Construction, Real Estate, Import-Export, OTC Exchange and enterprise operations through long-term vision and execution excellence.";
  const portraitAlt =
    founder.name && founder.name.toLowerCase() !== "ractysh founder" ? founder.name : founderName;

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const context = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-founder-reveal]").forEach((element) => {
        gsap.fromTo(
          element,
          { opacity: 0, y: 34 },
          {
            opacity: 1,
            y: 0,
            duration: 0.95,
            ease: "power4.out",
            immediateRender: false,
            scrollTrigger: {
              trigger: element,
              start: "top 84%"
            }
          }
        );
      });

      gsap.utils.toArray<HTMLElement>("[data-founder-scale]").forEach((element) => {
        gsap.fromTo(
          element,
          { opacity: 0, scale: 0.965, y: 18 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 1.05,
            ease: "power4.out",
            immediateRender: false,
            scrollTrigger: {
              trigger: element,
              start: "top 82%"
            }
          }
        );
      });

      if (portraitRef.current) {
        gsap.to(portraitRef.current, {
          yPercent: -7,
          ease: "none",
          scrollTrigger: {
            trigger: "[data-founder-hero]",
            start: "top top",
            end: "bottom top",
            scrub: 1.15
          }
        });
      }

      gsap.fromTo(
        "[data-founder-timeline-line]",
        { scaleY: 0, transformOrigin: "top center" },
        {
          scaleY: 1,
          duration: 1.15,
          ease: "power4.out",
          immediateRender: false,
          scrollTrigger: {
            trigger: "[data-founder-timeline]",
            start: "top 72%"
          }
        }
      );

      gsap.to("[data-founder-curve]", {
        y: -16,
        duration: 5.2,
        stagger: 0.18,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    }, root);

    return () => context.revert();
  }, []);

  return (
    <div ref={rootRef} className="relative isolate overflow-hidden bg-[#f8f1e4] text-[#1c120e]">
      <FounderBackground />

      <section
        id="hero"
        data-founder-hero
        className="relative z-10 overflow-hidden bg-[#080604] text-[#fff7e8]"
      >
        <div className="relative min-h-[100svh] overflow-hidden md:hidden">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.25, ease: motionEase }}
            className="absolute inset-x-0 top-[5.75rem] z-10 flex h-[calc(100svh-18rem)] min-h-[21rem] items-center justify-center px-5 sm:top-[6.35rem] sm:h-[calc(100svh-19rem)]"
          >
            <div
              ref={portraitRef}
              className="relative flex w-full max-w-[23rem] items-center justify-center rounded-[8px] border border-[#d9bd7a]/48 bg-[#fff7e8] p-2 shadow-[0_28px_86px_rgba(0,0,0,0.42),0_0_0_1px_rgba(255,247,232,0.12)_inset] sm:max-w-[26rem]"
            >
              <Image
                src={founderPortrait}
                alt={portraitAlt}
                priority
                placeholder="blur"
                quality={88}
                sizes="100vw"
                className="h-auto w-full rounded-[6px] object-contain object-center contrast-[1.04] brightness-[0.98] saturate-[1.03]"
              />
            </div>
          </motion.div>

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_60%_34%,transparent_0%,rgba(8,6,4,0.18)_42%,rgba(8,6,4,0.9)_100%),linear-gradient(90deg,rgba(8,6,4,0.96)_0%,rgba(8,6,4,0.72)_31%,rgba(8,6,4,0.14)_62%,rgba(8,6,4,0.62)_100%),linear-gradient(180deg,rgba(8,6,4,0.72)_0%,transparent_28%,rgba(8,6,4,0.88)_100%)]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-0 opacity-[0.22] [background-image:radial-gradient(circle_at_1px_1px,rgba(240,219,177,0.26)_1px,transparent_0)] [background-size:18px_18px]"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#d9bd7a]/70 to-transparent"
          />

          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.86, delay: 1.12, ease: motionEase }}
            className="absolute right-5 top-[6.25rem] z-30 grid h-14 w-14 place-items-center rounded-full border border-[#d9bd7a]/52 bg-[#100b08]/58 shadow-[0_18px_52px_rgba(0,0,0,0.34),0_0_24px_rgba(217,189,122,0.08)] backdrop-blur-md [@media(max-height:700px)]:hidden sm:right-8 sm:top-[6.75rem] sm:h-[5.1rem] sm:w-[5.1rem]"
          >
            <div className="absolute inset-1.5 rounded-full border border-[#d9bd7a]/24" />
            <BrandLogo
              size="lg"
              decorative
              className="relative z-10 h-10 w-10 sm:h-[3.65rem] sm:w-[3.65rem]"
              imageClassName="drop-shadow-[0_10px_18px_rgba(0,0,0,0.38)]"
            />
          </motion.div>

          <div className="relative z-20 mx-auto flex min-h-[100svh] w-full max-w-[92rem] items-end px-5 pb-12 pt-[7.25rem]">
            <div data-founder-identity-overlay className="max-w-[42rem] pb-1">
              <motion.p
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.78, delay: 0.64, ease: motionEase }}
                className="text-[0.72rem] font-bold uppercase leading-none tracking-[0] text-[#d7c08b] drop-shadow-[0_8px_20px_rgba(0,0,0,0.45)] sm:text-[0.78rem]"
              >
                {founderRole}
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.96, delay: 0.8, ease: motionEase }}
                className="mt-4 max-w-[38rem] bg-[linear-gradient(112deg,#fff5df_0%,#e2c98d_29%,#b88d49_52%,#f8ead0_73%,#caa762_100%)] bg-clip-text font-display text-[2.1rem] font-semibold uppercase leading-[0.95] tracking-[0] text-transparent drop-shadow-[0_14px_34px_rgba(0,0,0,0.5)] sm:text-[2.7rem]"
              >
                {founderName}
              </motion.h1>

              <motion.div
                aria-hidden="true"
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.78, delay: 0.98, ease: motionEase }}
                className="mt-5 h-px w-28 origin-left bg-gradient-to-r from-[#d9bd7a] via-[#fff0c8]/70 to-transparent sm:w-36"
              />

              <motion.p
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.86, delay: 1.08, ease: motionEase }}
                className="mt-5 max-w-[31rem] !font-display text-[1.22rem] font-medium leading-[1.18] tracking-[0] text-[#f4e4c2] drop-shadow-[0_10px_24px_rgba(0,0,0,0.48)] sm:text-[1.4rem]"
              >
                {founderSubtitle}
              </motion.p>
            </div>
          </div>
        </div>

        <div className="relative hidden min-h-[100svh] overflow-hidden md:flex md:flex-col md:px-8 md:pb-16 md:pt-[7.25rem] lg:hidden">
          <FounderHeroAtmosphere />
          <motion.div
            initial={{ opacity: 0, y: 26, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.08, ease: motionEase }}
            className="relative z-10 mx-auto h-[min(64svh,42rem)] min-h-[38rem] w-full max-w-[34rem] overflow-hidden rounded-[8px] border border-[#d9bd7a]/38 bg-[#130c09] shadow-[0_38px_120px_rgba(0,0,0,0.42),0_0_0_1px_rgba(255,247,232,0.06)_inset] max-[768px]:aspect-[1212/1298] max-[768px]:h-auto max-[768px]:min-h-0 max-[768px]:overflow-visible"
          >
            <Image
              src={founderPortrait}
              alt={portraitAlt}
              fill
              priority
              placeholder="blur"
              quality={88}
              sizes="(min-width: 768px) 34rem, 100vw"
              className="object-cover object-[52%_50%] contrast-[1.04] brightness-[0.96] saturate-[1.03] max-[768px]:object-contain max-[768px]:object-center"
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-[#fff3c4]/10"
            />
          </motion.div>

          <div className="relative z-10 mx-auto mt-10 w-full max-w-[39rem]">
            <FounderHeroCopy
              founderRole={founderRole}
              founderName={founderName}
              founderSubtitle={founderSubtitle}
              founderDescription={founderDescription}
              align="left"
              startDelay={0.42}
            />
          </div>
        </div>

        <div className="relative hidden min-h-[100svh] overflow-hidden lg:grid lg:grid-cols-[55fr_45fr] lg:items-center lg:gap-10 lg:px-10 lg:pb-16 lg:pt-[7.25rem] xl:gap-14 xl:px-14 2xl:px-16">
          <FounderHeroAtmosphere />
          <motion.div
            initial={{ opacity: 0, x: -34, scale: 0.982 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 1.08, ease: motionEase }}
            className="relative z-10 flex h-full min-h-[calc(100svh-9rem)] items-center justify-start"
          >
            <div className="relative h-[min(84svh,52rem)] min-h-[38rem] w-full max-w-[42rem] overflow-hidden rounded-[8px] border border-[#d9bd7a]/40 bg-[#130c09] shadow-[0_48px_140px_rgba(0,0,0,0.48),0_0_0_1px_rgba(255,247,232,0.06)_inset] xl:max-w-[44rem]">
              <Image
                src={founderPortrait}
                alt={portraitAlt}
                fill
                priority
                placeholder="blur"
                quality={88}
                sizes="(min-width: 1280px) 44rem, 55vw"
                className="object-cover object-[52%_50%] contrast-[1.04] brightness-[0.96] saturate-[1.03]"
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-[#fff3c4]/10"
              />
              <span
                aria-hidden="true"
                className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[#d9bd7a]/70 to-transparent"
              />
              <span
                aria-hidden="true"
                className="absolute inset-x-8 bottom-0 h-px bg-gradient-to-r from-transparent via-[#d9bd7a]/42 to-transparent"
              />
            </div>
          </motion.div>

          <div className="relative z-10 flex min-h-[calc(100svh-9rem)] items-center">
            <div className="w-full max-w-[37rem]">
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.82, delay: 0.32, ease: motionEase }}
                className="mb-8 flex items-center gap-3 text-[#d9bd7a]"
                aria-hidden="true"
              >
                <BrandLogo size="sm" decorative imageClassName="drop-shadow-[0_10px_24px_rgba(0,0,0,0.34)]" />
                <span className="h-px flex-1 bg-gradient-to-r from-[#d9bd7a]/58 to-transparent" />
              </motion.div>
              <FounderHeroCopy
                founderRole={founderRole}
                founderName={founderName}
                founderSubtitle={founderSubtitle}
                founderDescription={founderDescription}
                align="left"
                startDelay={0.5}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 px-5 py-16 md:px-8 lg:py-[5.5rem]">
        <div className="mx-auto max-w-[82rem]">
          <div data-founder-reveal className="grid gap-6 lg:grid-cols-[0.72fr_1fr] lg:items-end">
            <div>
              <p className="text-[0.75rem] font-bold uppercase tracking-[0.25em] text-[#8b1118]">
                Leadership Philosophy
              </p>
              <h2 className="mt-4 max-w-[34rem] font-display text-[22px] font-semibold leading-[1.08] tracking-[-0.035em] text-[#20130f] md:text-[28px] lg:text-[34px]">
                Enterprise leadership with disciplined momentum.
              </h2>
            </div>
            <p className="max-w-[38rem] text-[15px] leading-[1.7] text-[#675a4f] md:text-[16px]">
              Ractysh is shaped around leadership systems that balance client discretion, technical clarity and
              execution stamina across sectors that demand trust.
            </p>
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {philosophyCards.map(({ title, description, Icon }, index) => (
              <motion.article
                key={title}
                data-founder-scale
                whileHover={{ y: -8, scale: 1.01 }}
                transition={{ duration: 0.34, ease: motionEase }}
                className="group relative overflow-hidden rounded-[1.45rem] border border-[#d9c28c]/58 bg-white/42 p-6 shadow-[0_20px_70px_rgba(82,52,25,0.07)] backdrop-blur-xl md:p-7"
              >
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#d6b45f]/90 to-transparent opacity-70" />
                <div className="flex h-12 w-12 items-center justify-center rounded-[0.95rem] border border-[#d6b45f]/45 bg-[#fffaf0] text-[#8b1118] shadow-[0_12px_30px_rgba(139,17,24,0.08)]">
                  <Icon className="h-5 w-5" strokeWidth={1.8} />
                </div>
                <p className="mt-7 text-[12px] font-bold uppercase tracking-[0.22em] text-[#a27b2d]">
                  0{index + 1}
                </p>
                <h3 className="mt-3 font-display text-[1.35rem] font-semibold leading-tight text-[#20130f] md:text-[1.5rem]">
                  {title}
                </h3>
                <p className="mt-4 text-[15px] leading-[1.7] text-[#675a4f]">{description}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section id="timeline" data-founder-timeline className="relative z-10 px-5 py-16 md:px-8 lg:py-[5.5rem]">
        <div className="mx-auto grid max-w-[82rem] gap-8 lg:grid-cols-[0.45fr_1fr]">
          <div data-founder-reveal className="lg:sticky lg:top-32 lg:h-fit">
            <p className="text-[0.75rem] font-bold uppercase tracking-[0.25em] text-[#8b1118]">
              Founder Timeline
            </p>
            <h2 className="mt-4 max-w-[30rem] font-display text-[22px] font-semibold leading-[1.08] tracking-[-0.035em] text-[#20130f] md:text-[28px] lg:text-[34px]">
              One vision, built through operating companies.
            </h2>
            <p className="mt-5 text-[15px] leading-[1.7] text-[#675a4f] md:text-[16px]">
              The Ractysh ecosystem is structured as a leadership platform, where each company owns a critical layer of
              enterprise execution.
            </p>
          </div>

          <div className="relative">
            <div className="absolute bottom-8 left-[1.35rem] top-8 w-px origin-top bg-[#d6b45f]/24" />
            <div
              data-founder-timeline-line
              className="absolute bottom-8 left-[1.35rem] top-8 w-px origin-top bg-gradient-to-b from-[#d6b45f] via-[#8b1118] to-[#d6b45f] shadow-[0_0_24px_rgba(214,180,95,0.45)]"
            />
            <div className="space-y-6">
              {timelineSteps.map(({ title, eyebrow, description, Icon }, index) => (
                <motion.article
                  key={title}
                  data-founder-reveal
                  whileHover={{ x: 6 }}
                  transition={{ duration: 0.34, ease: motionEase }}
                  className="relative grid gap-5 pl-14 md:grid-cols-[11rem_1fr] md:items-start md:gap-8"
                >
                  <div className="absolute left-0 top-2 grid h-11 w-11 place-items-center rounded-full border border-[#d6b45f]/75 bg-[#160b0d] text-[#d6b45f] shadow-[0_0_30px_rgba(214,180,95,0.22)]">
                    <Icon className="h-5 w-5" strokeWidth={1.8} />
                  </div>
                  <div className="pt-1">
                    <p className="font-display text-[2.35rem] font-semibold leading-none text-[#8b1118]/12">
                      0{index + 1}
                    </p>
                  </div>
                  <div className="rounded-[1.35rem] border border-[#dec999]/66 bg-[#fffaf0]/66 p-6 shadow-[0_22px_64px_rgba(83,50,22,0.08)] backdrop-blur-xl">
                    <p className="text-[12px] font-bold uppercase tracking-[0.22em] text-[#a27b2d]">{eyebrow}</p>
                    <h3 className="mt-3 font-display text-[1.45rem] font-semibold leading-tight text-[#20130f]">{title}</h3>
                    <p className="mt-4 max-w-[40rem] text-[15px] leading-[1.7] text-[#675a4f]">{description}</p>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 px-5 pb-8 pt-16 md:px-8 lg:pb-10 lg:pt-[5.5rem]">
        <div
          data-founder-scale
          className="mx-auto max-w-[82rem] overflow-hidden rounded-[2rem] border border-[#d8bd79]/62 bg-[#160b0d] px-6 py-12 text-center text-white shadow-[0_34px_100px_rgba(31,12,10,0.22)] md:px-10 md:py-14"
        >
          <div className="mx-auto mb-7 flex justify-center">
            <BrandLogo size="identity" decorative />
          </div>
          <p className="mx-auto max-w-[50rem] text-[22px] font-semibold italic leading-[1.12] tracking-[0] text-[#fff7e8] font-display md:text-[28px] lg:text-[34px]">
            We are building an interconnected enterprise ecosystem designed for future-ready operations.
          </p>
        </div>
      </section>

      <section className="relative z-10 px-5 pb-16 pt-0 md:px-8 lg:pb-[5.5rem]">
        <motion.div
          data-founder-scale
          whileHover={{ y: -4 }}
          transition={{ duration: 0.34, ease: motionEase }}
          className="mx-auto grid max-w-[82rem] gap-7 rounded-[1.65rem] border border-[#d8bd79]/60 bg-[#fffaf0]/78 p-6 shadow-[0_26px_80px_rgba(82,49,20,0.1)] backdrop-blur-xl md:grid-cols-[1fr_auto] md:items-center md:p-8"
        >
          <div>
            <div className="flex items-center gap-3">
              <BadgeCheck className="h-5 w-5 text-[#8b1118]" strokeWidth={1.9} />
              <p className="text-[0.74rem] font-bold uppercase tracking-[0.22em] text-[#a27b2d]">
                Executive access
              </p>
            </div>
            <h2 className="mt-4 font-display text-[22px] font-semibold leading-[1.08] tracking-[-0.035em] text-[#20130f] md:text-[28px] lg:text-[34px]">
              Connect With Leadership
            </h2>
            <p className="mt-4 max-w-[38rem] text-[15px] leading-[1.7] text-[#675a4f] md:text-[16px]">
              Route strategic inquiries through a structured demo desk for private enterprise conversations.
            </p>
            <CompanyContactPanel mode="consultation" tone="transparent" compact className="mt-5 max-w-3xl" />
          </div>
          <div className="flex flex-col gap-3 sm:flex-row md:justify-end">
            <Link
              href="/book-consultation"
              className="premium-cta group"
            >
              Book Consultation
              <ArrowUpRight className="h-4 w-4 transition duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
            <Link
              href="/contact"
              className="premium-cta-secondary group"
            >
              Contact Team
              <ArrowUpRight className="h-4 w-4 transition duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}

function FounderHeroAtmosphere() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_76%_24%,rgba(139,17,24,0.24),transparent_32rem),radial-gradient(ellipse_at_18%_78%,rgba(214,180,95,0.12),transparent_34rem),linear-gradient(135deg,#080604_0%,#120908_48%,#070504_100%)]" />
      <div className="absolute inset-0 opacity-[0.16] [background-image:linear-gradient(rgba(217,189,122,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(217,189,122,0.055)_1px,transparent_1px)] [background-size:86px_86px] [mask-image:radial-gradient(ellipse_at_44%_42%,black,transparent_82%)]" />
      <div className="absolute inset-0 opacity-[0.2] [background-image:radial-gradient(circle_at_1px_1px,rgba(240,219,177,0.2)_1px,transparent_0)] [background-size:18px_18px]" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#d9bd7a]/70 to-transparent" />
    </div>
  );
}

function FounderHeroCopy({
  align,
  founderDescription,
  founderName,
  founderRole,
  founderSubtitle,
  startDelay
}: {
  align: "left";
  founderDescription: string;
  founderName: string;
  founderRole: string;
  founderSubtitle: string;
  startDelay: number;
}) {
  const textAlignClass = align === "left" ? "text-left" : "";

  return (
    <div data-founder-identity-overlay className={textAlignClass}>
      <motion.p
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.78, delay: startDelay, ease: motionEase }}
        className="text-[0.76rem] font-bold uppercase leading-none tracking-[0.18em] text-[#d7c08b] drop-shadow-[0_8px_20px_rgba(0,0,0,0.28)]"
      >
        {founderRole}
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.94, delay: startDelay + 0.14, ease: motionEase }}
        className="mt-5 max-w-[40rem] bg-[linear-gradient(112deg,#fff5df_0%,#e2c98d_28%,#b88d49_52%,#f8ead0_76%,#caa762_100%)] bg-clip-text font-display text-[3.15rem] font-semibold uppercase leading-[0.9] tracking-[0] text-transparent drop-shadow-[0_18px_44px_rgba(0,0,0,0.42)] md:text-[3.9rem] lg:text-[4.45rem] xl:text-[5rem]"
      >
        {founderName}
      </motion.h1>

      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ duration: 0.74, delay: startDelay + 0.28, ease: motionEase }}
        className="mt-6 h-px w-36 origin-left bg-gradient-to-r from-[#d9bd7a] via-[#fff0c8]/70 to-transparent"
      />

      <motion.p
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.84, delay: startDelay + 0.38, ease: motionEase }}
        className="mt-6 max-w-[34rem] !font-display text-[1.55rem] font-medium leading-[1.15] tracking-[0] text-[#f4e4c2] drop-shadow-[0_10px_24px_rgba(0,0,0,0.34)] md:text-[1.82rem] lg:text-[1.95rem]"
      >
        {founderSubtitle}
      </motion.p>

      <motion.p
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.84, delay: startDelay + 0.52, ease: motionEase }}
        className="mt-6 max-w-[35rem] text-[1rem] font-medium leading-8 text-[#d7cab6] opacity-[0.88] lg:text-[1.05rem]"
      >
        {founderDescription}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.82, delay: startDelay + 0.66, ease: motionEase }}
        className="mt-8 flex flex-wrap items-center gap-4"
      >
        <Link
          href="#timeline"
          className="group inline-flex min-h-[3rem] items-center justify-center gap-2 rounded-[8px] border border-[#d9bd7a]/48 bg-[#7b1016] px-5 text-[0.86rem] font-semibold leading-none tracking-[0] text-[#fff1be] shadow-[0_18px_48px_rgba(123,16,22,0.28),inset_0_1px_0_rgba(255,255,255,0.12)] transition duration-300 hover:-translate-y-0.5 hover:border-[#f3d68e]/70 hover:bg-[#8b1118]"
        >
          Chairman&apos;s Message
          <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
        <span className="text-[0.72rem] font-semibold uppercase leading-none tracking-[0.18em] text-[#d9bd7a]/70">
          Founder Signature
        </span>
      </motion.div>
    </div>
  );
}

function FounderBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_76%_4%,rgba(255,255,255,0.94),transparent_34rem),radial-gradient(circle_at_14%_18%,rgba(214,180,95,0.18),transparent_34rem),radial-gradient(circle_at_86%_48%,rgba(139,17,24,0.1),transparent_33rem),linear-gradient(180deg,#fbf3e6_0%,#f7efe1_44%,#f9f2e7_100%)]" />
      <div className="absolute inset-0 opacity-[0.16] [background-image:radial-gradient(circle_at_1px_1px,rgba(55,39,22,0.32)_1px,transparent_0)] [background-size:11px_11px]" />
      <div className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(0deg,rgba(67,43,25,0.55)_1px,transparent_1px),linear-gradient(90deg,rgba(67,43,25,0.42)_1px,transparent_1px)] [background-size:72px_72px]" />
      <svg
        data-founder-curve
        className="absolute left-[-7rem] top-[8rem] h-[28rem] w-[42rem] text-[#d6b45f]/38"
        viewBox="0 0 680 460"
        fill="none"
      >
        <path d="M-20 120C150 25 275 52 356 164C438 278 528 316 704 228" stroke="currentColor" strokeWidth="1.4" />
        <path d="M-8 214C160 126 286 150 372 256C454 357 546 384 690 302" stroke="currentColor" strokeWidth="1" opacity="0.62" />
      </svg>
      <svg
        data-founder-curve
        className="absolute right-[-10rem] top-[36rem] h-[30rem] w-[45rem] text-[#8b1118]/22"
        viewBox="0 0 720 480"
        fill="none"
      >
        <path d="M28 318C158 166 316 118 459 190C574 248 620 332 742 242" stroke="currentColor" strokeWidth="1.2" />
        <path d="M-14 386C142 254 288 228 424 292C555 354 618 398 724 318" stroke="currentColor" strokeWidth="1" opacity="0.6" />
      </svg>
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#fff8eb]/68 to-transparent" />
    </div>
  );
}
