"use client";

import { useEffect, useRef, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  Landmark,
  Scale,
  ShieldCheck,
  type LucideIcon
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const ease = [0.22, 1, 0.36, 1] as const;

const heroImage = "/services/otc-exchange-private-desk.webp";
const imageSizes = "(min-width: 1280px) 48vw, (min-width: 768px) 88vw, 100vw";
const heroImageSizes = "(min-width: 1280px) 52vw, (min-width: 1024px) 48vw, 100vw";

const valueSignals = ["Crypto Exchange", "USDT Services", "FIU Registered"] as const;

const operationSections: Array<{
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  label: string;
  signal: string;
  tone: "light" | "dark";
  Icon: LucideIcon;
  points: readonly [string, string, string];
}> = [
  {
    id: "crypto-currency-exchange",
    eyebrow: "Section 01",
    title: "Crypto Based Currency Exchange",
    description:
      "Secure crypto-to-fiat and crypto-to-crypto exchange services with real-time pricing, deep liquidity and institutional-grade settlement for qualified counterparties.",
    image: "/services/otc-exchange-private-desk.webp",
    imageAlt: "Crypto currency exchange desk for OTC transactions",
    label: "Crypto Exchange",
    signal: "Live",
    tone: "light",
    Icon: BriefcaseBusiness,
    points: ["Real-time pricing", "Deep liquidity", "Secure settlement"]
  },
  {
    id: "usdt-currency-exchange",
    eyebrow: "Section 02",
    title: "USDT Currency Exchange",
    description:
      "USDT-to-fiat and USDT-to-crypto exchange services with competitive rates, fast settlement and transparent transaction tracking for institutional and retail clients.",
    image: "/services/otc-exchange-verification-documents.webp",
    imageAlt: "USDT currency exchange transaction processing",
    label: "USDT Desk",
    signal: "Active",
    tone: "light",
    Icon: ShieldCheck,
    points: ["Competitive rates", "Fast settlement", "Transparent tracking"]
  },
  {
    id: "fiu-registered-partnerships",
    eyebrow: "Section 03",
    title: "FIU Registered & ISO Certified Partnerships",
    description:
      "Our company is partnered with FIU registered and ISO certified institutions, ensuring regulatory compliance, operational excellence and client trust across all OTC operations.",
    image: "/services/showcase-otc-exchange.webp",
    imageAlt: "FIU registered and ISO certified partnership documentation",
    label: "Certified",
    signal: "Compliant",
    tone: "dark",
    Icon: Landmark,
    points: ["FIU registered", "ISO certified", "Regulatory compliance"]
  },
  {
    id: "kyc-verification-otc",
    eyebrow: "Section 04",
    title: "KYC Verification for OTC",
    description:
      "Comprehensive KYC verification for OTC transactions — identity verification, document review and compliance screening for qualified counterparties before transaction processing.",
    image: "/contact/enterprise-architecture-workspace.webp",
    imageAlt: "KYC verification documents for OTC compliance",
    label: "Verification",
    signal: "Verified",
    tone: "light",
    Icon: Scale,
    points: ["Identity verification", "Document review", "Compliance screening"]
  }
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

function SectionImage({
  src,
  alt,
  label,
  signal,
  priority = false,
  className = ""
}: {
  src: string;
  alt: string;
  label: string;
  signal: string;
  priority?: boolean;
  className?: string;
}) {
  return (
    <figure
      data-scale-reveal={!priority ? true : undefined}
      className={[
        "real-estate-service-property group relative min-h-[31rem] overflow-hidden rounded-[8px] border border-[#dfcfaa] bg-[#15110d] shadow-[0_34px_120px_rgba(58,41,18,0.16)] md:min-h-[38rem]",
        className
      ].join(" ")}
    >
      <Image
        fill
        priority={priority}
        loading={priority ? undefined : "lazy"}
        sizes={priority ? heroImageSizes : imageSizes}
        src={src}
        alt={alt}
        data-property-image
        className="object-cover"
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.04)_18%,rgba(0,0,0,0.58)_100%)]" />
      <figcaption className="absolute bottom-5 left-5 right-5 text-[#fff8ec] md:bottom-7 md:left-7 md:right-7">
        <p className="text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-[#d8b765]">{label}</p>
        <div className="mt-4 flex items-center gap-3">
          <span className="h-px w-12 bg-[#d8b765]" />
          <span className="rounded-full border border-white/24 bg-white/12 px-3 py-1.5 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-white backdrop-blur-xl">
            {signal}
          </span>
        </div>
      </figcaption>
    </figure>
  );
}

export function OtcExchangeServiceExperience() {
  const rootRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const context = gsap.context(() => {
      const shouldReduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const revealItems = gsap.utils.toArray<HTMLElement>("[data-reveal]");
      const scaleItems = gsap.utils.toArray<HTMLElement>("[data-scale-reveal]");
      const imageItems = gsap.utils.toArray<HTMLElement>("[data-property-image]");
      const drawLines = gsap.utils.toArray<SVGPathElement>("[data-re-draw-line]");

      if (shouldReduce) {
        gsap.set([...revealItems, ...scaleItems, ...imageItems, ...drawLines], { clearProps: "all" });
        return;
      }

      gsap.to("[data-re-grid]", {
        x: 72,
        y: 72,
        duration: 34,
        repeat: -1,
        ease: "none"
      });

      gsap.fromTo(
        "[data-hero-line]",
        { opacity: 0, yPercent: 112, rotateX: -10, transformOrigin: "50% 100%" },
        {
          opacity: 1,
          yPercent: 0,
          rotateX: 0,
          duration: 1.15,
          ease: "power4.out",
          stagger: 0.11,
          delay: 0.08
        }
      );

      revealItems.forEach((element, index) => {
        gsap.fromTo(
          element,
          { autoAlpha: 0, y: 48 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.95,
            delay: Math.min((index % 5) * 0.04, 0.16),
            ease: "power3.out",
            scrollTrigger: {
              trigger: element,
              start: "top 84%"
            }
          }
        );
      });

      scaleItems.forEach((element) => {
        gsap.fromTo(
          element,
          { autoAlpha: 0, y: 54, scale: 0.965, clipPath: "inset(8% 8% 8% 8%)" },
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1.08,
            ease: "power3.out",
            scrollTrigger: {
              trigger: element,
              start: "top 82%"
            }
          }
        );
      });

      imageItems.forEach((image) => {
        gsap.to(image, {
          yPercent: -7,
          scale: 1.08,
          ease: "none",
          scrollTrigger: {
            trigger: image,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.8
          }
        });
      });

      drawLines.forEach((line, index) => {
        const length = line.getTotalLength();
        gsap.fromTo(
          line,
          { strokeDasharray: length, strokeDashoffset: length, opacity: 0 },
          {
            strokeDashoffset: 0,
            opacity: 1,
            duration: 1.45,
            delay: index * 0.04,
            ease: "power3.out",
            scrollTrigger: {
              trigger: line.closest("section") ?? root,
              start: "top 76%"
            }
          }
        );
      });
    }, root);

    const refreshId = window.requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      window.cancelAnimationFrame(refreshId);
      context.revert();
    };
  }, [reduceMotion]);

  return (
    <article ref={rootRef} className="real-estate-service-page otc-exchange-operations-page relative isolate overflow-hidden bg-[#fffaf0] text-[#15110d]">
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden opacity-[0.28]" aria-hidden>
        <div data-re-grid className="absolute inset-[-10%] [background-image:linear-gradient(rgba(72,55,30,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(72,55,30,0.05)_1px,transparent_1px)] [background-size:96px_96px]" />
      </div>

      <section className="relative z-10 flex min-h-[100svh] items-center px-5 pb-14 pt-24 sm:px-6 md:px-8 lg:pb-20 lg:pt-36 xl:px-12">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_82%_16%,rgba(197,155,86,0.18),transparent_32rem),linear-gradient(180deg,#fffdf8,#f6ecdc)]" />
        <ExchangeBlueprint className="opacity-35" />

        <div className="relative mx-auto flex w-full max-w-[1480px] flex-col gap-7 md:gap-10 lg:grid lg:flex-row lg:grid-cols-[0.88fr_1.12fr] lg:items-center xl:gap-16">
          <div className="order-1 max-w-[46rem] lg:order-none">
            <motion.p
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease }}
              className="flex items-center gap-4 text-[0.72rem] font-semibold uppercase tracking-[0.3em] text-[#8b1118]"
            >
              <span className="h-px w-12 bg-[#b88a44]" />
              RACTYSH OTC EXCHANGE
            </motion.p>

            <h1
              aria-label="OTC Exchange Operations"
              className="mt-7 max-w-[52rem] font-display text-[clamp(3.05rem,5.7vw,6.15rem)] font-semibold leading-[0.92] tracking-[0] text-[#111111]"
            >
              <span className="block overflow-hidden pb-1">
                <span data-hero-line className="block">OTC Exchange</span>
              </span>
              <span className="block overflow-hidden pb-2">
                <span data-hero-line className="block text-[#8B1118]">Operations</span>
              </span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.35, ease }}
              className="mt-7 max-w-[38rem] text-[1rem] font-medium leading-8 text-[#5d5348] md:text-[1.08rem]"
            >
               Crypto based currency exchange, USDT exchange services, FIU registered ISO certified partnerships and KYC verification for OTC transactions.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.48, ease }}
              className="mt-9 flex flex-col gap-3 sm:flex-row"
            >
              <ButtonLink href="/book-consultation">Book Consultation</ButtonLink>
              <ButtonLink href="/contact" variant="light">Contact Service Desk</ButtonLink>
              <ButtonLink href="#" variant="light">For More Details, Check This</ButtonLink>
            </motion.div>

            <div data-reveal className="mt-12 hidden max-w-[39rem] grid-cols-3 border-y border-[#d8c59d]/62 py-5 md:grid">
              {valueSignals.map((item) => (
                <div key={item} className="border-r border-[#d8c59d]/52 px-4 first:pl-0 last:border-r-0 last:pr-0">
                  <p className="text-[0.58rem] font-semibold uppercase tracking-[0.18em] text-[#8b1118]/70">OTC Exchange</p>
                  <p className="mt-2 font-display text-[1.35rem] font-semibold leading-none tracking-[0] text-[#211812]">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 34, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.05, delay: 0.18, ease }}
            className="relative order-2 -mx-3 -mb-6 w-full self-center lg:order-none lg:mx-0 lg:mb-0"
          >
            <SectionImage
              src={heroImage}
              alt="Executive boardroom overlooking a financial district for private OTC exchange operations"
              label="Private Banking Atmosphere"
              signal="Institutional"
              priority
              className="min-h-[30rem] sm:min-h-[34rem] md:min-h-[46rem] lg:min-h-[52rem]"
            />
          </motion.div>
        </div>
      </section>

      {operationSections.map((section, index) => {
        const Icon = section.Icon;
        const isDark = section.tone === "dark";
        const imageFirst = index % 2 === 0;

        return (
          <section
            key={section.id}
            id={section.id}
            className={[
              "relative z-10 overflow-hidden px-5 py-20 sm:px-6 md:px-8 lg:py-32 xl:px-12",
              isDark ? "bg-[#110d0b] text-[#fff8ec]" : "bg-[#fffaf0] text-[#15110d]"
            ].join(" ")}
          >
            <div
              className={[
                "pointer-events-none absolute inset-0",
                isDark
                  ? "bg-[radial-gradient(circle_at_18%_22%,rgba(216,183,101,0.18),transparent_28rem),radial-gradient(circle_at_88%_66%,rgba(139,17,24,0.2),transparent_30rem),linear-gradient(180deg,#15100d,#0d0a08)]"
                  : "bg-[radial-gradient(circle_at_84%_18%,rgba(197,155,86,0.16),transparent_28rem),linear-gradient(180deg,#fffdf8,#f6ead8)]"
              ].join(" ")}
            />
            <ExchangeBlueprint className={isDark ? "opacity-20" : "opacity-28"} dark={isDark} />

            <div
              className={[
                "relative mx-auto grid max-w-[1420px] gap-10 lg:grid-cols-[minmax(0,0.58fr)_minmax(23rem,0.42fr)] lg:items-center xl:gap-16",
                !imageFirst ? "lg:grid-cols-[minmax(23rem,0.42fr)_minmax(0,0.58fr)]" : ""
              ].join(" ")}
            >
              <div className={!imageFirst ? "lg:order-2" : ""}>
                <SectionImage src={section.image} alt={section.imageAlt} label={section.label} signal={section.signal} />
              </div>

              <div data-reveal className={["max-w-[43rem]", !imageFirst ? "lg:order-1" : ""].join(" ")}>
                <p
                  className={[
                    "flex items-center gap-4 text-[0.7rem] font-semibold uppercase tracking-[0.26em]",
                    isDark ? "text-[#d8b765]" : "text-[#8b1118]"
                  ].join(" ")}
                >
                  <span className={["h-px w-10", isDark ? "bg-[#d8b765]" : "bg-[#b88a44]"].join(" ")} />
                  {section.eyebrow}
                </p>

                <h2
                  className={[
                    "mt-5 font-display text-[clamp(2.85rem,5.3vw,6.4rem)] font-semibold leading-[0.88] tracking-[0]",
                    isDark ? "text-[#fff8ec]" : "text-[#15110d]"
                  ].join(" ")}
                >
                  {section.title}
                </h2>

                <p className={["mt-7 max-w-[35rem] text-[1rem] font-medium leading-8 md:text-[1.08rem]", isDark ? "text-[#fff8ec]/72" : "text-[#62594f]"].join(" ")}>
                  {section.description}
                </p>

                <div className={["mt-10 grid gap-3 border-y py-5 sm:grid-cols-3", isDark ? "border-[#d8b765]/24" : "border-[#d8c59d]/62"].join(" ")}>
                  {section.points.map((point) => (
                    <div key={point} className={["flex items-center gap-3 sm:border-r sm:px-3 sm:first:pl-0 sm:last:border-r-0", isDark ? "border-[#d8b765]/18" : "border-[#d8c59d]/52"].join(" ")}>
                      <CheckCircle2 className={["h-4 w-4 shrink-0", isDark ? "text-[#d8b765]" : "text-[#9d742a]"].join(" ")} strokeWidth={1.7} />
                      <span className={["text-[0.66rem] font-semibold uppercase tracking-[0.16em]", isDark ? "text-[#fff8ec]/72" : "text-[#6a5d50]"].join(" ")}>
                        {point}
                      </span>
                    </div>
                  ))}
                </div>

                <div
                  className={[
                    "mt-10 flex w-fit items-center gap-4 rounded-[8px] border px-4 py-3",
                    isDark ? "border-[#d8b765]/26 bg-white/[0.06] text-[#d8b765]" : "border-[#dfcfaa] bg-white/76 text-[#8b1118] shadow-[0_18px_54px_rgba(58,41,18,0.08)]"
                  ].join(" ")}
                >
                  <Icon className="h-5 w-5" strokeWidth={1.7} />
                  <span className="text-[0.68rem] font-semibold uppercase tracking-[0.18em]">{section.label}</span>
                </div>

                {section.id === "governance-compliance" ? (
                  <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                    <ButtonLink href="/book-consultation">Book Consultation</ButtonLink>
                    <ButtonLink href="/contact" variant="light">Contact Service Desk</ButtonLink>
                    <ButtonLink href="#" variant="light">For More Details, Check This</ButtonLink>
                  </div>
                ) : null}
              </div>
            </div>
          </section>
        );
      })}
    </article>
  );
}

function ExchangeBlueprint({ className = "", dark = false }: { className?: string; dark?: boolean }) {
  return (
    <svg
      className={`pointer-events-none absolute inset-0 z-0 ${className}`}
      viewBox="0 0 1200 760"
      preserveAspectRatio="none"
      aria-hidden
    >
      <g fill="none" stroke={dark ? "rgba(216,183,101,0.44)" : "rgba(184,138,68,0.34)"} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.1">
        <path data-re-draw-line d="M92 612 H1108" />
        <path data-re-draw-line d="M172 212 H1018" />
        <path data-re-draw-line d="M214 310 H958" />
        <path data-re-draw-line d="M256 408 H884" />
        <path data-re-draw-line d="M318 506 H792" />
        <path data-re-draw-line d="M214 212 V612" />
        <path data-re-draw-line d="M442 212 V612" />
        <path data-re-draw-line d="M670 212 V612" />
        <path data-re-draw-line d="M898 212 V612" />
        <path data-re-draw-line d="M172 612 C318 472 484 386 670 354 C812 330 928 274 1018 212" />
      </g>
    </svg>
  );
}
