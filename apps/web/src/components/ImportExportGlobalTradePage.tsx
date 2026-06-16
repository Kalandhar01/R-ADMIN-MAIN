"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowRight,
  BadgeCheck,
  Globe2,
  Network,
  Workflow,
  type LucideIcon
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const TradeGlobeScene = dynamic(() => import("@/components/ImportExportGlobeScene"), {
  ssr: false,
  loading: () => <GlobeFallback />
});

const ease = [0.22, 1, 0.36, 1] as const;

interface ShowcasePanel {
  title: string;
  kicker: string;
  body: string;
  image: string;
  alt: string;
  align: "left" | "right";
  objectPosition: string;
}

interface EcosystemBlock {
  id: string;
  title: string;
  body: string;
  image: string;
  alt: string;
  detailImage: string;
  detailAlt: string;
  className: string;
}

interface AdvantageStory {
  title: string;
  kicker: string;
  body: string;
  image: string;
  alt: string;
  Icon: LucideIcon;
}

const tradeImage = (photoId: string) => `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=3000&q=95`;

const showcasePanels: ShowcasePanel[] = [
  {
    title: "Global Sourcing",
    kicker: "Section 01 / Global Trade Showcase",
    body: "Supplier discovery, category fit and origin readiness are staged as one international sourcing path.",
    image: tradeImage("photo-1758518727613-00192aed759b"),
    alt: "Enterprise team reviewing supplier market documents",
    align: "left",
    objectPosition: "50% 48%"
  },
  {
    title: "Import Operations",
    kicker: "Shipment Release and Terminal Control",
    body: "Inbound goods, release windows and documentation checkpoints are prepared before shipments reach critical decision points.",
    image: tradeImage("photo-1774929104680-bf61cc6f845d"),
    alt: "Container crane unloading shipments at an international terminal",
    align: "right",
    objectPosition: "50% 50%"
  },
  {
    title: "Export Operations",
    kicker: "Shipping Lanes and Dispatch Readiness",
    body: "Origin dispatch, buyer updates and vessel-side coordination stay visible across each global lane.",
    image: tradeImage("photo-1765206257996-9b4a5d886a2c"),
    alt: "Container ships and cranes operating along a global shipping corridor",
    align: "left",
    objectPosition: "50% 50%"
  },
  {
    title: "Cross-Border Commerce",
    kicker: "Market Access and Destination Handoffs",
    body: "Commercial goods move through supplier readiness, documentation and destination handoffs with executive visibility.",
    image: tradeImage("photo-1769355104335-acef3aa4c9b6"),
    alt: "Commercial goods arranged for cross-border commerce handoff",
    align: "right",
    objectPosition: "50% 50%"
  }
];

const ecosystemBlocks: EcosystemBlock[] = [
  {
    id: "global-sourcing",
    title: "Global Sourcing",
    body: "Supplier discovery, product qualification and origin-side readiness aligned before commercial commitments move.",
    image: tradeImage("photo-1758611972678-bc3b29b4718f"),
    alt: "Enterprise colleagues reviewing supplier market documents",
    detailImage: tradeImage("photo-1565966245341-5a3f55bbf545"),
    detailAlt: "Organized inventory for supplier market planning",
    className: "md:col-span-2 lg:col-span-6 lg:row-span-2"
  },
  {
    id: "import-operations",
    title: "Import Operations",
    body: "Inbound shipment release, customs readiness and receiving windows sequenced before bottlenecks form.",
    image: tradeImage("photo-1773952984178-f91248ce704f"),
    alt: "Container vessel berthed at a terminal for import operations",
    detailImage: tradeImage("photo-1774929103406-59c8882a9954"),
    detailAlt: "Container vessels and shipping containers at a working port",
    className: "md:col-span-1 lg:col-span-6"
  },
  {
    id: "export-operations",
    title: "Export Operations",
    body: "Global shipping support prepared around origin dispatch, freight bookings and buyer-side delivery signals.",
    image: tradeImage("photo-1770710000993-6a75881ec618"),
    alt: "Loaded container vessel prepared for export shipping support",
    detailImage: tradeImage("photo-1773596952711-25da086477db"),
    detailAlt: "Large container ships docked at a busy export terminal",
    className: "md:col-span-1 lg:col-span-6"
  },
  {
    id: "supplier-network",
    title: "Supplier Network",
    body: "Vendor commitments, readiness signals and operating updates kept in sync across every handoff.",
    image: tradeImage("photo-1758519288948-e3c87d2d78d8"),
    alt: "Enterprise supplier meeting with executives reviewing market options",
    detailImage: tradeImage("photo-1758691737212-3eebbc8f84ed"),
    detailAlt: "Supplier team coordinating documents in a modern enterprise workspace",
    className: "md:col-span-1 lg:col-span-4"
  },
  {
    id: "trade-documentation",
    title: "Trade Documentation",
    body: "Compliance records, commercial paperwork and shipment documentation paired with live trade milestones.",
    image: tradeImage("photo-1758876020343-c8c2add9d527"),
    alt: "Trade documentation review at an enterprise compliance desk",
    detailImage: tradeImage("photo-1693620714112-a79a7d27308b"),
    detailAlt: "International travel and identity documents arranged for compliance review",
    className: "md:col-span-1 lg:col-span-4"
  },
  {
    id: "market-access",
    title: "Market Access",
    body: "Destination readiness, route context, buyer expectations and handoff decisions connected for cross-border commerce.",
    image: tradeImage("photo-1759272548470-d0686d071036"),
    alt: "International commerce terminal prepared for market access support",
    detailImage: tradeImage("photo-1721937127582-ed331de95a04"),
    detailAlt: "Warehouse aisle prepared for cross-border commerce support",
    className: "md:col-span-2 lg:col-span-4"
  }
];

const advantageStories: AdvantageStory[] = [
  {
    title: "Global Reach",
    kicker: "Network Access",
    body: "Ractysh structures trade movement across supplier markets, gateway ports and destination corridors so enterprise teams can source beyond local limits without losing operating control.",
    image: tradeImage("photo-1670121180583-39ab653a071c"),
    alt: "Ocean freight vessel moving through an international trade lane",
    Icon: Network
  },
  {
    title: "Operational Precision",
    kicker: "Execution Discipline",
    body: "Documentation, supplier readiness, import release and export handoffs are treated as one sequence, reducing ambiguity across the moments where international commerce usually fragments.",
    image: tradeImage("photo-1654630023059-1517b0c836bc"),
    alt: "Commercial cargo arranged for precise trade control",
    Icon: Workflow
  },
  {
    title: "Trusted Partnerships",
    kicker: "Relationship Control",
    body: "Supplier and buyer conversations stay anchored to clear responsibility, documentation maturity and milestone visibility, giving executive stakeholders a composed operating layer.",
    image: tradeImage("photo-1556761175-b413da4baf72"),
    alt: "Executive partnership discussion for trusted commerce",
    Icon: BadgeCheck
  }
];

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function ImportExportGlobalTradePage() {
  const rootRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduceMotion =
      Boolean(prefersReducedMotion) || window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const context = gsap.context(() => {
      const revealItems = gsap.utils.toArray<HTMLElement>("[data-trade-reveal]");
      const heroItems = gsap.utils.toArray<HTMLElement>("[data-hero-reveal]");
      const imageRevealItems = gsap.utils.toArray<HTMLElement>("[data-image-reveal]");
      const parallaxImages = gsap.utils.toArray<HTMLElement>("[data-parallax-image]");
      const rules = gsap.utils.toArray<HTMLElement>("[data-advantage-rule]");

      if (reduceMotion) {
        gsap.set([...heroItems, ...revealItems, ...imageRevealItems, "[data-hero-globe]"], {
          clearProps: "all",
          opacity: 1,
          y: 0,
          x: 0
        });
        return;
      }

      gsap
        .timeline({ defaults: { ease: "power4.out" } })
        .fromTo(
          heroItems,
          { opacity: 0, y: 34 },
          { opacity: 1, y: 0, duration: 0.86, stagger: 0.08 }
        )
        .fromTo(
          "[data-hero-globe]",
          { opacity: 0, x: 34, scale: 0.985 },
          { opacity: 1, x: 0, scale: 1, duration: 1.05 },
          "-=0.62"
        );

      revealItems.forEach((item, index) => {
        gsap.fromTo(
          item,
          { opacity: 0, y: 42 },
          {
            opacity: 1,
            y: 0,
            duration: 0.88,
            delay: Math.min(index * 0.018, 0.16),
            ease: "power3.out",
            scrollTrigger: {
              trigger: item,
              start: "top 84%",
              once: true
            }
          }
        );
      });

      imageRevealItems.forEach((item) => {
        gsap.fromTo(
          item,
          { clipPath: "inset(14% 0% 14% 0%)", scale: 1.045, opacity: 0.72 },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            scale: 1,
            opacity: 1,
            duration: 1.25,
            ease: "power3.out",
            scrollTrigger: {
              trigger: item,
              start: "top 78%",
              once: true
            }
          }
        );
      });

      parallaxImages.forEach((image) => {
        const panel = image.closest<HTMLElement>("[data-parallax-panel]") ?? image;

        gsap.fromTo(
          image,
          { yPercent: -5, scale: 1.08 },
          {
            yPercent: 5,
            scale: 1.08,
            ease: "none",
            scrollTrigger: {
              trigger: panel,
              start: "top bottom",
              end: "bottom top",
              scrub: true
            }
          }
        );
      });

      rules.forEach((rule) => {
        gsap.fromTo(
          rule,
          { scaleX: 0, transformOrigin: "0% 50%" },
          {
            scaleX: 1,
            duration: 1.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: rule,
              start: "top 86%",
              once: true
            }
          }
        );
      });
    }, root);

    const refreshFrame = window.requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      window.cancelAnimationFrame(refreshFrame);
      context.revert();
    };
  }, [prefersReducedMotion]);

  return (
    <article
      ref={rootRef}
      className="trade-commerce-page relative isolate overflow-hidden bg-[#fffdf8] text-[#17120f]"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#fffdf8_0%,#fbf4e8_38%,#f4e7d2_68%,#fffaf0_100%)]" />
        <div className="trade-grid-field absolute inset-0" />
        <div className="trade-topline absolute left-0 right-0 top-[8.5rem] h-px" />
      </div>

      <HeroSection />
      <GlobalTradeShowcaseSection />
      <TradeEcosystemSection />
      <EnterpriseAdvantageSection />
      <ContactCtaSection />

      <style>{`
        .trade-commerce-page {
          --trade-ivory: #fffdf8;
          --trade-champagne: #fff6e6;
          --trade-gold: #c6a45b;
          --trade-gold-strong: #d8b56d;
          --trade-burgundy: #8b1118;
          --trade-ink: #17120f;
          --trade-muted: #675b4d;
          font-family: var(--ractysh-body-font);
          font-size: 16px;
          line-height: 1.56;
          letter-spacing: 0;
          text-rendering: optimizeLegibility;
          -webkit-font-smoothing: antialiased;
          font-optical-sizing: auto;
        }

        .trade-commerce-page *,
        .trade-commerce-page *::before,
        .trade-commerce-page *::after {
          letter-spacing: 0 !important;
        }

        .trade-commerce-page :is(h1, h2, h3, .trade-display) {
          font-family: var(--ractysh-heading-font) !important;
          font-feature-settings: "kern" 1, "liga" 1;
          font-weight: 600;
          letter-spacing: 0 !important;
          text-wrap: balance;
        }

        .trade-commerce-page .trade-hero-title,
        .trade-commerce-page .trade-hero-title span {
          font-family: var(--ractysh-heading-font) !important;
          font-weight: 700 !important;
          letter-spacing: -0.04em !important;
          line-height: 0.9 !important;
          text-rendering: optimizeLegibility;
        }

        .trade-display {
          line-height: 0.9;
        }

        .trade-copy {
          font-family: var(--ractysh-body-font);
          font-size: 1rem;
          font-weight: 500;
          line-height: 1.78;
          text-wrap: pretty;
        }

        .trade-grid-field {
          opacity: 0.42;
          background-image:
            linear-gradient(90deg, rgba(198, 164, 91, 0.09) 1px, transparent 1px),
            linear-gradient(rgba(198, 164, 91, 0.07) 1px, transparent 1px),
            linear-gradient(135deg, rgba(139, 17, 24, 0.05), transparent 36%, rgba(198, 164, 91, 0.08) 74%, transparent);
          background-size: 92px 92px, 92px 92px, 100% 100%;
          mask-image: linear-gradient(180deg, rgba(0,0,0,0.92), rgba(0,0,0,0.62) 58%, transparent 100%);
        }

        .trade-topline {
          background: linear-gradient(90deg, transparent, rgba(198, 164, 91, 0.42), rgba(139, 17, 24, 0.18), transparent);
        }

        .trade-button {
          position: relative;
          isolation: isolate;
          overflow: hidden;
          transition:
            transform 360ms cubic-bezier(0.22, 1, 0.36, 1),
            box-shadow 360ms cubic-bezier(0.22, 1, 0.36, 1),
            border-color 360ms cubic-bezier(0.22, 1, 0.36, 1),
            background 360ms cubic-bezier(0.22, 1, 0.36, 1);
        }

        .trade-button::before {
          content: "";
          position: absolute;
          inset: 0;
          z-index: -1;
          transform: translateX(-115%);
          background: linear-gradient(110deg, transparent 0%, rgba(255, 255, 255, 0.48) 46%, transparent 74%);
          transition: transform 760ms cubic-bezier(0.22, 1, 0.36, 1);
        }

        .trade-button:hover {
          transform: translate3d(0, -3px, 0);
        }

        .trade-button:hover::before {
          transform: translateX(115%);
        }

        .trade-hero-corridor {
          background:
            linear-gradient(90deg, rgba(198, 164, 91, 0.22), transparent 34%, rgba(139, 17, 24, 0.08) 72%, transparent),
            repeating-linear-gradient(90deg, rgba(198, 164, 91, 0.16) 0 1px, transparent 1px 92px);
        }

        .trade-globe-field::before,
        .trade-globe-field::after {
          content: "";
          position: absolute;
          inset: 12% 6%;
          border: 1px solid rgba(198, 164, 91, 0.2);
          transform: rotate(-9deg);
        }

        .trade-globe-field::after {
          inset: 18% 12%;
          border-color: rgba(139, 17, 24, 0.16);
          transform: rotate(11deg);
        }

        .trade-section-kicker {
          color: var(--trade-burgundy);
          font-size: 0.72rem;
          font-weight: 700;
          line-height: 1.2;
          text-transform: uppercase;
        }

        .trade-editorial-heading {
          color: var(--trade-ink);
          font-size: 2.8rem;
          font-weight: 600;
          line-height: 0.92;
          max-width: 12ch;
        }

        .trade-full-panel {
          min-height: 78svh;
          background: #17120f;
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.18), inset 0 -1px 0 rgba(216,181,109,0.22);
        }

        .trade-full-panel::after {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          border-top: 1px solid rgba(216, 181, 109, 0.28);
          border-bottom: 1px solid rgba(216, 181, 109, 0.28);
        }

        .trade-full-panel .trade-display,
        .trade-layout-block .trade-display {
          text-shadow: 0 8px 34px rgba(0, 0, 0, 0.48);
        }

        .trade-panel-image {
          transform-origin: center;
          will-change: transform;
        }

        .trade-layout-block {
          min-height: 18rem;
          border-radius: 8px;
          background:
            linear-gradient(145deg, rgba(255, 246, 230, 0.1), rgba(255, 246, 230, 0.02)),
            #17120f;
          box-shadow:
            0 30px 90px rgba(71, 53, 24, 0.16),
            inset 0 1px 0 rgba(255, 255, 255, 0.16);
          transform: translateZ(0);
          transition:
            transform 520ms cubic-bezier(0.22, 1, 0.36, 1),
            border-color 520ms cubic-bezier(0.22, 1, 0.36, 1),
            box-shadow 520ms cubic-bezier(0.22, 1, 0.36, 1);
        }

        .trade-layout-block::before {
          content: "";
          position: absolute;
          inset: 0;
          z-index: 2;
          background:
            linear-gradient(180deg, rgba(6,7,10,0.12) 0%, rgba(6,7,10,0.42) 42%, rgba(6,7,10,0.88) 100%),
            linear-gradient(115deg, rgba(139,17,24,0.54), transparent 42%, rgba(216,181,109,0.2));
          transition: opacity 520ms cubic-bezier(0.22, 1, 0.36, 1);
        }

        .trade-layout-block::after {
          content: "";
          position: absolute;
          inset: 0;
          z-index: 4;
          pointer-events: none;
          border-radius: inherit;
          padding: 1px;
          background: linear-gradient(135deg, rgba(255,246,230,0.34), rgba(216,181,109,0.08) 32%, rgba(139,17,24,0.34) 62%, rgba(255,246,230,0.18));
          opacity: 0.56;
          -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          transition: opacity 520ms cubic-bezier(0.22, 1, 0.36, 1);
        }

        .trade-layout-block.is-featured::before {
          background:
            linear-gradient(180deg, rgba(6,7,10,0.06) 0%, rgba(6,7,10,0.34) 34%, rgba(6,7,10,0.86) 100%),
            radial-gradient(circle at 78% 18%, rgba(216,181,109,0.28), transparent 24rem),
            linear-gradient(115deg, rgba(139,17,24,0.56), transparent 46%, rgba(216,181,109,0.22));
        }

        .trade-layout-block img {
          transition: transform 900ms cubic-bezier(0.22, 1, 0.36, 1), filter 700ms cubic-bezier(0.22, 1, 0.36, 1);
        }

        .trade-layout-block:hover,
        .trade-layout-block:focus-visible {
          transform: translate3d(0, -7px, 0);
          border-color: rgba(216, 181, 109, 0.54);
          box-shadow:
            0 44px 120px rgba(71, 53, 24, 0.24),
            0 0 0 1px rgba(216, 181, 109, 0.14),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
        }

        .trade-layout-block:hover img,
        .trade-layout-block:focus-visible img {
          transform: scale(1.075);
          filter: saturate(1.12) contrast(1.08);
        }

        .trade-layout-block:hover::before,
        .trade-layout-block:focus-visible::before {
          opacity: 0.9;
        }

        .trade-layout-block:hover::after,
        .trade-layout-block:focus-visible::after {
          opacity: 0.95;
        }

        .trade-layout-modal {
          border-radius: 8px;
          box-shadow: 0 42px 130px rgba(0, 0, 0, 0.34);
        }

        @media (max-width: 767px) {
          .trade-commerce-page section {
            padding-left: 1.25rem !important;
            padding-right: 1.25rem !important;
          }

          .trade-commerce-page section:not(:first-of-type) {
            padding-top: 3.5rem !important;
            padding-bottom: 3.5rem !important;
          }

          .trade-commerce-page .trade-section-kicker {
            font-size: 0.68rem;
            line-height: 1.25;
          }

          .trade-commerce-page .trade-editorial-heading {
            max-width: 14ch;
            font-size: 2.35rem !important;
            line-height: 1.04 !important;
          }

          .trade-commerce-page .trade-copy {
            max-width: 32rem;
            font-size: 0.95rem;
            line-height: 1.72;
          }

          .trade-commerce-page .trade-globe-field {
            height: min(108vw, 26.5rem);
            max-width: min(100%, 26.5rem);
          }

          .trade-commerce-page .trade-full-panel {
            min-height: auto;
          }

          .trade-commerce-page .trade-full-panel > .relative {
            min-height: min(72svh, 34rem) !important;
            padding-top: 2.25rem !important;
            padding-bottom: 2.25rem !important;
          }

          .trade-commerce-page .trade-full-panel h3.trade-display {
            font-size: 2.75rem !important;
            line-height: 0.94 !important;
          }

          .trade-commerce-page [data-parallax-image],
          .trade-commerce-page .trade-layout-block img {
            max-width: 100% !important;
            transform: none !important;
          }

          .trade-commerce-page .trade-bento-grid {
            margin-top: 2.25rem !important;
            gap: 1rem !important;
            grid-auto-rows: minmax(16.25rem, auto) !important;
          }

          .trade-commerce-page .trade-layout-block {
            min-height: 16.25rem;
          }

          .trade-commerce-page .trade-layout-block.is-featured {
            min-height: 17.5rem;
          }

          .trade-commerce-page .trade-layout-block > .relative {
            padding: 1.35rem !important;
          }

          .trade-commerce-page .trade-layout-block h3.trade-display {
            max-width: 12ch;
            font-size: 2.16rem !important;
            line-height: 0.96 !important;
          }

          .trade-commerce-page .trade-layout-block.is-featured h3.trade-display {
            font-size: 2.42rem !important;
          }

          .trade-commerce-page .trade-layout-block p {
            font-size: 0.92rem !important;
            line-height: 1.64 !important;
          }

          .trade-commerce-page .trade-layout-block .inline-flex {
            max-width: 100%;
          }

          .trade-commerce-page article[data-parallax-panel] {
            gap: 1.6rem !important;
            padding-top: 2rem !important;
            padding-bottom: 2rem !important;
          }

          .trade-commerce-page article[data-parallax-panel] [data-image-reveal] {
            min-height: 18rem !important;
          }

          .trade-commerce-page article[data-parallax-panel] h3.trade-display,
          .trade-commerce-page section:last-of-type h2.trade-display {
            font-size: 2.5rem !important;
            line-height: 1 !important;
          }
        }

        @media (max-width: 1023px) {
          .trade-globe-field {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            max-width: min(100%, 36rem);
            margin-left: auto;
            margin-right: auto;
            overflow: visible;
            transform: translateX(0);
          }

          .trade-globe-field > canvas {
            left: 50%;
            right: auto;
            margin-left: auto;
            margin-right: auto;
            transform: translateX(-50%);
          }
        }

        @media (min-width: 640px) {
          .trade-editorial-heading {
            font-size: 4.15rem;
          }
        }

        @media (min-width: 768px) {
          .trade-copy {
            font-size: 1.08rem;
          }
        }

        @media (min-width: 1024px) {
          .trade-full-panel {
            min-height: 88svh;
          }

          .trade-editorial-heading {
            font-size: 5.65rem;
          }
        }

        @media (min-width: 1280px) {
          .trade-editorial-heading {
            font-size: 6.15rem;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .trade-button,
          .trade-button::before,
          .trade-layout-block,
          .trade-layout-block img {
            transition: none !important;
          }
        }
      `}</style>
    </article>
  );
}

function HeroSection() {
  return (
    <section className="relative z-10 min-h-[100svh] px-5 pb-16 pt-28 sm:px-6 md:px-8 lg:flex lg:items-center lg:pt-24 xl:px-10">
      <div className="mx-auto grid w-full max-w-[1420px] gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(32rem,1.1fr)] lg:items-center xl:gap-16">
        <div className="relative z-20 max-w-[47rem]">
          <p data-hero-reveal className="text-[0.72rem] font-bold uppercase tracking-[0.24em] text-[#8b1118]">
            RACTYSH GLOBAL TRADE
          </p>

          <h1
            aria-label="Global Commerce. Connected Without Borders."
            data-hero-reveal
            className="trade-hero-title mt-7 max-w-[52rem] font-display text-[clamp(3.1rem,5.8vw,6.35rem)] font-bold leading-[0.9] tracking-[-0.04em] text-[#17120f]"
          >
            <span className="block">Global Commerce.</span>
            <span className="block text-[#8B1118]">Connected Without Borders.</span>
          </h1>

          <p data-hero-reveal className="trade-copy mt-7 max-w-[39rem] text-[clamp(1rem,1.1vw,1.12rem)] font-medium leading-[1.9] text-[#51463c]">
            Cross-border sourcing, import operations, export operations and trade documentation through one enterprise ecosystem.
          </p>

          <div data-hero-reveal className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link
              href="/book-consultation"
              className="trade-button inline-flex min-h-12 items-center justify-center gap-3 rounded-[8px] border border-[#8B1118] bg-[#8B1118] px-6 py-3 text-[0.78rem] font-bold uppercase tracking-[0] text-[#fffaf0] shadow-[0_20px_56px_rgba(139,17,24,0.2)] transition duration-300 hover:bg-[#741016] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#c6a45b]"
            >
              <span className="relative z-10">Book Consultation</span>
              <ArrowRight className="relative z-10 h-4 w-4" strokeWidth={2.1} />
            </Link>
            <Link
              href="/contact"
              className="trade-button inline-flex min-h-12 items-center justify-center gap-3 rounded-[8px] border border-[#C9A45C]/58 bg-[#fffaf0] px-6 py-3 text-[0.78rem] font-bold uppercase tracking-[0] text-[#17120f] shadow-[0_18px_46px_rgba(22,22,22,0.08)] backdrop-blur-xl transition duration-300 hover:border-[#8B1118]/45 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#c6a45b]"
            >
              <span className="relative z-10">Contact Service Desk</span>
              <ArrowRight className="relative z-10 h-4 w-4" strokeWidth={2.1} />
            </Link>
            <Link
              href="#"
              target="_blank"
              className="trade-button inline-flex min-h-12 items-center justify-center gap-3 rounded-[8px] border border-[#C9A45C]/58 bg-[#fffaf0] px-6 py-3 text-[0.78rem] font-bold uppercase tracking-[0] text-[#8B1118] shadow-[0_18px_46px_rgba(22,22,22,0.08)] backdrop-blur-xl transition duration-300 hover:border-[#8B1118]/45 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#c6a45b]"
            >
              <span className="relative z-10">For More Details, Check This</span>
              <ArrowRight className="relative z-10 h-4 w-4" strokeWidth={2.1} />
            </Link>
          </div>

          <div data-hero-reveal className="trade-hero-corridor mt-12 grid gap-3 border-y border-[#c6a45b]/22 py-4 text-[0.68rem] font-bold uppercase tracking-[0.18em] text-[#8b1118] sm:grid-cols-3">
            <span>Import Operations</span>
            <span>Export Operations</span>
            <span>Market Access</span>
          </div>
        </div>

        <div data-hero-globe className="trade-globe-field relative h-[430px] sm:h-[560px] lg:h-[720px]">
          <TradeGlobeScene />
        </div>
      </div>
    </section>
  );
}

function GlobeFallback() {
  return (
    <div className="absolute inset-0 grid place-items-center">
      <div className="h-72 w-72 rounded-full border border-[#c6a45b]/32 bg-[#17120f] shadow-[0_34px_90px_rgba(71,53,24,0.18)]" />
    </div>
  );
}

function GlobalTradeShowcaseSection() {
  return (
    <section id="global-trade-network" className="relative z-10 py-20 lg:py-28">
      <div className="px-5 sm:px-6 md:px-8 xl:px-10">
        <div data-trade-reveal className="mx-auto grid max-w-[1360px] gap-8 lg:grid-cols-[0.78fr_1fr] lg:items-end">
          <div>
            <p className="trade-section-kicker">Global Trade Showcase</p>
            <h2 className="mt-5 trade-editorial-heading">
              Enterprise panels for international commerce movement.
            </h2>
          </div>
          <p className="trade-copy max-w-[39rem] text-[1rem] font-medium leading-8 text-[#62584a] lg:justify-self-end">
            Import operations, export execution, supplier networks and trade documentation are presented as large visual systems,
            not fragmented service tiles.
          </p>
        </div>
      </div>

      <div className="mt-14 space-y-3">
        {showcasePanels.map((panel, index) => (
          <article key={panel.title} data-parallax-panel className="trade-full-panel relative overflow-hidden">
            <div data-image-reveal className="absolute inset-0">
              <Image
                data-parallax-image
                src={panel.image}
                alt={panel.alt}
                fill
                sizes="100vw"
                quality={86}
                priority={index === 0}
                className="trade-panel-image object-cover"
                style={{ objectPosition: panel.objectPosition }}
              />
            </div>
            <div
              className={cx(
                "absolute inset-0",
                panel.align === "left"
                  ? "bg-[linear-gradient(90deg,rgba(8,8,9,0.9),rgba(23,18,15,0.58)_48%,rgba(23,18,15,0.16)_82%),linear-gradient(180deg,rgba(0,0,0,0.2),rgba(0,0,0,0.52))]"
                  : "bg-[linear-gradient(270deg,rgba(8,8,9,0.9),rgba(23,18,15,0.58)_48%,rgba(23,18,15,0.16)_82%),linear-gradient(180deg,rgba(0,0,0,0.2),rgba(0,0,0,0.52))]"
              )}
            />
            <div
              className={cx(
                "relative z-10 flex min-h-[78svh] items-end px-5 py-10 sm:px-8 lg:min-h-[88svh] lg:px-12 lg:py-14",
                panel.align === "right" && "lg:justify-end"
              )}
            >
              <div data-trade-reveal className="max-w-[43rem] text-[#fffaf0]">
                <p className="text-[0.72rem] font-bold uppercase text-[#d8b56d]">{panel.kicker}</p>
                <h3 className="mt-4 trade-display text-[3.4rem] font-semibold leading-[0.9] sm:text-[4.8rem] lg:text-[6.2rem]">
                  {panel.title}
                </h3>
                <p className="trade-copy mt-6 max-w-[34rem] text-[1rem] font-medium leading-8 text-[#f8ecd8] [text-shadow:0_3px_20px_rgba(0,0,0,0.58)] md:text-[1.08rem]">
                  {panel.body}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function TradeEcosystemSection() {
  return (
    <section className="relative z-10 px-5 py-20 sm:px-6 md:px-8 lg:py-28 xl:px-10">
      <div className="mx-auto max-w-[1360px]">
        <div data-trade-reveal className="grid gap-8 lg:grid-cols-[0.78fr_1fr] lg:items-end">
          <div>
            <p className="trade-section-kicker">Trade Ecosystem</p>
            <h2 className="mt-5 trade-editorial-heading">
              A command-grade operating layer for global commerce.
            </h2>
          </div>
          <p className="trade-copy max-w-[39rem] text-[1rem] font-medium leading-8 text-[#62584a] lg:justify-self-end">
            Sourcing, import control, export execution, supplier network rhythm, documentation and trade support are composed
            as one premium trade system.
          </p>
        </div>

        <TradeEcosystemLayoutGrid />
      </div>
    </section>
  );
}

function TradeEcosystemLayoutGrid() {
  const [selectedBlock, setSelectedBlock] = useState<EcosystemBlock | null>(null);
  const prefersReducedMotion = useReducedMotion();

  return (
    <>
      <div className="trade-bento-grid mt-14 grid auto-rows-[18rem] gap-4 md:grid-cols-2 lg:grid-cols-12 lg:auto-rows-[16.75rem] lg:gap-5">
        {ecosystemBlocks.map((block, index) => {
          const isHeroCard = index === 0;

          return (
            <motion.button
              key={block.id}
              type="button"
              layoutId={prefersReducedMotion ? undefined : `ecosystem-${block.id}`}
              data-trade-reveal
              onClick={() => setSelectedBlock(block)}
              className={cx(
                "trade-layout-block group relative overflow-hidden border border-[#d8b56d]/28 p-0 text-left text-[#fffaf0] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#c6a45b]",
                isHeroCard && "is-featured",
                block.className
              )}
            >
              <Image
                src={block.image}
                alt={block.alt}
                fill
                sizes="(min-width: 1024px) 34vw, (min-width: 768px) 50vw, 100vw"
                quality={86}
                className="object-cover"
              />

              <div className="relative z-10 flex h-full flex-col justify-end p-5 sm:p-6 lg:p-7">
                <div className="max-w-[36rem]">
                  <h3 className={cx("trade-display font-semibold leading-none text-[#fffaf0]", isHeroCard ? "max-w-[35rem] text-[3.1rem] sm:text-[4.35rem]" : "text-[2.3rem] sm:text-[3rem]")}>
                    {block.title}
                  </h3>
                  <p className={cx("mt-4 max-w-[34rem] font-medium leading-7 text-[#f4e6cc]", isHeroCard ? "text-[1rem] sm:text-[1.05rem]" : "text-[0.94rem]")}>
                    {block.body}
                  </p>
                  <span className="mt-6 inline-flex items-center gap-2 text-[0.72rem] font-bold uppercase text-[#d8b56d]">
                    Open operating detail
                    <ArrowRight className="h-4 w-4 transition duration-300 group-hover:translate-x-1" strokeWidth={2} />
                  </span>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {selectedBlock ? (
          <motion.div
            className="fixed inset-0 z-[80] grid place-items-center bg-[#17120f]/64 px-5 backdrop-blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28, ease }}
            onClick={() => setSelectedBlock(null)}
          >
            <motion.div
              layoutId={prefersReducedMotion ? undefined : `ecosystem-${selectedBlock.id}`}
              className="trade-layout-modal relative grid max-h-[86svh] w-full max-w-[980px] overflow-hidden border border-[#d8b56d]/34 bg-[#17120f] text-[#fffaf0] md:grid-cols-[0.9fr_1.1fr]"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="relative min-h-[20rem] md:min-h-[34rem]">
                <Image
                  src={selectedBlock.detailImage}
                  alt={selectedBlock.detailAlt}
                  fill
                  sizes="(min-width: 768px) 42vw, 100vw"
                  quality={86}
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(23,18,15,0.08),rgba(23,18,15,0.54))]" />
              </div>
              <div className="relative p-6 sm:p-8 lg:p-10">
                <button
                  type="button"
                  onClick={() => setSelectedBlock(null)}
                  className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-[8px] border border-[#d8b56d]/30 bg-[#fff6e6]/10 text-[#fff6e6] transition duration-300 hover:bg-[#fff6e6]/16 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d8b56d]"
                  aria-label="Close trade ecosystem detail"
                >
                  x
                </button>
                <p className="text-[0.72rem] font-bold uppercase text-[#d8b56d]">Trade Ecosystem Block</p>
                <h3 className="mt-5 max-w-[31rem] trade-display text-[3rem] font-semibold leading-[0.9] sm:text-[4.4rem]">
                  {selectedBlock.title}
                </h3>
                <p className="trade-copy mt-6 max-w-[34rem] text-[1rem] font-medium leading-8 text-[#f4e6cc]">
                  {selectedBlock.body}
                </p>
                <div className="mt-8 h-px w-full bg-[linear-gradient(90deg,rgba(216,181,109,0.72),transparent)]" />
                <p className="trade-copy mt-6 text-[0.9rem] font-semibold leading-7 text-[#d8ccb8]">
                  Designed for enterprise teams that need supplier conversations, operating handoffs and documentation
                  maturity to remain visible through the full trade movement.
                </p>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}

function EnterpriseAdvantageSection() {
  return (
    <section className="relative z-10 px-5 py-20 sm:px-6 md:px-8 lg:py-28 xl:px-10">
      <div className="mx-auto max-w-[1360px]">
        <div data-trade-reveal className="max-w-[62rem]">
          <p className="trade-section-kicker">Enterprise Advantage</p>
          <h2 className="mt-5 trade-editorial-heading">
            Editorial operating advantages for global commerce.
          </h2>
        </div>

        <div className="mt-14">
          {advantageStories.map((story, index) => {
            const Icon = story.Icon;

            return (
              <article
                key={story.title}
                data-parallax-panel
                className="grid gap-8 border-t border-[#d8c39b] py-12 last:border-b lg:grid-cols-2 lg:gap-14 lg:py-16"
              >
                <div
                  data-image-reveal
                  className={cx(
                    "relative min-h-[24rem] overflow-hidden rounded-[8px] border border-[#d8b56d]/26 bg-[#17120f] shadow-[0_28px_88px_rgba(71,53,24,0.14)]",
                    index % 2 === 1 && "lg:order-2"
                  )}
                >
                  <Image
                    data-parallax-image
                    src={story.image}
                    alt={story.alt}
                    fill
                    sizes="(min-width: 1024px) 48vw, 100vw"
                    quality={86}
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(23,18,15,0.04),rgba(23,18,15,0.42))]" />
                </div>

                <div data-trade-reveal className="flex flex-col justify-center">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-[8px] border border-[#c6a45b]/30 bg-[#fff6e6] text-[#8b1118]">
                      <Icon className="h-5 w-5" strokeWidth={1.85} />
                    </span>
                    <p className="text-[0.72rem] font-bold uppercase text-[#8b1118]">
                      {String(index + 1).padStart(2, "0")} / {story.kicker}
                    </p>
                  </div>
                  <h3 className="mt-6 trade-display text-[3.2rem] font-semibold leading-[0.92] text-[#17120f] sm:text-[4.4rem] lg:text-[5.4rem]">
                    {story.title}
                  </h3>
                  <p className="trade-copy mt-6 max-w-[42rem] text-[1.05rem] font-medium leading-8 text-[#62584a]">
                    {story.body}
                  </p>
                  <div data-advantage-rule className="mt-8 h-px w-full bg-[linear-gradient(90deg,rgba(198,164,91,0.74),transparent)]" />
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ContactCtaSection() {
  return (
    <section className="relative z-10 px-5 pb-24 pt-4 sm:px-6 md:px-8 lg:pb-32 xl:px-10">
      <div
        data-trade-reveal
        className="mx-auto max-w-[980px] border-y border-[#d8c39b] py-14 text-center sm:py-18 lg:py-20"
      >
        <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-[8px] border border-[#c6a45b]/32 bg-[#fff6e6] text-[#8b1118]">
          <Globe2 className="h-5 w-5" strokeWidth={1.85} />
        </div>
        <p className="mt-8 trade-section-kicker">Enterprise Trade Consultation</p>
        <h2 className="mx-auto mt-5 max-w-[54rem] trade-display text-[3rem] font-semibold leading-[0.92] text-[#17120f] sm:text-[4.2rem] lg:text-[5.6rem]">
          Move Global Commerce Through One Operating Ecosystem
        </h2>
        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/book-consultation"
            className="trade-button inline-flex min-h-12 items-center justify-center gap-3 rounded-[8px] border border-[#8B1118] bg-[#8B1118] px-6 py-3 text-[0.78rem] font-bold uppercase tracking-[0] text-[#fffaf0] shadow-[0_20px_56px_rgba(139,17,24,0.2)] transition duration-300 hover:bg-[#741016] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#c6a45b]"
          >
            <span className="relative z-10">Book Consultation</span>
            <ArrowRight className="relative z-10 h-4 w-4" strokeWidth={2.1} />
          </Link>
          <Link
            href="/contact"
            className="trade-button inline-flex min-h-12 items-center justify-center gap-3 rounded-[8px] border border-[#C9A45C]/58 bg-[#fffaf0] px-6 py-3 text-[0.78rem] font-bold uppercase tracking-[0] text-[#17120f] shadow-[0_18px_46px_rgba(22,22,22,0.08)] transition duration-300 hover:border-[#8B1118]/45 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#c6a45b]"
          >
            <span className="relative z-10">Contact Service Desk</span>
            <ArrowRight className="relative z-10 h-4 w-4" strokeWidth={2.1} />
          </Link>
          <Link
            href="#"
            target="_blank"
            className="trade-button inline-flex min-h-12 items-center justify-center gap-3 rounded-[8px] border border-[#C9A45C]/58 bg-[#fffaf0] px-6 py-3 text-[0.78rem] font-bold uppercase tracking-[0] text-[#8B1118] shadow-[0_18px_46px_rgba(22,22,22,0.08)] transition duration-300 hover:border-[#8B1118]/45 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#c6a45b]"
          >
            <span className="relative z-10">For More Details, Check This</span>
            <ArrowRight className="relative z-10 h-4 w-4" strokeWidth={2.1} />
          </Link>
        </div>
      </div>
    </section>
  );
}
