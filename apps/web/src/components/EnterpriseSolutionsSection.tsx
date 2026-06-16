"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";

export type EnterpriseVisualKind = "import-export" | "design" | "infra";

export interface EnterpriseMetric {
  label: string;
  value: string;
}

export interface EnterpriseSolution {
  id: string;
  label: string;
  title: string;
  paragraph: string;
  features: string[];
  cta: string;
  visualKind: EnterpriseVisualKind;
  accent: string;
  metrics: EnterpriseMetric[];
  cards: Array<{
    eyebrow: string;
    title: string;
    status: string;
    value: string;
  }>;
}

const ease = [0.22, 1, 0.36, 1] as const;

export function EnterpriseSolutionsSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="enterprise-solutions"
      aria-label="One ecosystem endless possibilities"
      className="minimal-luxury-ecosystem relative isolate overflow-hidden px-6 py-24 text-[#181411] sm:px-8 sm:py-28 lg:min-h-screen lg:px-12 lg:py-0"
    >
      <LuxuryBackdrop />

      <div className="relative z-10 mx-auto grid w-full max-w-[1440px] items-center gap-16 lg:min-h-screen lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:gap-16 xl:gap-20">
        <motion.div
          className="max-w-[42rem] lg:pl-[2vw]"
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-12%" }}
          transition={{ duration: 0.9, ease }}
        >
          <div className="flex items-center gap-4">
            <span className="h-px w-9 bg-[#a37a37]" />
            <p className="font-manrope text-[0.68rem] font-bold uppercase tracking-[0.36em] text-[#9b7334]">
              ONE ECOSYSTEM
            </p>
          </div>

          <h2 className="mle-heading mt-8 max-w-[46rem] font-display text-[clamp(3rem,6.4vw,5.65rem)] font-bold leading-[0.92] tracking-[-0.04em] text-[#17120f] [text-wrap:balance]">
            <span className="block">One Ecosystem.</span>
            <span className="block">Endless Possibilities.</span>
          </h2>

          <p className="mt-8 max-w-[29rem] font-sans text-[clamp(1rem,1.12vw,1.1rem)] font-medium leading-[1.9] tracking-[0] text-[#51463c]">
            Architecture, Construction, Real Estate, Export-Import and OTC Exchange working through one premium
            operational system.
          </p>

          <Link
            href="/#features"
            className="mle-button mt-11 inline-flex min-h-12 items-center justify-center rounded-[8px] px-6 font-manrope text-[0.9rem] font-semibold"
          >
            Explore Ecosystem
          </Link>
        </motion.div>

        <motion.div
          className="relative mx-auto flex min-h-[31rem] w-full max-w-[45rem] items-center justify-center lg:min-h-[42rem] lg:max-w-none"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-12%" }}
          transition={{ duration: 1, ease, delay: 0.14 }}
        >
          <MinimalEcosystemVisual reduceMotion={Boolean(reduceMotion)} />
        </motion.div>
      </div>
    </section>
  );
}

function LuxuryBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
      <div className="mle-ambient absolute inset-[-12%]" />
      <div className="mle-paper absolute inset-0" />
      <div className="mle-blueprint absolute inset-0" />
      <svg className="mle-background-lines absolute inset-0 h-full w-full" viewBox="0 0 1440 920" preserveAspectRatio="none">
        <path d="M930 120 H1246 V356 H1032 V222 H930 Z" />
        <path d="M994 120 V356 M1088 120 V356 M1184 120 V356 M930 222 H1246 M930 292 H1246" />
        <path d="M168 724 C366 664 560 670 752 734 C914 788 1090 784 1288 714" />
      </svg>
    </div>
  );
}

function MinimalEcosystemVisual({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <motion.div
      className="mle-visual relative aspect-square w-[min(42rem,90vw)]"
      animate={reduceMotion ? undefined : { y: [0, -10, 0], rotate: [-0.35, 0.35, -0.35] }}
      transition={reduceMotion ? undefined : { duration: 10.5, repeat: Infinity, ease: "easeInOut" }}
    >
      <div className="mle-visual-aura absolute left-1/2 top-1/2 h-[78%] w-[86%] -translate-x-1/2 -translate-y-1/2" />
      <div className="mle-visual-reflection absolute left-1/2 top-[73%] h-[8rem] w-[76%] -translate-x-1/2" />

      <svg className="mle-visual-lines absolute inset-0 h-full w-full" viewBox="70 72 580 580" aria-hidden>
        <defs>
          <radialGradient id="mle-premium-core" cx="42%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#fffefa" />
            <stop offset="32%" stopColor="#fff1bf" />
            <stop offset="62%" stopColor="#d99d48" />
            <stop offset="100%" stopColor="#6f4b24" stopOpacity="0.42" />
          </radialGradient>
          <linearGradient id="mle-glass-plane" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.78" />
            <stop offset="48%" stopColor="#f7e8c6" stopOpacity="0.32" />
            <stop offset="100%" stopColor="#8fb7c9" stopOpacity="0.18" />
          </linearGradient>
          <linearGradient id="mle-gold-stroke" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#ad7930" stopOpacity="0" />
            <stop offset="40%" stopColor="#dfb760" stopOpacity="0.86" />
            <stop offset="56%" stopColor="#fff3c6" />
            <stop offset="100%" stopColor="#ad7930" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="mle-blue-stroke" x1="0" x2="1">
            <stop offset="0%" stopColor="#6faeca" stopOpacity="0" />
            <stop offset="52%" stopColor="#a7d8ea" stopOpacity="0.72" />
            <stop offset="100%" stopColor="#6faeca" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="mle-copper-fill" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#f0c07a" />
            <stop offset="58%" stopColor="#b76f35" />
            <stop offset="100%" stopColor="#704221" />
          </linearGradient>
          <linearGradient id="mle-graphite-fill" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#fff7df" />
            <stop offset="42%" stopColor="#9f927d" />
            <stop offset="100%" stopColor="#2c241d" />
          </linearGradient>
          <radialGradient id="mle-blue-dot" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f4fcff" />
            <stop offset="100%" stopColor="#6baecb" />
          </radialGradient>
          <radialGradient id="mle-gold-dot" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fff6d1" />
            <stop offset="100%" stopColor="#c58b35" />
          </radialGradient>
          <radialGradient id="mle-champagne-particle" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fffbea" />
            <stop offset="48%" stopColor="#f6d98e" />
            <stop offset="100%" stopColor="#b88638" stopOpacity="0.18" />
          </radialGradient>
          <filter id="mle-soft-shadow" x="-24%" y="-24%" width="148%" height="150%">
            <feDropShadow dx="0" dy="18" stdDeviation="14" floodColor="#5a3c22" floodOpacity="0.18" />
          </filter>
        </defs>

        <g className="mle-blueprint-web" fill="none">
          <ellipse cx="360" cy="454" rx="244" ry="82" />
          <ellipse cx="360" cy="454" rx="192" ry="55" />
          <path d="M146 455 H574 M188 408 H532 M226 497 H494" />
          <path d="M230 532 C302 558 420 558 492 532" />
          <path d="M202 330 C292 258 430 258 520 330" />
        </g>

        <g className="mle-orbit-stack" fill="none" strokeLinecap="round">
          <ellipse className="mle-orbit-ring mle-orbit-ring-gold" cx="360" cy="360" rx="236" ry="92" />
          <ellipse className="mle-orbit-ring mle-orbit-ring-blue" cx="360" cy="360" rx="198" ry="138" transform="rotate(-18 360 360)" />
          <ellipse className="mle-orbit-ring mle-orbit-ring-copper" cx="360" cy="360" rx="145" ry="216" transform="rotate(62 360 360)" />
          <path className="mle-orbit-flow mle-orbit-flow-a" d="M134 360 C228 272 498 272 586 360" />
          <path className="mle-orbit-flow mle-orbit-flow-b" d="M210 492 C284 544 440 534 514 468" />
        </g>

        <g className="mle-glass-layers" filter="url(#mle-soft-shadow)">
          <path d="M210 427 L356 350 L510 426 L364 506 Z" fill="url(#mle-glass-plane)" />
          <path d="M238 386 L358 323 L482 386 L362 452 Z" fill="url(#mle-glass-plane)" />
          <path d="M270 347 L360 300 L452 347 L362 398 Z" fill="url(#mle-glass-plane)" />
        </g>

        <g className="mle-connection-paths" fill="none" strokeLinecap="round">
          <path d="M360 356 C296 388 250 414 204 457" />
          <path d="M360 356 C424 388 468 416 516 457" />
          <path d="M360 356 C354 416 356 462 360 526" />
          <path d="M256 392 C318 424 406 424 466 392" />
        </g>

        <g className="mle-architecture-cluster" strokeLinecap="round" strokeLinejoin="round">
          <g className="mle-building mle-building-left">
            <path d="M246 454 L246 372 L303 342 L303 454 Z" fill="url(#mle-graphite-fill)" />
            <path d="M303 342 L340 366 L340 454 L303 454 Z" fill="#c7ad78" fillOpacity="0.44" />
            <path d="M246 372 L303 342 L340 366 L282 397 Z" fill="#fff8df" fillOpacity="0.66" />
            <path d="M260 395 H288 M260 421 H288 M313 390 H326 M313 417 H326" />
          </g>
          <g className="mle-building mle-building-right">
            <path d="M412 456 L412 348 L470 380 L470 456 Z" fill="url(#mle-copper-fill)" fillOpacity="0.92" />
            <path d="M370 372 L412 348 L412 456 L370 456 Z" fill="#fff3d6" fillOpacity="0.62" />
            <path d="M370 372 L412 348 L470 380 L430 405 Z" fill="#fffaf0" fillOpacity="0.56" />
            <path d="M384 397 H400 M384 424 H400 M426 394 H452 M426 422 H452" />
          </g>
          <g className="mle-building mle-building-center">
            <path d="M318 476 L318 334 L360 298 L402 334 L402 476 Z" fill="#f8f1de" fillOpacity="0.72" />
            <path d="M360 298 L402 334 L402 476 L360 452 Z" fill="#6f8fa0" fillOpacity="0.24" />
            <path d="M318 334 L360 298 L402 334 L360 360 Z" fill="#fffefa" fillOpacity="0.82" />
            <path d="M342 476 V396 H378 V476 M336 366 H384 M336 424 H384" />
          </g>
        </g>

        <g className="mle-building-energy" aria-hidden="true">
          <g className="mle-building-trace-sparkles">
            <path
              className="mle-building-trace mle-building-trace-left"
              d="M246 372 L303 342 L340 366 L282 397"
              style={{ animationDelay: "-2.1s", animationDuration: "7.6s" }}
            />
            <path
              className="mle-building-trace mle-building-trace-right"
              d="M370 372 L412 348 L470 380 L430 405"
              style={{ animationDelay: "-5.4s", animationDuration: "7.9s" }}
            />
            <path
              className="mle-building-trace mle-building-trace-rare"
              d="M246 372 L246 454 M303 342 L303 454"
              style={{ animationDelay: "-8.8s", animationDuration: "15.4s" }}
            />
            <path
              className="mle-building-trace mle-building-trace-rare"
              d="M412 348 L412 456 M470 380 L470 456"
              style={{ animationDelay: "-12.6s", animationDuration: "16.8s" }}
            />
          </g>

          <g className="mle-building-particles">
            <circle className="mle-building-particle mle-building-particle-left" cx="252" cy="386" r="1.25" style={{ animationDelay: "-0.7s", animationDuration: "5.8s" }} />
            <circle className="mle-building-particle mle-building-particle-left" cx="284" cy="360" r="1.1" style={{ animationDelay: "-2.4s", animationDuration: "6.6s" }} />
            <circle className="mle-building-particle mle-building-particle-left" cx="319" cy="389" r="1.35" style={{ animationDelay: "-4.1s", animationDuration: "7.4s" }} />
            <circle className="mle-building-particle mle-building-particle-left" cx="267" cy="431" r="1.15" style={{ animationDelay: "-1.8s", animationDuration: "4.9s" }} />
            <circle className="mle-building-particle mle-building-particle-left" cx="337" cy="440" r="1" style={{ animationDelay: "-3.2s", animationDuration: "6.1s" }} />
            <circle className="mle-building-particle mle-building-particle-left" cx="298" cy="413" r="1.55" style={{ animationDelay: "-5.5s", animationDuration: "7.8s" }} />
            <circle className="mle-building-particle mle-building-particle-left" cx="242" cy="453" r="1" style={{ animationDelay: "-2.9s", animationDuration: "5.2s" }} />
            <circle className="mle-building-particle mle-building-particle-pinpoint mle-building-particle-left" cx="259" cy="367" r="0.72" style={{ animationDelay: "-1.35s", animationDuration: "3.9s" }} />
            <circle className="mle-building-particle mle-building-particle-pinpoint mle-building-particle-left" cx="276" cy="394" r="0.58" style={{ animationDelay: "-4.65s", animationDuration: "7.1s" }} />
            <circle className="mle-building-particle mle-building-particle-pinpoint mle-building-particle-left" cx="311" cy="371" r="0.7" style={{ animationDelay: "-3.45s", animationDuration: "5.6s" }} />
            <circle className="mle-building-particle mle-building-particle-pinpoint mle-building-particle-left" cx="328" cy="421" r="0.62" style={{ animationDelay: "-6.25s", animationDuration: "7.7s" }} />
            <circle className="mle-building-particle mle-building-particle-pinpoint mle-building-particle-left" cx="266" cy="444" r="0.68" style={{ animationDelay: "-0.95s", animationDuration: "4.7s" }} />

            <circle className="mle-building-particle mle-building-particle-right" cx="382" cy="386" r="1.2" style={{ animationDelay: "-1.1s", animationDuration: "6.4s" }} />
            <circle className="mle-building-particle mle-building-particle-right" cx="414" cy="363" r="1.45" style={{ animationDelay: "-3.8s", animationDuration: "7.2s" }} />
            <circle className="mle-building-particle mle-building-particle-right" cx="452" cy="397" r="1.1" style={{ animationDelay: "-2.2s", animationDuration: "5.4s" }} />
            <circle className="mle-building-particle mle-building-particle-right" cx="431" cy="432" r="1.3" style={{ animationDelay: "-4.7s", animationDuration: "7.6s" }} />
            <circle className="mle-building-particle mle-building-particle-right" cx="470" cy="450" r="1" style={{ animationDelay: "-0.9s", animationDuration: "4.6s" }} />
            <circle className="mle-building-particle mle-building-particle-right" cx="398" cy="420" r="1.55" style={{ animationDelay: "-5.9s", animationDuration: "7.9s" }} />
            <circle className="mle-building-particle mle-building-particle-right" cx="462" cy="372" r="1" style={{ animationDelay: "-3.1s", animationDuration: "5.7s" }} />
            <circle className="mle-building-particle mle-building-particle-pinpoint mle-building-particle-right" cx="392" cy="372" r="0.64" style={{ animationDelay: "-2.75s", animationDuration: "4.2s" }} />
            <circle className="mle-building-particle mle-building-particle-pinpoint mle-building-particle-right" cx="426" cy="389" r="0.58" style={{ animationDelay: "-5.15s", animationDuration: "6.8s" }} />
            <circle className="mle-building-particle mle-building-particle-pinpoint mle-building-particle-right" cx="455" cy="422" r="0.76" style={{ animationDelay: "-1.85s", animationDuration: "5.1s" }} />
            <circle className="mle-building-particle mle-building-particle-pinpoint mle-building-particle-right" cx="441" cy="449" r="0.62" style={{ animationDelay: "-6.6s", animationDuration: "7.6s" }} />
            <circle className="mle-building-particle mle-building-particle-pinpoint mle-building-particle-right" cx="475" cy="397" r="0.68" style={{ animationDelay: "-3.35s", animationDuration: "5.9s" }} />
          </g>
        </g>

        <g className="mle-core-system">
          <circle className="mle-core-halo" cx="360" cy="276" r="88" />
          <circle className="mle-core-orb" cx="360" cy="276" r="62" fill="url(#mle-premium-core)" />
          <path className="mle-core-sheen" d="M323 242 C345 218 386 218 405 246" />
          <circle className="mle-core-inner" cx="360" cy="276" r="29" />
        </g>

        <g className="mle-nodes">
          <circle className="mle-node-blue" cx="204" cy="457" r="5.2" />
          <circle className="mle-node-gold" cx="516" cy="457" r="5.2" />
          <circle className="mle-node-copper" cx="360" cy="526" r="5.6" />
          <circle className="mle-node-blue" cx="248" cy="316" r="4.4" />
          <circle className="mle-node-gold" cx="492" cy="320" r="4.4" />
        </g>
      </svg>
    </motion.div>
  );
}
