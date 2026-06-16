"use client";

import type { MotionValue } from "framer-motion";
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import {
  ArrowUpRight,
  Building2,
  CheckCircle2,
  DraftingCompass,
  Globe2,
  HardHat,
  Layers3,
  ShieldCheck,
  Ship,
  Workflow
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { PointerEvent as ReactPointerEvent, ReactNode } from "react";
import { useRef } from "react";
import { cn } from "@/lib/utils";

const ease = [0.22, 1, 0.36, 1] as const;

const heroMetrics = [
  { value: "05", label: "Enterprise verticals" },
  { value: "01", label: "Connected operating layer" },
  { value: "24/7", label: "Execution visibility" }
];

const visualNodes = [
  { label: "Design", detail: "Spatial intelligence", Icon: DraftingCompass, className: "left-[4%] top-[16%]" },
  { label: "Build", detail: "Site execution", Icon: HardHat, className: "right-[6%] top-[18%]" },
  { label: "Trade", detail: "Global routing", Icon: Ship, className: "right-[8%] bottom-[18%]" },
  { label: "OTC", detail: "Private desk", Icon: ShieldCheck, className: "left-[7%] bottom-[16%]" }
];

const storyFrames = [
  {
    kicker: "Who We Are",
    title: "Enterprise execution, beautifully connected.",
    body:
      "Ractysh connects Architecture, Construction, Real Estate, Trade and Private Exchange coordination into one calm operating language for high-value work.",
    image: "/visualization/hero-studio.webp",
    alt: "A warm architectural studio with premium material samples and cinematic light."
  },
  {
    kicker: "How It Works",
    title: "Every brief becomes a live operating environment.",
    body:
      "Design intent, procurement movement, site coordination and leadership reporting stay connected from first decision to final handover.",
    image: "/visualization/systems-model.webp",
    alt: "A refined architectural systems model with structural geometry and premium finish."
  },
  {
    kicker: "Why It Matters",
    title: "Luxury delivery with enterprise control.",
    body:
      "Clients see fewer handoff gaps, clearer accountability and a more composed path through complex premium projects.",
    image: "/contact/enterprise-architecture-workspace.webp",
    alt: "A premium executive workspace designed for private consultation and project review."
  }
];

const ecosystemNodes = [
  { label: "Architecture", value: "Concept to documentation", Icon: DraftingCompass, className: "left-[8%] top-[18%]" },
  { label: "Construction", value: "Site command and delivery", Icon: HardHat, className: "right-[9%] top-[15%]" },
  { label: "Real Estate", value: "Asset strategy and positioning", Icon: Building2, className: "right-[7%] bottom-[18%]" },
  { label: "Export & Import", value: "Supplier and trade movement", Icon: Globe2, className: "left-[9%] bottom-[16%]" },
  { label: "OTC Exchange", value: "Private transaction coordination", Icon: ShieldCheck, className: "left-[38%] top-[6%]" }
];

const services = [
  {
    eyebrow: "Architecture",
    title: "Spatial strategy and design systems",
    body: "Premium concepts, plans and visualization built to move from idea to execution without losing intent.",
    href: "/architecture",
    image: "/visualization/gallery-exterior.webp",
    Icon: DraftingCompass
  },
  {
    eyebrow: "Construction",
    title: "Construction control for complex sites",
    body: "Site coordination, structural delivery and project visibility shaped for disciplined execution.",
    href: "/construction",
    image: "/visualization/presentation-standards.webp",
    Icon: HardHat
  },
  {
    eyebrow: "Real Estate",
    title: "Asset strategy and market readiness",
    body: "Development advisory, property positioning and investor-facing presentation workflows for premium assets.",
    href: "/real-estate",
    image: "/visualization/gallery-interior.webp",
    Icon: Building2
  },
  {
    eyebrow: "Export & Import",
    title: "Global sourcing and movement intelligence",
    body: "Import-export coordination connected to procurement, timelines and enterprise reporting.",
    href: "/import-export",
    image: "/visualization/gallery-lobby.webp",
    Icon: Ship
  },
  {
    eyebrow: "OTC Exchange",
    title: "Crypto & USDT Exchange",
    body: "Crypto based currency exchange, USDT services, FIU registered ISO certified partnerships and KYC verification for OTC transactions.",
    href: "/otc-exchange",
    image: "/visualization/systems-model.webp",
    Icon: ShieldCheck
  }
];

const orchestration = [
  "Brief intelligence",
  "Design alignment",
  "Procurement sync",
  "Site command",
  "Leadership reporting"
];

function Reveal({
  children,
  className,
  delay = 0,
  amount = 0.28
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  amount?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 34 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration: 0.9, delay, ease }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function AmbientBlueprint({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cn("home-v2-ambient pointer-events-none absolute inset-0", className)}>
      <div className="home-v2-paper absolute inset-0" />
      <div className="home-v2-grid absolute inset-0" />
      <div className="home-v2-light-shelf absolute inset-x-0 top-0 h-[32rem]" />
      <div className="home-v2-champagne-line absolute inset-x-0 top-0 h-px" />
    </div>
  );
}

function ArchitecturalEcosystemVisual({
  mouseX,
  mouseY,
  reduceMotion
}: {
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
  reduceMotion: boolean | null;
}) {
  const rawX = useTransform(mouseX, [-0.5, 0.5], [-16, 16]);
  const rawY = useTransform(mouseY, [-0.5, 0.5], [12, -12]);
  const rotateYRaw = useTransform(mouseX, [-0.5, 0.5], [-4, 4]);
  const rotateXRaw = useTransform(mouseY, [-0.5, 0.5], [3, -3]);
  const x = useSpring(rawX, { stiffness: 80, damping: 22, mass: 0.8 });
  const y = useSpring(rawY, { stiffness: 80, damping: 22, mass: 0.8 });
  const rotateY = useSpring(rotateYRaw, { stiffness: 70, damping: 24, mass: 0.9 });
  const rotateX = useSpring(rotateXRaw, { stiffness: 70, damping: 24, mass: 0.9 });
  const floatTransition = reduceMotion
    ? { duration: 0 }
    : { duration: 8.5, repeat: Infinity, repeatType: "mirror" as const, ease: "easeInOut" as const };

  return (
    <div className="home-v2-visual relative mx-auto min-h-[31rem] w-full max-w-[42rem] lg:min-h-[43rem]" aria-hidden="true">
      <motion.div
        className="home-v2-visual-stage absolute inset-0"
        style={reduceMotion ? undefined : { x, y, rotateX, rotateY }}
      >
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 700 680" fill="none">
          <defs>
            <linearGradient id="home-v2-line" x1="80" x2="620" y1="92" y2="592">
              <stop stopColor="#8B1118" stopOpacity="0.06" />
              <stop offset="0.5" stopColor="#C6A45B" stopOpacity="0.72" />
              <stop offset="1" stopColor="#181512" stopOpacity="0.14" />
            </linearGradient>
          </defs>
          <path d="M350 96 584 230 584 458 350 592 116 458 116 230 350 96Z" stroke="url(#home-v2-line)" strokeWidth="1" />
          <path d="M350 164 522 262 522 426 350 524 178 426 178 262 350 164Z" stroke="#9A7428" strokeOpacity="0.18" />
          <path d="M350 96v496M116 230l468 228M584 230 116 458M178 262l344 164M522 262 178 426" stroke="#9A7428" strokeOpacity="0.15" />
          <motion.path
            d="M118 458C214 408 256 350 350 340C454 328 494 266 584 230"
            stroke="#C6A45B"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeDasharray="18 18"
            animate={reduceMotion ? undefined : { strokeDashoffset: [0, -72] }}
            transition={reduceMotion ? undefined : { duration: 9, repeat: Infinity, ease: "linear" }}
          />
          <motion.path
            d="M116 230C222 246 270 296 350 340C436 386 488 432 584 458"
            stroke="#8B1118"
            strokeOpacity="0.26"
            strokeWidth="1"
            strokeLinecap="round"
            strokeDasharray="10 20"
            animate={reduceMotion ? undefined : { strokeDashoffset: [0, 60] }}
            transition={reduceMotion ? undefined : { duration: 11, repeat: Infinity, ease: "linear" }}
          />
        </svg>

        <motion.div
          className="home-v2-core-system absolute left-1/2 top-1/2"
          animate={reduceMotion ? undefined : { y: [-7, 7], rotateZ: [-0.5, 0.5] }}
          transition={floatTransition}
        >
          <div className="home-v2-core-floor home-v2-core-floor-one" />
          <div className="home-v2-core-floor home-v2-core-floor-two" />
          <div className="home-v2-core-floor home-v2-core-floor-three" />
          <div className="home-v2-tower home-v2-tower-one" />
          <div className="home-v2-tower home-v2-tower-two" />
          <div className="home-v2-tower home-v2-tower-three" />
          <div className="home-v2-command-mark">
            <Layers3 className="h-5 w-5" strokeWidth={1.5} />
            <span>Ractysh OS</span>
          </div>
        </motion.div>

        {visualNodes.map((node, index) => {
          const Icon = node.Icon;
          return (
            <motion.div
              key={node.label}
              className={cn("home-v2-visual-node absolute hidden sm:block", node.className)}
              animate={reduceMotion ? undefined : { y: index % 2 ? [5, -6] : [-6, 5] }}
              transition={
                reduceMotion
                  ? undefined
                  : { duration: 7.5 + index * 0.4, repeat: Infinity, repeatType: "mirror", ease: "easeInOut", delay: index * 0.18 }
              }
            >
              <Icon className="h-4 w-4" strokeWidth={1.6} />
              <span>{node.label}</span>
              <small>{node.detail}</small>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}

function HomeV2Hero() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const reduceMotion = useReducedMotion();

  const handlePointerMove = (event: ReactPointerEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    mouseX.set((event.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((event.clientY - rect.top) / rect.height - 0.5);
  };

  return (
    <section
      id="home-v2-hero"
      onPointerMove={handlePointerMove}
      className="home-v2-hero relative isolate min-h-[100svh] overflow-hidden bg-[#fbf7ef] px-5 text-[#181512] sm:px-8"
    >
      <AmbientBlueprint />
      <div className="relative z-10 mx-auto grid min-h-[100svh] w-full max-w-[90rem] items-center gap-12 pb-16 pt-28 lg:grid-cols-[0.92fr_1.08fr] lg:pb-20 lg:pt-[8.5rem]">
        <div className="max-w-[46rem]">
          <Reveal>
            <p className="home-v2-kicker text-[0.72rem] font-medium uppercase leading-none tracking-[0] text-[#8b1118]">
              Ractysh Enterprise Ecosystem
            </p>
          </Reveal>
          <h1 className="mt-7 font-display text-[4.15rem] font-medium leading-[0.92] tracking-[0] text-[#17120f] sm:text-[5.4rem] lg:text-[6.6rem] xl:text-[7.25rem]">
            <motion.span
              className="block"
              initial={{ opacity: 0, y: 62 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.05, ease }}
            >
              One connected
            </motion.span>
            <motion.span
              className="block text-[#6d6255]"
              initial={{ opacity: 0, y: 62 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.05, delay: 0.1, ease }}
            >
              enterprise
            </motion.span>
            <motion.span
              className="block"
              initial={{ opacity: 0, y: 62 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.05, delay: 0.2, ease }}
            >
              ecosystem.
            </motion.span>
          </h1>

          <Reveal delay={0.28}>
            <p className="mt-7 max-w-[39rem] text-[1rem] font-normal leading-[1.85] text-[#5f574d] sm:text-[1.08rem]">
              Built for Architecture, Construction, Real Estate, Trade and Private Exchange workflows, with every decision
              synchronized through a composed execution layer.
            </p>
          </Reveal>

          <Reveal delay={0.38} className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link href="/book-consultation" className="home-v2-button home-v2-button-dark group">
              Begin a Private Briefing
              <ArrowUpRight className="h-4 w-4 transition duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
            <Link href="/our-projects" className="home-v2-button home-v2-button-light group">
              Explore Our Work
              <ArrowUpRight className="h-4 w-4 transition duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </Reveal>

          <Reveal delay={0.48}>
            <div className="mt-10 grid max-w-[38rem] grid-cols-3 border-y border-[#c8ad72]/34 py-5">
              {heroMetrics.map((metric) => (
                <div key={metric.label} className="pr-4">
                  <p className="font-display text-[2.3rem] font-medium leading-none text-[#19120e] sm:text-[2.7rem]">
                    {metric.value}
                  </p>
                  <p className="mt-2 max-w-[8rem] text-[0.68rem] font-medium leading-[1.5] text-[#6f6253]/76">
                    {metric.label}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.18} amount={0.12}>
          <ArchitecturalEcosystemVisual mouseX={mouseX} mouseY={mouseY} reduceMotion={reduceMotion} />
        </Reveal>
      </div>
    </section>
  );
}

function WhoWeAreStory() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const firstOpacity = useTransform(scrollYProgress, [0, 0.28, 0.38], [1, 1, 0]);
  const secondOpacity = useTransform(scrollYProgress, [0.26, 0.43, 0.66, 0.76], [0, 1, 1, 0]);
  const thirdOpacity = useTransform(scrollYProgress, [0.62, 0.78, 1], [0, 1, 1]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.04, 1.12]);
  const textY = useTransform(scrollYProgress, [0, 1], [14, -14]);

  return (
    <section ref={sectionRef} className="relative h-[265svh] bg-[#f7f1e6] text-[#181512]">
      <div className="sticky top-0 h-[100svh] min-h-[680px] overflow-hidden">
        <AmbientBlueprint className="opacity-90" />
        <div className="relative z-10 mx-auto grid h-full max-w-[94rem] content-center gap-8 px-5 py-20 sm:px-8 lg:content-stretch lg:gap-10 lg:py-0 lg:grid-cols-[0.9fr_1.1fr]">
          <motion.div style={{ y: textY }} className="flex items-center lg:h-full lg:py-24">
            <div className="w-full max-w-[42rem]">
              <p className="home-v2-kicker text-[0.72rem] font-medium uppercase leading-none tracking-[0] text-[#8b1118]">
                Who We Are
              </p>
              <div className="relative mt-7 min-h-[21rem] sm:min-h-[23rem]">
                {storyFrames.map((frame, index) => {
                  const opacity = index === 0 ? firstOpacity : index === 1 ? secondOpacity : thirdOpacity;
                  return (
                    <motion.div key={frame.title} style={{ opacity }} className="absolute inset-0">
                      <p className="text-[0.74rem] font-medium uppercase leading-none tracking-[0] text-[#9a7428]">
                        {frame.kicker}
                      </p>
                      <h2 className="mt-5 font-display text-[2.85rem] font-medium leading-[1] tracking-[0] text-[#17120f] sm:text-[3.55rem] lg:text-[4.15rem] xl:text-[4.5rem]">
                        {frame.title}
                      </h2>
                      <p className="mt-6 max-w-[34rem] text-[0.98rem] leading-[1.85] text-[#5f574d] sm:text-[1.04rem]">
                        {frame.body}
                      </p>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>

          <div className="home-v2-story-visual relative h-[18rem] self-center overflow-hidden rounded-[0.5rem] border border-[#dfcfad]/68 bg-[#e9decb] shadow-[0_36px_110px_rgba(82,61,31,0.16)] sm:h-[23rem] lg:absolute lg:inset-y-0 lg:right-0 lg:h-[180svh] lg:min-h-[980px] lg:w-[52vw] lg:self-stretch lg:rounded-none lg:border-y-0 lg:border-r-0">
            {storyFrames.map((frame, index) => {
              const opacity = index === 0 ? firstOpacity : index === 1 ? secondOpacity : thirdOpacity;
              return (
                <motion.div key={frame.image} style={{ opacity, scale: imageScale }} className="absolute inset-0">
                  <Image src={frame.image} alt={frame.alt} fill sizes="(min-width: 1024px) 58vw, 100vw" className="object-cover" quality={80} />
                </motion.div>
              );
            })}
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(24,18,14,0.12),transparent_44%,rgba(255,252,247,0.18)),linear-gradient(180deg,rgba(255,252,247,0.14),rgba(24,18,14,0.22))]" />
            <div className="home-v2-frame-lines absolute inset-5" />
          </div>
        </div>
      </div>
    </section>
  );
}

function EnterpriseEcosystemSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="home-v2-ecosystem relative isolate overflow-hidden bg-[#fbf7ef] px-5 py-24 text-[#181512] sm:px-8 lg:py-32">
      <AmbientBlueprint />
      <div className="relative z-10 mx-auto max-w-[90rem]">
        <Reveal className="mx-auto max-w-[55rem] text-center">
          <p className="home-v2-kicker text-[0.72rem] font-medium uppercase leading-none tracking-[0] text-[#8b1118]">
            Enterprise Ecosystem
          </p>
          <h2 className="mt-5 font-display text-[3.5rem] font-medium leading-[0.96] tracking-[0] text-[#17120f] sm:text-[4.6rem] lg:text-[5.65rem]">
            The operating system for premium execution.
          </h2>
          <p className="mx-auto mt-6 max-w-[42rem] text-[1rem] leading-[1.8] text-[#62594f]">
            A lightweight visual model of how Ractysh connects strategy, design, procurement, field delivery and enterprise
            reporting into one orchestration layer.
          </p>
        </Reveal>

        <Reveal delay={0.14} className="mt-14">
          <div className="home-v2-os-stage relative mx-auto min-h-[42rem] overflow-hidden rounded-[0.5rem] border border-[#dfcfad]/72 bg-[rgba(255,252,247,0.62)] shadow-[0_34px_110px_rgba(82,61,31,0.1),inset_0_1px_0_rgba(255,255,255,0.86)]">
            <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1180 650" fill="none" aria-hidden="true">
              <defs>
                <linearGradient id="home-v2-os-line" x1="140" x2="1040" y1="110" y2="540">
                  <stop stopColor="#181512" stopOpacity="0.12" />
                  <stop offset="0.5" stopColor="#C6A45B" stopOpacity="0.8" />
                  <stop offset="1" stopColor="#8B1118" stopOpacity="0.18" />
                </linearGradient>
              </defs>
              <path d="M590 92 920 245v238L590 560 260 483V245L590 92Z" stroke="#9A7428" strokeOpacity="0.18" />
              <path d="M590 154 830 265v170L590 498 350 435V265L590 154Z" stroke="#9A7428" strokeOpacity="0.22" />
              <path d="M590 92v468M260 245l660 238M920 245 260 483M350 265l480 170M830 265 350 435" stroke="#9A7428" strokeOpacity="0.12" />
              <motion.path
                d="M222 176C345 216 442 280 590 326C750 374 836 446 964 508"
                stroke="url(#home-v2-os-line)"
                strokeWidth="1.5"
                strokeLinecap="round"
                pathLength={1}
                strokeDasharray="1"
                strokeDashoffset="0"
                animate={reduceMotion ? undefined : { pathLength: [0.22, 1, 0.22] }}
                transition={reduceMotion ? undefined : { duration: 8.2, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.path
                d="M212 503C338 432 430 356 590 326C748 296 848 220 982 146"
                stroke="#8B1118"
                strokeOpacity="0.28"
                strokeWidth="1"
                strokeLinecap="round"
                strokeDasharray="14 18"
                animate={reduceMotion ? undefined : { strokeDashoffset: [0, -96] }}
                transition={reduceMotion ? undefined : { duration: 12, repeat: Infinity, ease: "linear" }}
              />
            </svg>

            <div className="absolute left-1/2 top-1/2 w-[17rem] -translate-x-1/2 -translate-y-1/2 text-center sm:w-[22rem]">
              <div className="home-v2-os-core mx-auto flex h-[12rem] w-[12rem] flex-col items-center justify-center rounded-full border border-[#c6a45b]/42 bg-[#fffaf0]/78 text-[#181512] shadow-[0_28px_90px_rgba(90,65,32,0.16),inset_0_1px_0_rgba(255,255,255,0.9)] backdrop-blur-[10px] sm:h-[14rem] sm:w-[14rem]">
                <Workflow className="h-7 w-7 text-[#9a7428]" strokeWidth={1.5} />
                <p className="mt-4 font-display text-[2rem] font-medium leading-none sm:text-[2.55rem]">
                  Ractysh OS
                </p>
                <span className="mt-3 max-w-[9rem] text-[0.68rem] font-medium leading-[1.45] text-[#665d52]">
                  One execution layer
                </span>
              </div>
            </div>

            {ecosystemNodes.map((node, index) => {
              const Icon = node.Icon;
              return (
                <motion.div
                  key={node.label}
                  className={cn("home-v2-os-node absolute", node.className)}
                  animate={reduceMotion ? undefined : { y: index % 2 ? [6, -5] : [-5, 6] }}
                  transition={
                    reduceMotion
                      ? undefined
                      : { duration: 8 + index * 0.35, repeat: Infinity, repeatType: "mirror", ease: "easeInOut", delay: index * 0.22 }
                  }
                >
                  <Icon className="h-5 w-5 text-[#9a7428]" strokeWidth={1.55} />
                  <div>
                    <p>{node.label}</p>
                    <span>{node.value}</span>
                  </div>
                </motion.div>
              );
            })}

            <div className="absolute bottom-6 left-6 right-6 grid gap-3 md:grid-cols-3">
              {["Capital discipline", "Design clarity", "Execution rhythm"].map((label, index) => (
                <div key={label} className="border-t border-[#c6a45b]/30 pt-3">
                  <span className="text-[0.66rem] font-medium uppercase leading-none tracking-[0] text-[#8b1118]/72">0{index + 1}</span>
                  <p className="mt-2 text-[0.88rem] font-medium text-[#241b14]">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function ServicesPreviewSection() {
  return (
    <section className="relative isolate overflow-hidden bg-[#f6efe3] px-5 py-24 text-[#181512] sm:px-8 lg:py-32">
      <AmbientBlueprint className="opacity-70" />
      <div className="relative z-10 mx-auto max-w-[90rem]">
        <Reveal className="grid gap-8 lg:grid-cols-[0.78fr_1fr] lg:items-end">
          <div>
            <p className="home-v2-kicker text-[0.72rem] font-medium uppercase leading-none tracking-[0] text-[#8b1118]">
              Services Preview
            </p>
            <h2 className="mt-5 max-w-[45rem] font-display text-[3.3rem] font-medium leading-[0.98] tracking-[0] sm:text-[4.35rem] lg:text-[5rem]">
              Editorial services for built environments and enterprise movement.
            </h2>
          </div>
          <p className="max-w-[34rem] text-[1rem] leading-[1.8] text-[#62594f] lg:justify-self-end">
            Each service sits inside the same operating rhythm: refined thinking, controlled execution and a visible path
            from decision to delivery.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-5 lg:grid-cols-4">
          {services.map((service, index) => {
            const Icon = service.Icon;
            return (
              <Reveal key={service.title} delay={index * 0.05} className={index === 0 ? "lg:col-span-2" : undefined}>
                <Link href={service.href} className="home-v2-service group relative flex min-h-[29rem] overflow-hidden rounded-[0.5rem] border border-[#dfcfad]/72 bg-[#fffaf0] shadow-[0_24px_72px_rgba(82,61,31,0.09)]">
                  <Image
                    src={service.image}
                    alt={`${service.title} visual`}
                    fill
                    sizes={index === 0 ? "(min-width: 1024px) 48vw, 100vw" : "(min-width: 1024px) 24vw, 100vw"}
                    className="object-cover transition duration-700 group-hover:scale-[1.035]"
                    quality={80}
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(24,18,14,0.04)_0%,rgba(24,18,14,0.14)_43%,rgba(24,18,14,0.76)_100%)]" />
                  <div className="absolute inset-5 border border-white/18" />
                  <div className="relative z-10 mt-auto w-full p-6 text-[#fffaf0]">
                    <div className="mb-8 flex items-center justify-between">
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/28 bg-white/12 backdrop-blur-[8px]">
                        <Icon className="h-4 w-4" strokeWidth={1.6} />
                      </span>
                      <ArrowUpRight className="h-4 w-4 text-[#efd28a] transition duration-500 group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </div>
                    <p className="text-[0.66rem] font-medium uppercase leading-none tracking-[0] text-[#efd28a]">{service.eyebrow}</p>
                    <h3 className="mt-4 font-display text-[2rem] font-medium leading-[1.04] tracking-[0]">
                      {service.title}
                    </h3>
                    <p className="mt-4 max-w-[27rem] text-[0.88rem] leading-[1.72] text-white/70">{service.body}</p>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function OrchestrationSection() {
  return (
    <section className="relative isolate overflow-hidden bg-[#17120f] px-5 py-24 text-[#fffaf0] sm:px-8 lg:py-32">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,#17120f_0%,#241b14_48%,#0d0b09_100%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.16] [background-image:linear-gradient(rgba(214,180,95,0.22)_1px,transparent_1px),linear-gradient(90deg,rgba(214,180,95,0.16)_1px,transparent_1px)] [background-size:76px_76px]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(214,180,95,0.8),transparent)]" />

      <div className="relative z-10 mx-auto max-w-[86rem]">
        <Reveal className="grid gap-10 lg:grid-cols-[0.78fr_1fr] lg:items-center">
          <div>
            <p className="home-v2-kicker text-[0.72rem] font-medium uppercase leading-none tracking-[0] text-[#efd28a]">
              Luxury Timeline System
            </p>
            <h2 className="mt-5 font-display text-[3.4rem] font-medium leading-[0.98] tracking-[0] text-[#fffaf0] sm:text-[4.35rem] lg:text-[5.1rem]">
              From intent to handover, every movement is orchestrated.
            </h2>
          </div>
          <div className="grid gap-3">
            {orchestration.map((item, index) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, x: 28 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.75, delay: index * 0.06, ease }}
                className="home-v2-timeline-row"
              >
                <span>0{index + 1}</span>
                <p>{item}</p>
                <CheckCircle2 className="h-4 w-4 text-[#efd28a]" strokeWidth={1.7} />
              </motion.div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function HomeV2FinalCTA() {
  return (
    <section className="relative isolate overflow-hidden bg-[#fbf7ef] px-5 py-24 text-center text-[#181512] sm:px-8 lg:py-32">
      <AmbientBlueprint />
      <Reveal className="relative z-10 mx-auto max-w-[58rem]">
        <p className="home-v2-kicker text-[0.72rem] font-medium uppercase leading-none tracking-[0] text-[#8b1118]">
          Private Enterprise Briefing
        </p>
        <h2 className="mt-5 font-display text-[3.55rem] font-medium leading-[0.96] tracking-[0] sm:text-[4.7rem] lg:text-[5.8rem]">
          Build the next operating layer for your project.
        </h2>
        <p className="mx-auto mt-6 max-w-[38rem] text-[1rem] leading-[1.8] text-[#62594f]">
          Start with a structured conversation around Architecture, Construction, Real Estate, Trade movement or OTC Exchange.
        </p>
        <div className="mt-9 flex justify-center">
          <Link href="/book-consultation" className="home-v2-button home-v2-button-dark group">
            Book a Demo
            <ArrowUpRight className="h-4 w-4 transition duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </Reveal>
    </section>
  );
}

export function HomeV2TestingPage() {
  return (
    <div className="home-v2-page relative isolate overflow-hidden bg-[#fbf7ef] [font-family:var(--font-manrope)]">
      <HomeV2Hero />
      <WhoWeAreStory />
      <EnterpriseEcosystemSection />
      <ServicesPreviewSection />
      <OrchestrationSection />
      <HomeV2FinalCTA />
    </div>
  );
}
