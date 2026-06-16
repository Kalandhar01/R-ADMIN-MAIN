"use client";

import { type PointerEvent as ReactPointerEvent, useEffect, useRef } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Bell, Boxes, DraftingCompass, Globe2, HardHat, Network, ShieldCheck, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { useLenis } from "@/components/providers/SmoothScrollProvider";
import { ServiceRequestCTA } from "@/components/ServiceRequestCTA";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

export type EcosystemExpansionDivision = "import-export" | "design" | "infra";

const ease = [0.22, 1, 0.36, 1] as const;

const divisionConfig = {
  "import-export": {
    className: "ecosystem-expansion-trade",
    eyebrow: "Ractysh Import & Export",
    tag: "Ecosystem Expansion Active",
    phase: "Phase 01 in development.",
    heading: ["Global trade", "operations ecosystem."],
    subtext:
      "Import, export, supplier network management and cross-border commerce systems are currently being expanded into a dedicated operational platform.",
    ctaLabel: "Notify Me",
    Icon: Globe2,
    image: "https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?auto=format&fit=crop&w=1200&q=82",
    visualTitle: "Global route grid",
    visualMeta: "Trade operations layer",
    signals: ["Supplier lane", "Port window", "Supplier sync", "Trade line"],
    metrics: [
      ["Trade routes", "Structured"],
      ["Network state", "Preparing"],
      ["Global layer", "Expanding"]
    ]
  },
  design: {
    className: "ecosystem-expansion-design",
    eyebrow: "Ractysh Design",
    tag: "Ecosystem Expansion Active",
    phase: "Phase 01 in development.",
    heading: ["Spatial intelligence", "is evolving."],
    subtext: "Architecture, visualization and premium spatial systems are being prepared for a dedicated immersive experience.",
    ctaLabel: "Notify Me",
    Icon: DraftingCompass,
    image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=84",
    visualTitle: "Blueprint studio",
    visualMeta: "Architecture layer",
    signals: ["Facade study", "Interior frame", "BIM sequence", "Spatial mapping"],
    metrics: [
      ["Blueprints", "Layered"],
      ["Visual system", "Crafting"],
      ["Studio state", "Evolving"]
    ]
  },
  infra: {
    className: "ecosystem-expansion-infra",
    eyebrow: "Ractysh Infra",
    tag: "Ecosystem Expansion Active",
    phase: "Phase 01 in development.",
    heading: ["Infrastructure execution", "at enterprise scale."],
    subtext:
      "Turnkey systems, project delivery and operational infrastructure platforms are currently under structured development.",
    ctaLabel: "Notify Me",
    Icon: HardHat,
    image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=84",
    visualTitle: "Execution command",
    visualMeta: "Infrastructure layer",
    signals: ["Site workflow", "QA checkpoint", "Procurement line", "Handover path"],
    metrics: [
      ["Delivery system", "Expanding"],
      ["Site command", "Preparing"],
      ["Turnkey layer", "Incoming"]
    ]
  }
} satisfies Record<
  EcosystemExpansionDivision,
  {
    className: string;
    eyebrow: string;
    tag: string;
    heading: [string, string];
    subtext: string;
    phase: string;
    ctaLabel: string;
    Icon: LucideIcon;
    image: string;
    visualTitle: string;
    visualMeta: string;
    signals: string[];
    metrics: [string, string][];
  }
>;

const particlePositions = [
  ["12%", "18%", "0s"],
  ["22%", "72%", "0.8s"],
  ["48%", "14%", "1.4s"],
  ["67%", "78%", "0.3s"],
  ["86%", "28%", "1.1s"],
  ["78%", "54%", "1.8s"]
];

export function EcosystemExpansionExperience({ division }: { division: EcosystemExpansionDivision }) {
  const config = divisionConfig[division];
  const rootRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const lenis = useLenis();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { damping: 34, stiffness: 120, mass: 0.7 });
  const smoothY = useSpring(mouseY, { damping: 34, stiffness: 120, mass: 0.7 });
  const visualRotateY = useTransform(smoothX, [-0.5, 0.5], [-4, 4]);
  const visualRotateX = useTransform(smoothY, [-0.5, 0.5], [2.6, -2.6]);
  const visualX = useTransform(smoothX, [-0.5, 0.5], [-10, 10]);
  const visualY = useTransform(smoothY, [-0.5, 0.5], [-8, 8]);
  const Icon = config.Icon;

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const context = gsap.context(() => {
      const shouldReduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (shouldReduce) {
        gsap.set("[data-expansion-reveal]", { opacity: 1, y: 0, filter: "blur(0px)" });
        return;
      }

      gsap.to("[data-expansion-grid]", {
        x: 54,
        y: 54,
        duration: 30,
        repeat: -1,
        ease: "none"
      });

      gsap.to("[data-expansion-glow]", {
        xPercent: 5,
        yPercent: -4,
        scale: 1.04,
        duration: 12,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });

      gsap.utils.toArray<HTMLElement>("[data-expansion-reveal]").forEach((element, index) => {
        gsap.fromTo(
          element,
          { opacity: 0, y: 60, filter: "blur(8px)" },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 1,
            delay: Math.min(index * 0.08, 0.24),
            ease: "power4.out",
            scrollTrigger: {
              trigger: element,
              start: "top 86%"
            }
          }
        );
      });

      gsap.utils.toArray<HTMLElement>("[data-expansion-depth]").forEach((element) => {
        const depth = Number(element.dataset.expansionDepth || 0);
        gsap.to(element, {
          y: depth,
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: "bottom top",
            scrub: 1.2
          }
        });
      });
    }, root);

    const refreshId = window.requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      window.cancelAnimationFrame(refreshId);
      context.revert();
    };
  }, [lenis]);

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (reduceMotion) return;

    const rect = event.currentTarget.getBoundingClientRect();
    mouseX.set((event.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((event.clientY - rect.top) / rect.height - 0.5);
  };

  const resetPointer = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const revealProps = (delay = 0) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 60, filter: "blur(8px)" },
          animate: { opacity: 1, y: 0, filter: "blur(0px)" },
          transition: { duration: 1, delay, ease }
        };

  return (
    <article ref={rootRef} className={cn("ecosystem-expansion relative min-h-screen overflow-hidden", config.className)}>
      <section className="relative isolate flex min-h-[100svh] items-center overflow-hidden px-5 pb-24 pt-28 md:px-8 lg:pt-32">
        <ExpansionAtmosphere />

        <div className="relative z-10 mx-auto grid w-full max-w-[1380px] gap-12 lg:grid-cols-[minmax(0,0.82fr)_minmax(32rem,1.18fr)] lg:items-center xl:gap-16">
          <div className="max-w-[47rem]">
            <motion.div {...revealProps()} className="ecosystem-expansion-tag inline-flex items-center gap-3 rounded-full border px-3.5 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.22em]">
              <span className="ecosystem-expansion-status-dot" />
              {config.tag}
            </motion.div>

            <motion.p {...revealProps(0.08)} className="ecosystem-expansion-label mt-8 text-[0.72rem] font-semibold uppercase tracking-[0.28em]">
              Ractysh Ecosystem
            </motion.p>

            <motion.p {...revealProps(0.12)} className="ecosystem-expansion-eyebrow mt-3 text-[0.68rem] font-semibold uppercase tracking-[0.24em]">
              {config.eyebrow}
            </motion.p>

            <h1
              aria-label={`${config.heading[0]} ${config.heading[1]}`}
              className="mt-5 font-display text-[clamp(3rem,6.2vw,6.8rem)] font-semibold leading-[0.9] tracking-normal"
            >
              {config.heading.map((line, index) => (
                <motion.span key={line} {...revealProps(0.16 + index * 0.1)} className={cn("block", index === 1 && "ecosystem-expansion-heading-accent")}>
                  {line}
                </motion.span>
              ))}
            </h1>

            <motion.p {...revealProps(0.38)} className="ecosystem-expansion-copy mt-7 max-w-[41rem] text-[15px] leading-[1.85] md:text-[17px]">
              {config.subtext}
            </motion.p>

            <motion.div {...revealProps(0.46)} className="mt-6 grid gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.16em] sm:flex">
              <span className="ecosystem-expansion-micro-line rounded-full border px-3 py-2">External ecosystem platform launching soon.</span>
              <span className="ecosystem-expansion-micro-line rounded-full border px-3 py-2">{config.phase}</span>
            </motion.div>

            <motion.div {...revealProps(0.52)} className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/#enterprise-solutions" className="ecosystem-expansion-primary-cta">
                Return to Ecosystem
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/book-demo" className="ecosystem-expansion-secondary-cta">
                <Bell className="h-4 w-4" />
                {config.ctaLabel}
              </Link>
              <ServiceRequestCTA showLabel={false} />
            </motion.div>
          </div>

          <motion.div
            data-expansion-depth="-24"
            onPointerMove={handlePointerMove}
            onPointerLeave={resetPointer}
            className="ecosystem-expansion-visual relative min-h-[34rem] overflow-hidden rounded-[2rem] border shadow-[0_44px_140px_rgba(0,0,0,0.18)] md:min-h-[39rem]"
            style={
              reduceMotion
                ? undefined
                : {
                    x: visualX,
                    y: visualY,
                    rotateX: visualRotateX,
                    rotateY: visualRotateY,
                    transformPerspective: 1400
                  }
            }
          >
            <div className="ecosystem-expansion-visual-grid absolute inset-0" aria-hidden />
            <div className="ecosystem-expansion-visual-glow absolute inset-0" aria-hidden />
            <img src={config.image} alt="" className="ecosystem-expansion-visual-image absolute inset-0 h-full w-full object-cover" />
            <div className="ecosystem-expansion-visual-scrim absolute inset-0" aria-hidden />

            <div className="relative z-10 flex min-h-[34rem] flex-col justify-between p-5 md:min-h-[39rem] md:p-7">
              <div className="flex items-start justify-between gap-4">
                <div className="ecosystem-expansion-command-card max-w-[18rem] rounded-[1.35rem] border p-4">
                  <div className="flex items-center gap-3">
                    <span className="ecosystem-expansion-icon flex h-11 w-11 items-center justify-center rounded-[1rem] border">
                      <Icon className="h-5 w-5" strokeWidth={1.8} />
                    </span>
                    <div>
                      <p className="text-[0.58rem] font-bold uppercase tracking-[0.18em]">{config.visualMeta}</p>
                      <h2 className="mt-1 font-display text-[22px] font-semibold leading-none">{config.visualTitle}</h2>
                    </div>
                  </div>
                </div>

                <div className="ecosystem-expansion-mini-node hidden rounded-full border px-3 py-2 text-[0.62rem] font-bold uppercase tracking-[0.16em] md:inline-flex">
                  System Sync
                </div>
              </div>

              <DivisionVisual config={config} />
            </div>
          </motion.div>
        </div>
      </section>
      <div className="ecosystem-expansion-footer pointer-events-none absolute inset-x-0 bottom-0 z-20 px-5 pb-6 md:px-8">
        <div className="mx-auto flex max-w-[1380px] items-center justify-between border-t pt-4 text-[0.68rem] font-semibold uppercase tracking-[0.18em]">
          <span>Ractysh Enterprise Ecosystem</span>
          <span>Initializing ecosystem layer...</span>
        </div>
      </div>
    </article>
  );
}

function ExpansionAtmosphere() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden>
      <div data-expansion-glow className="ecosystem-expansion-glow absolute inset-[-14%]" />
      <div data-expansion-grid className="ecosystem-expansion-grid absolute inset-[-10%]" />
      <div className="ecosystem-expansion-blueprint absolute inset-0" />
      {particlePositions.map(([left, top, delay], index) => (
        <span
          key={`${left}-${top}`}
          className="ecosystem-expansion-particle"
          style={{
            left,
            top,
            animationDelay: delay,
            width: `${index % 2 ? 2 : 1.5}px`,
            height: `${index % 2 ? 2 : 1.5}px`
          }}
        />
      ))}
    </div>
  );
}

function DivisionVisual({ config }: { config: (typeof divisionConfig)[EcosystemExpansionDivision] }) {
  return (
    <div className="relative min-h-[25rem]">
      <div className="ecosystem-expansion-orbit ecosystem-expansion-orbit-one" />
      <div className="ecosystem-expansion-orbit ecosystem-expansion-orbit-two" />

      <div className="ecosystem-expansion-core-panel absolute left-1/2 top-1/2 w-[min(23rem,78vw)] -translate-x-1/2 -translate-y-1/2 rounded-[1.45rem] border p-4 md:w-[25rem]">
        <div className="grid grid-cols-3 gap-2">
          {Array.from({ length: 9 }).map((_, index) => (
            <span key={index} className={cn("ecosystem-expansion-fragment h-16 rounded-[0.9rem] border", index === 4 && "is-active")} />
          ))}
        </div>

        <div className="mt-4 grid gap-2">
          {config.metrics.map(([label, value]) => (
            <div key={label} className="ecosystem-expansion-metric flex items-center justify-between rounded-[0.85rem] border px-3 py-2">
              <span className="text-[0.62rem] font-bold uppercase tracking-[0.14em]">{label}</span>
              <span className="text-sm font-semibold">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {config.signals.map((signal, index) => (
        <div key={signal} className={cn("ecosystem-expansion-signal absolute rounded-full border px-3 py-2 text-[0.62rem] font-bold uppercase tracking-[0.14em]", `signal-${index}`)}>
          <span className="ecosystem-expansion-signal-dot" />
          {signal}
        </div>
      ))}

      <div className="ecosystem-expansion-flow flow-a" />
      <div className="ecosystem-expansion-flow flow-b" />
      <div className="ecosystem-expansion-flow flow-c" />

      <div className="ecosystem-expansion-system-strip absolute bottom-0 left-0 right-0 grid gap-2 rounded-[1.1rem] border p-3 sm:grid-cols-3">
        {["Ecosystem", "Network", "Launch"].map((item, index) => (
          <div key={item} className="flex items-center gap-2 rounded-[0.85rem] border px-3 py-2">
            {index === 0 ? <Boxes className="h-4 w-4" /> : index === 1 ? <Network className="h-4 w-4" /> : <ShieldCheck className="h-4 w-4" />}
            <span className="text-[0.68rem] font-semibold uppercase tracking-[0.1em]">{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
