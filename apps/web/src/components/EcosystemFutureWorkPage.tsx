"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { gsap } from "gsap";
import { ArrowLeft, Bell, DraftingCompass, Globe2, HardHat } from "lucide-react";
import Link from "next/link";
import { useLenis } from "@/components/providers/SmoothScrollProvider";

interface FutureWorkConfig {
  label: string;
  titleLines: [string, string, string];
  mutedLineIndex?: number;
  body: string;
  status: string;
  primaryHref: string;
  Visual: ({ reduceMotion }: { reduceMotion: boolean }) => ReactNode;
  atmosphere?: "architecture";
}

const importExportConfig: FutureWorkConfig = {
  label: "Ractysh Import & Export",
  titleLines: ["Global trade", "systems are currently", "under development."],
  mutedLineIndex: 1,
  body:
    "Import, export, supplier coordination and international trade support systems are being expanded into a dedicated global trade ecosystem.",
  status: "Trade Ecosystem Initializing",
  primaryHref: "/",
  Visual: ImportExportTradeVisual
};

const infraConfig: FutureWorkConfig = {
  label: "Ractysh Infra",
  titleLines: ["Infrastructure execution", "systems are currently", "under development."],
  mutedLineIndex: 1,
  body:
    "Construction control, delivery intelligence and premium infrastructure execution systems are being prepared for the next Ractysh ecosystem layer.",
  status: "Infra Execution Initializing",
  primaryHref: "/",
  Visual: InfraExecutionVisual
};

const designConfig: FutureWorkConfig = {
  label: "RACTYSH DESIGN",
  titleLines: ["Architectural systems", "are currently", "under development."],
  mutedLineIndex: 1,
  body:
    "Spatial design frameworks, premium architecture systems and visualization environments are being expanded into a dedicated ecosystem.",
  status: "Design Layer Initializing",
  primaryHref: "/",
  Visual: DesignArchitectureVisual,
  atmosphere: "architecture"
};

export function ImportExportFutureWorkPage() {
  return <FutureWorkPreview config={importExportConfig} />;
}

export function DesignFutureWorkPage() {
  return <FutureWorkPreview config={designConfig} />;
}

export function InfraFutureWorkPage() {
  return <FutureWorkPreview config={infraConfig} />;
}

function FutureWorkPreview({ config }: { config: FutureWorkConfig }) {
  const rootRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const lenis = useLenis();
  const Visual = config.Visual;

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const context = gsap.context(() => {
      if (reduceMotion) {
        gsap.set("[data-future-reveal]", { opacity: 1, y: 0, filter: "blur(0px)" });
        return;
      }

      gsap.fromTo(
        "[data-future-reveal]",
        { opacity: 0, y: 34, filter: "blur(7px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.95,
          stagger: 0.07,
          ease: "power4.out"
        }
      );

      gsap.to("[data-future-glow]", {
        xPercent: 5,
        yPercent: -4,
        opacity: 0.78,
        duration: 14,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    }, root);

    return () => context.revert();
  }, [lenis, reduceMotion]);

  return (
    <main
      ref={rootRef}
      className="relative isolate flex h-[100svh] items-center justify-center overflow-hidden bg-[#070707] px-5 py-6 text-[#fff7e8] sm:px-6 sm:py-8 md:px-8"
    >
      <PreviewAtmosphere variant={config.atmosphere} />

      <section className="relative z-10 mx-auto flex w-full max-w-[720px] flex-col items-center text-center">
        <motion.div
          data-future-reveal
          animate={reduceMotion ? undefined : { y: [0, -7, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="relative mb-5 flex h-[7.1rem] w-[7.1rem] items-center justify-center will-change-transform sm:mb-7 sm:h-[10.25rem] sm:w-[10.25rem]"
          aria-hidden="true"
        >
          <Visual reduceMotion={Boolean(reduceMotion)} />
        </motion.div>

        <p
          data-future-reveal
          className="text-[0.6rem] font-semibold uppercase tracking-[0.22em] text-[#d6b45f] sm:text-[0.64rem]"
        >
          {config.label}
        </p>

        <h1
          data-future-reveal
          className="mt-4 max-w-[680px] font-display text-[2.12rem] font-[650] leading-[0.95] tracking-[-0.04em] text-[#fff8ec] sm:mt-5 sm:text-[clamp(2.75rem,5.05vw,4.75rem)]"
        >
          {config.titleLines.map((line, index) => (
            <span
              key={line}
              className={index === config.mutedLineIndex ? "block text-[#cfc2ad]" : "block text-[#f6ead8]"}
            >
              {line}
            </span>
          ))}
        </h1>

        <p
          data-future-reveal
          className="mt-4 max-w-[520px] text-[0.86rem] font-medium leading-[1.6] text-[#b9ac9a] sm:mt-5 sm:text-[0.92rem] md:text-[0.95rem]"
        >
          {config.body}
        </p>

        <div
          data-future-reveal
          className="mt-5 inline-flex items-center gap-2.5 rounded-full border border-[#d6b45f]/20 bg-[#fff7e8]/[0.045] px-3.5 py-2 shadow-[0_16px_42px_rgba(0,0,0,0.2)] sm:mt-6"
        >
          <span className="future-status-dot relative h-2 w-2 rounded-full bg-[#d6b45f]" />
          <span className="text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-[#d8ccb8] sm:text-[0.62rem]">
            {config.status}
          </span>
        </div>

        <div data-future-reveal className="mt-7 flex flex-col items-center justify-center gap-3 sm:mt-8 sm:flex-row">
          <Link
            href={config.primaryHref}
            className="group inline-flex min-h-[2.62rem] items-center justify-center gap-2 rounded-[0.58rem] border border-[#fff7e8]/[0.12] bg-[#fff7e8] px-[1.05rem] text-[0.8rem] font-semibold text-[#11100e] shadow-[0_18px_50px_rgba(214,180,95,0.16)] transition-[box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:shadow-[0_22px_60px_rgba(214,180,95,0.24)] sm:min-h-[2.75rem]"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-1" />
            Return Home
          </Link>
          <Link
            href="/contact"
            className="group inline-flex min-h-[2.62rem] items-center justify-center gap-2 rounded-[0.58rem] border border-[#d6b45f]/[0.24] bg-[#fff7e8]/[0.045] px-[1.05rem] text-[0.8rem] font-semibold text-[#fff7e8] shadow-[0_16px_44px_rgba(0,0,0,0.22),inset_0_1px_0_rgba(255,255,255,0.08)] transition-[box-shadow,transform,background-color] duration-300 hover:-translate-y-0.5 hover:bg-[#fff7e8]/[0.075] hover:shadow-[0_20px_54px_rgba(0,0,0,0.28),0_0_28px_rgba(214,180,95,0.12)] sm:min-h-[2.75rem]"
          >
            Notify Me
            <Bell className="h-3.5 w-3.5 transition-transform duration-300 group-hover:rotate-6" />
          </Link>
        </div>
      </section>
    </main>
  );
}

function PreviewAtmosphere({ variant }: { variant?: FutureWorkConfig["atmosphere"] }) {
  return (
    <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,rgba(214,180,95,0.14),transparent_24rem),linear-gradient(180deg,#121212_0%,#0D0B09_46%,#070707_100%)]" />
      <div
        data-future-glow
        className="absolute left-1/2 top-1/2 h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(214,180,95,0.14),rgba(255,247,232,0.04)_38%,transparent_72%)] opacity-[0.66]"
      />
      <div className="future-work-grid absolute -inset-20 opacity-[0.28]" />
      {variant === "architecture" && <div className="future-work-architecture-texture absolute -inset-16 opacity-[0.2]" />}
      <div className="future-work-grain absolute inset-0 opacity-[0.2]" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-[linear-gradient(180deg,transparent,#070707)]" />
    </div>
  );
}

function ImportExportTradeVisual() {
  return (
    <>
      <div className="future-pulse-ring absolute inset-4 rounded-full border border-[#d6b45f]/[0.24]" />
      <div className="future-pulse-ring future-pulse-ring-delayed absolute inset-8 rounded-full border border-[#fff7e8]/10" />
      <div className="absolute inset-[3.4rem] rounded-full border border-[#d6b45f]/[0.28] bg-[#d6b45f]/[0.08] shadow-[0_0_54px_rgba(214,180,95,0.18)] sm:inset-[4.5rem]" />
      <div className="future-wire-grid absolute inset-[2rem] rounded-full opacity-[0.55] sm:inset-[2.4rem]" />
      <div className="relative flex h-12 w-12 items-center justify-center rounded-full border border-[#d6b45f]/[0.34] bg-[#0d0b09] text-[#d6b45f] shadow-[0_0_48px_rgba(214,180,95,0.18)] sm:h-14 sm:w-14">
        <Globe2 className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={1.65} />
      </div>
      {[
        "left-[16%] top-[30%]",
        "right-[17%] top-[34%]",
        "left-[28%] bottom-[17%]",
        "right-[30%] bottom-[18%]"
      ].map((position) => (
        <span key={position} className={`future-node absolute ${position} h-1.5 w-1.5 rounded-full bg-[#fff7e8]`} />
      ))}
    </>
  );
}

function DesignArchitectureVisual({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <>
      <div className="future-pulse-ring absolute inset-4 rounded-full border border-[#d6b45f]/[0.22]" />
      <div className="future-pulse-ring future-pulse-ring-delayed absolute inset-8 rounded-full border border-[#fff7e8]/10" />
      <div className="future-wire-grid absolute inset-[1.9rem] rounded-full opacity-[0.46] sm:inset-[2.25rem]" />
      <svg
        viewBox="0 0 180 180"
        className="service-visual-svg relative h-[6.8rem] w-[6.8rem] overflow-visible drop-shadow-[0_0_34px_rgba(214,180,95,0.15)] sm:h-[9.2rem] sm:w-[9.2rem]"
        fill="none"
        role="img"
        aria-label="Architectural blueprint wireframe"
      >
        <path className="service-visual-gridline" d="M32 54H148M32 90H148M32 126H148M54 32V148M90 32V148M126 32V148" />
        <path className="service-visual-draw service-visual-ivory" d="M46 130V58H134V130H46ZM46 90H84V58M84 90H134M84 90V130M106 90V116H134M60 130V112H76V130" />
        <path className="service-visual-draw service-visual-gold" d="M40 130H140M52 130L90 48L128 130M64 76H116M70 104H110" />
        <path className="service-visual-draw service-visual-ivory" d="M60 112C60 102 68 94 78 94M106 116C106 106 114 98 124 98" />
        <path className="service-visual-scan" d="M38 104H142" />
        <circle className="service-visual-node" cx="90" cy="90" r="3.4" />
      </svg>
      <div className="absolute inset-[3.35rem] flex items-center justify-center rounded-full border border-[#d6b45f]/[0.26] bg-[#d6b45f]/[0.07] shadow-[0_0_52px_rgba(214,180,95,0.14)] sm:inset-[4.45rem]">
        <DraftingCompass className="h-5 w-5 text-[#d6b45f] sm:h-6 sm:w-6" strokeWidth={1.55} />
      </div>
      <span className="future-node absolute left-[19%] top-[33%] h-1.5 w-1.5 rounded-full bg-[#fff7e8]" />
      {!reduceMotion && (
        <>
          <span className="future-node absolute right-[18%] top-[37%] h-1.5 w-1.5 rounded-full bg-[#fff7e8]" />
          <span className="future-node absolute bottom-[19%] left-[30%] h-1.5 w-1.5 rounded-full bg-[#fff7e8]" />
        </>
      )}
    </>
  );
}

function InfraExecutionVisual({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <>
      <div className="future-pulse-ring absolute inset-4 rounded-full border border-[#d6b45f]/[0.22]" />
      <div className="future-pulse-ring future-pulse-ring-delayed absolute inset-8 rounded-full border border-[#fff7e8]/10" />
      <div className="future-wire-grid absolute inset-[1.9rem] rounded-full opacity-50 sm:inset-[2.25rem]" />
      <svg
        viewBox="0 0 180 180"
        className="relative h-[6.8rem] w-[6.8rem] overflow-visible drop-shadow-[0_0_34px_rgba(214,180,95,0.16)] sm:h-[9.2rem] sm:w-[9.2rem]"
        role="img"
        aria-label="Infrastructure execution wireframe"
      >
        <path className="service-visual-gridline" d="M32 54H148M32 90H148M32 126H148M54 32V148M90 32V148M126 32V148" />
        <path
          className="service-visual-draw service-visual-ivory"
          d="M44 128H136M54 128V58M126 128V58M54 58H126M70 128V82M110 128V82M70 82H110"
        />
        <path
          className="service-visual-draw service-visual-gold"
          d="M54 128L72 58L90 128L108 58L126 128M72 58H108"
        />
        <path className="service-visual-scan" d="M38 94H142" />
        <circle className="service-visual-node" cx="90" cy="82" r="3.8" />
      </svg>
      <div className="absolute inset-[3.35rem] flex items-center justify-center rounded-full border border-[#d6b45f]/[0.26] bg-[#d6b45f]/[0.07] shadow-[0_0_52px_rgba(214,180,95,0.14)] sm:inset-[4.45rem]">
        <HardHat className="h-5 w-5 text-[#d6b45f] sm:h-6 sm:w-6" strokeWidth={1.55} />
      </div>
      {!reduceMotion && (
        <span className="future-node absolute right-[22%] top-[28%] h-1.5 w-1.5 rounded-full bg-[#fff7e8]" />
      )}
    </>
  );
}
