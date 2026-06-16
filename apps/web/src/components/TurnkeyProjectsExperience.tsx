"use client";

import type { PointerEvent as ReactPointerEvent } from "react";
import { useEffect, useRef } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, CheckCircle2, ClipboardCheck, HardHat, Layers3, RadioTower, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { CompanyContactPanel } from "@/components/CompanyContactPanel";
import { useLenis } from "@/components/providers/SmoothScrollProvider";
import { ServiceRequestCTA } from "@/components/ServiceRequestCTA";

gsap.registerPlugin(ScrollTrigger);

const ease = [0.22, 1, 0.36, 1] as const;

const flowSteps = ["Planning", "Coordination", "Execution", "Delivery"];

const showcaseItems = [
  { label: "Milestone", value: "Phase 03", progress: "76%" },
  { label: "Site Sync", value: "Active", progress: "Live" },
  { label: "Handover", value: "Mapped", progress: "04" }
];

const metrics = [
  {
    title: "Operational Control",
    body: "One accountable delivery layer from scope lock to handover.",
    Icon: ShieldCheck
  },
  {
    title: "Milestone Precision",
    body: "Clear sequencing for vendors, approvals and site activity.",
    Icon: ClipboardCheck
  },
  {
    title: "Delivery Accountability",
    body: "Progress, finish quality and documentation stay visible.",
    Icon: CheckCircle2
  }
];

function ExecutionDashboard() {
  const reduceMotion = useReducedMotion();
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const smoothX = useSpring(pointerX, { damping: 34, stiffness: 120, mass: 0.75 });
  const smoothY = useSpring(pointerY, { damping: 34, stiffness: 120, mass: 0.75 });
  const rotateX = useTransform(smoothY, [-0.5, 0.5], [2, -2]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-3, 3]);
  const x = useTransform(smoothX, [-0.5, 0.5], [-7, 7]);
  const y = useTransform(smoothY, [-0.5, 0.5], [-5, 5]);

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (reduceMotion) return;
    const rect = event.currentTarget.getBoundingClientRect();
    pointerX.set((event.clientX - rect.left) / rect.width - 0.5);
    pointerY.set((event.clientY - rect.top) / rect.height - 0.5);
  };

  return (
    <motion.div
      data-turnkey-parallax
      initial={{ opacity: 0, y: 46, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 1, delay: 0.22, ease }}
      onPointerMove={handlePointerMove}
      onPointerLeave={() => {
        pointerX.set(0);
        pointerY.set(0);
      }}
      className="relative mx-auto w-full max-w-[35rem]"
      style={{ perspective: 1200 }}
    >
      <motion.div
        style={reduceMotion ? undefined : { rotateX, rotateY, x, y, transformStyle: "preserve-3d" }}
        className="relative overflow-hidden rounded-[1.35rem] border border-[#2d2a22]/10 bg-[#fffdf7]/72 p-4 shadow-[0_34px_90px_rgba(45,38,25,0.13),inset_0_1px_0_rgba(255,255,255,0.72)]"
      >
        <div className="absolute inset-0 opacity-70" style={{ backgroundImage: "url('/HeaderBG.webp')", backgroundSize: "cover", backgroundPosition: "center" }} />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_74%_18%,rgba(214,180,95,0.24),transparent_34%),linear-gradient(135deg,rgba(255,255,255,0.72),rgba(245,242,235,0.64))]" />
        <div className="relative z-10 rounded-[1rem] border border-[#25231f]/10 bg-[#f8f6f1]/76 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.72)]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-[#9a7a2e]">Execution Console</p>
              <h2 className="mt-2 font-display text-[1.48rem] font-semibold leading-none tracking-[-0.04em] text-[#191816]">
                Turnkey delivery board
              </h2>
            </div>
            <span className="flex h-11 w-11 items-center justify-center rounded-full border border-[#d6b45f]/30 bg-[#d6b45f]/12 text-[#8a6a20]">
              <HardHat className="h-5 w-5" />
            </span>
          </div>

          <div className="mt-7 grid gap-3">
            {showcaseItems.map((item, index) => (
              <div key={item.label} className="rounded-[0.8rem] border border-[#25231f]/8 bg-white/64 p-3.5">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[0.78rem] font-semibold text-[#49443b]">{item.label}</span>
                  <span className="text-[0.75rem] font-semibold text-[#9a7a2e]">{item.value}</span>
                </div>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#25231f]/8">
                  <motion.span
                    className="block h-full rounded-full bg-[linear-gradient(90deg,#111111,#d6b45f,#fff1c2)]"
                    initial={{ scaleX: 0, transformOrigin: "left" }}
                    animate={{ scaleX: index === 0 ? 0.76 : index === 1 ? 0.9 : 0.62 }}
                    transition={{ duration: reduceMotion ? 0 : 1.2, delay: 0.55 + index * 0.12, ease }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-7 rounded-[0.9rem] border border-[#d6b45f]/20 bg-[#181612] p-4 text-[#fff8ec] shadow-[0_20px_55px_rgba(24,22,18,0.16)]">
            <div className="flex items-center justify-between">
              <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-[#d6b45f]">Project Pulse</p>
              <span className="relative flex h-2.5 w-2.5">
                <motion.span
                  className="absolute h-full w-full rounded-full bg-[#d6b45f]"
                  animate={reduceMotion ? undefined : { opacity: [0.7, 0], scale: [1, 2.6] }}
                  transition={{ duration: 2.1, repeat: Infinity, ease: "easeOut" }}
                />
                <span className="relative h-2.5 w-2.5 rounded-full bg-[#d6b45f]" />
              </span>
            </div>
            <div className="mt-4 grid grid-cols-4 gap-2">
              {flowSteps.map((step, index) => (
                <div key={step} className="min-w-0">
                  <div className="h-1 overflow-hidden rounded-full bg-white/10">
                    <motion.span
                      className="block h-full rounded-full bg-[#d6b45f]"
                      animate={reduceMotion ? undefined : { x: ["-100%", "0%", "100%"] }}
                      transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut", delay: index * 0.18 }}
                    />
                  </div>
                  <p className="mt-2 truncate text-[0.58rem] font-semibold uppercase tracking-[0.12em] text-white/52">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function ExecutionFlow() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="workflow" className="px-5 py-12 md:px-8 md:py-16">
      <div className="mx-auto max-w-[1120px]">
        <div data-turnkey-reveal className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-[#9a7a2e]">Execution Flow</p>
            <h2 className="mt-3 max-w-[35rem] font-display text-[clamp(2rem,4vw,3.8rem)] font-semibold leading-[0.98] tracking-[-0.052em] text-[#161512]">
              A controlled path from brief to handover.
            </h2>
          </div>
          <p className="max-w-[25rem] text-[0.96rem] leading-7 text-[#5d584d]">
            A lean delivery rhythm keeps planning, coordination, site work and closure moving as one system.
          </p>
        </div>

        <div data-turnkey-reveal className="relative mt-10 rounded-[1.1rem] border border-[#2f2a1f]/10 bg-white/46 p-5 shadow-[0_24px_70px_rgba(57,48,31,0.08)]">
          <div className="absolute left-8 right-8 top-[3.1rem] hidden h-px bg-[#2f2a1f]/12 md:block" />
          <motion.div
            className="absolute left-8 top-[3.1rem] hidden h-px w-24 bg-[linear-gradient(90deg,transparent,#d6b45f,transparent)] md:block"
            animate={reduceMotion ? undefined : { x: ["0%", "820%"], opacity: [0, 1, 0] }}
            transition={{ duration: 5.4, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="grid gap-4 md:grid-cols-4">
            {flowSteps.map((step, index) => (
              <motion.div
                key={step}
                whileHover={reduceMotion ? undefined : { y: -4 }}
                transition={{ duration: 0.28, ease }}
                className="relative rounded-[0.85rem] border border-[#2f2a1f]/8 bg-[#fffdf8]/72 p-4 shadow-[0_18px_45px_rgba(57,48,31,0.07)]"
              >
                <div className="flex items-center gap-3">
                  <span className="relative flex h-8 w-8 items-center justify-center rounded-full border border-[#d6b45f]/40 bg-[#f6edd7] text-[0.72rem] font-bold text-[#7a5d19]">
                    {index + 1}
                    {index === 2 ? <span className="absolute inset-0 rounded-full shadow-[0_0_28px_rgba(214,180,95,0.46)]" /> : null}
                  </span>
                  <h3 className="font-display text-[1.12rem] font-semibold tracking-[-0.035em] text-[#171512]">{step}</h3>
                </div>
                <p className="mt-5 text-[0.84rem] leading-6 text-[#666054]">
                  {index === 0
                    ? "Scope, budget and finish expectations are locked with clarity."
                    : index === 1
                      ? "Teams, vendors, approvals and sourcing move in sequence."
                      : index === 2
                        ? "Site activity is monitored through a visible execution rhythm."
                        : "Completion, quality checks and handover stay accountable."}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ShowcaseBlock() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="px-5 py-12 md:px-8 md:py-16">
      <div className="mx-auto max-w-[1120px]">
        <motion.div
          data-turnkey-reveal
          whileHover={reduceMotion ? undefined : { y: -5 }}
          transition={{ duration: 0.35, ease }}
          className="relative overflow-hidden rounded-[1.35rem] border border-[#28241a]/10 bg-[#171511] p-5 text-[#fff8ec] shadow-[0_34px_90px_rgba(46,39,25,0.16)] md:p-7"
        >
          <div className="absolute inset-0 opacity-[0.34]" style={{ backgroundImage: "url('/HeaderBG.webp')", backgroundSize: "cover", backgroundPosition: "center" }} />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_76%_20%,rgba(214,180,95,0.28),transparent_32%),linear-gradient(135deg,rgba(12,11,9,0.86),rgba(25,23,18,0.92))]" />
          <div className="absolute inset-0 opacity-[0.18] [background-image:linear-gradient(rgba(255,255,255,0.14)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] [background-size:46px_46px]" />

          <div className="relative z-10 grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
            <div>
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-[#d6b45f]">Premium Showcase</p>
              <h2 className="mt-4 max-w-[30rem] font-display text-[clamp(2.2rem,4.6vw,4.9rem)] font-semibold leading-[0.95] tracking-[-0.056em]">
                Control systems for clean site delivery.
              </h2>
              <p className="mt-5 max-w-[29rem] text-[0.98rem] leading-7 text-white/64">
                Construction control, milestone tracking, execution systems and live reporting stay organized in one premium delivery layer.
              </p>
            </div>

            <div className="relative min-h-[22rem] overflow-hidden rounded-[1rem] border border-white/10 bg-white/[0.055] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
              <div className="absolute inset-4 rounded-[0.8rem] border border-[#d6b45f]/18 bg-[linear-gradient(135deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))]" />
              <div className="absolute left-8 top-9 h-[13rem] w-[38%] rounded-[0.65rem] border border-white/10 bg-[#f8f6f1]/12 shadow-[0_20px_60px_rgba(0,0,0,0.28)]" />
              <div className="absolute bottom-8 right-8 h-[11.5rem] w-[54%] rounded-[0.65rem] border border-[#d6b45f]/24 bg-black/18 p-4 shadow-[0_24px_70px_rgba(0,0,0,0.3)]">
                <div className="flex items-center justify-between">
                  <p className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-[#d6b45f]">Live Report</p>
                  <RadioTower className="h-4 w-4 text-[#d6b45f]" />
                </div>
                <div className="mt-5 space-y-3">
                  {["Foundation", "Structure", "Finish"].map((item, index) => (
                    <div key={item}>
                      <div className="flex items-center justify-between text-[0.72rem] font-semibold text-white/68">
                        <span>{item}</span>
                        <span>{index === 0 ? "Done" : index === 1 ? "Live" : "Queued"}</span>
                      </div>
                      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                        <motion.span
                          className="block h-full rounded-full bg-[linear-gradient(90deg,#d6b45f,#fff0bb)]"
                          initial={{ scaleX: 0, transformOrigin: "left" }}
                          whileInView={{ scaleX: index === 0 ? 1 : index === 1 ? 0.68 : 0.34 }}
                          viewport={{ once: true, amount: 0.5 }}
                          transition={{ duration: reduceMotion ? 0 : 1, delay: index * 0.12, ease }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="absolute left-8 right-8 top-1/2 h-px bg-[linear-gradient(90deg,transparent,rgba(214,180,95,0.58),transparent)]" />
              <div className="absolute bottom-10 left-10 flex items-center gap-2 rounded-full border border-white/10 bg-black/22 px-3 py-2 text-[0.72rem] font-semibold text-white/74">
                <Layers3 className="h-3.5 w-3.5 text-[#d6b45f]" />
                Execution systems
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function MetricsSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="px-5 py-12 md:px-8 md:py-16">
      <div className="mx-auto grid max-w-[1120px] gap-4 md:grid-cols-3">
        {metrics.map(({ title, body, Icon }) => (
          <motion.div
            key={title}
            data-turnkey-reveal
            whileHover={reduceMotion ? undefined : { y: -5 }}
            transition={{ duration: 0.3, ease }}
            className="rounded-[1rem] border border-[#302a1f]/10 bg-white/52 p-5 shadow-[0_22px_60px_rgba(57,48,31,0.08)]"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#d6b45f]/24 bg-[#d6b45f]/10 text-[#8a6a20]">
              <Icon className="h-4 w-4" />
            </div>
            <h3 className="mt-8 font-display text-[1.34rem] font-semibold leading-tight tracking-[-0.04em] text-[#171512]">{title}</h3>
            <p className="mt-3 text-[0.92rem] leading-6 text-[#625d52]">{body}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="px-5 pb-24 pt-12 md:px-8 md:pb-28 md:pt-16">
      <div
        data-turnkey-reveal
        className="relative mx-auto max-w-[1120px] overflow-hidden rounded-[1.35rem] border border-[#2f2a1f]/10 bg-[#f8f6f1] px-5 py-14 text-center shadow-[0_30px_90px_rgba(57,48,31,0.1)] md:px-10 md:py-20"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(214,180,95,0.18),transparent_34rem),linear-gradient(180deg,rgba(255,255,255,0.82),rgba(245,242,235,0.68))]" />
        <div className="relative z-10 mx-auto max-w-[42rem]">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-[#9a7a2e]">Turnkey Delivery</p>
          <h2 className="mt-5 font-display text-[clamp(2.35rem,5vw,5.4rem)] font-semibold leading-[0.94] tracking-[-0.06em] text-[#161512]">
            Build with structured execution.
          </h2>
          <Link
            href="/book-consultation"
            className="group mt-9 inline-flex min-h-12 items-center justify-center gap-2.5 rounded-[0.7rem] bg-[#11100e] px-5 text-[0.9rem] font-semibold text-[#fff8ec] shadow-[0_18px_52px_rgba(17,16,14,0.24)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_64px_rgba(17,16,14,0.3),0_0_34px_rgba(214,180,95,0.16)]"
          >
            Start Project
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
          <CompanyContactPanel mode="consultation" tone="transparent" compact className="mt-6" />
        </div>
      </div>
    </section>
  );
}

export function TurnkeyProjectsExperience() {
  const rootRef = useRef<HTMLElement>(null);
  const lenis = useLenis();
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const context = gsap.context(() => {
      if (!reduceMotion) {
        gsap.to("[data-turnkey-grid]", {
          y: -28,
          duration: 24,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut"
        });

        gsap.to("[data-turnkey-glow]", {
          xPercent: 10,
          yPercent: -8,
          duration: 14,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut"
        });

        gsap.to("[data-turnkey-parallax]", {
          y: -38,
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: "bottom top",
            scrub: 1.4
          }
        });
      }

      gsap.utils.toArray<HTMLElement>("[data-turnkey-reveal]").forEach((item, index) => {
        gsap.fromTo(
          item,
          { opacity: 0, y: 50, force3D: true },
          {
            opacity: 1,
            y: 0,
            duration: reduceMotion ? 0.01 : 1,
            delay: reduceMotion ? 0 : Math.min(index * 0.035, 0.14),
            ease: "power4.out",
            scrollTrigger: {
              trigger: item,
              start: "top 84%"
            }
          }
        );
      });
    }, root);

    const refreshId = requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      cancelAnimationFrame(refreshId);
      context.revert();
    };
  }, [lenis, reduceMotion]);

  return (
    <article ref={rootRef} className="relative isolate overflow-hidden bg-[#F8F6F1] text-[#171512]">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(180deg,#F8F6F1_0%,#F5F2EB_54%,#FFFDFC_100%)]" />
      <div
        data-turnkey-grid
        className="pointer-events-none absolute -inset-x-12 top-0 -z-10 h-[78rem] opacity-[0.22] will-change-transform [background-image:linear-gradient(rgba(47,42,31,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(47,42,31,0.09)_1px,transparent_1px)] [background-size:64px_64px] [mask-image:linear-gradient(180deg,black,transparent_88%)]"
      />
      <div data-turnkey-glow className="pointer-events-none absolute right-[6%] top-28 -z-10 h-[31rem] w-[31rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(214,180,95,0.23),rgba(255,255,255,0.42)_42%,transparent_70%)] opacity-80 will-change-transform" />

      <section className="relative flex min-h-[88svh] items-center px-5 pb-14 pt-32 md:px-8 lg:pt-36">
        <div className="mx-auto grid w-full max-w-[1120px] gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(22rem,0.9fr)] lg:items-center">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease }}
              className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[#9a7a2e]"
            >
              Turnkey Execution
            </motion.p>
            <h1 className="mt-6 max-w-[640px] font-display text-[clamp(3rem,6.2vw,6.1rem)] font-semibold leading-[0.9] tracking-[-0.06em] text-[#171512]">
              {["End-to-end project", "delivery with", "premium execution."].map((line, index) => (
                <motion.span
                  key={line}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.1 + index * 0.1, ease }}
                  className={index === 2 ? "block text-[#8d7d60]" : "block"}
                >
                  {line}
                </motion.span>
              ))}
            </h1>
            <motion.p
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.38, ease }}
              className="mt-7 max-w-[590px] text-[1rem] leading-7 text-[#5f594f] md:text-[1.08rem]"
            >
            From civil works, MEP, interiors and finishing to landscape, swimming pools, lifts and handover, Ractysh manages turnkey construction systems with operational clarity.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5, ease }}
              className="mt-9 flex flex-col gap-3 sm:flex-row"
            >
              <Link
                href="/book-consultation"
                className="group inline-flex min-h-12 items-center justify-center gap-2.5 rounded-[0.7rem] bg-[#11100e] px-5 text-[0.9rem] font-semibold text-[#fff8ec] shadow-[0_18px_52px_rgba(17,16,14,0.22)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_62px_rgba(17,16,14,0.28),0_0_32px_rgba(214,180,95,0.16)]"
              >
                Start Project
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <ServiceRequestCTA showLabel={false} />
              <Link
                href="#workflow"
                className="group inline-flex min-h-12 items-center justify-center gap-2.5 rounded-[0.7rem] border border-[#2c281e]/14 bg-white/58 px-5 text-[0.9rem] font-semibold text-[#171512] shadow-[0_18px_50px_rgba(57,48,31,0.08)] transition duration-300 hover:-translate-y-1 hover:border-[#d6b45f]/38 hover:bg-white/78"
              >
                View Workflow
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link
                href="#"
                target="_blank"
                className="group inline-flex min-h-12 items-center justify-center gap-2.5 rounded-[0.7rem] border border-[#2c281e]/14 bg-white/58 px-5 text-[0.9rem] font-semibold text-[#171512] shadow-[0_18px_50px_rgba(57,48,31,0.08)] transition duration-300 hover:-translate-y-1 hover:border-[#d6b45f]/38 hover:bg-white/78"
              >
                For More Details, Check This
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </motion.div>
            <CompanyContactPanel mode="consultation" tone="transparent" compact className="mt-6 max-w-4xl" />
          </div>

          <ExecutionDashboard />
        </div>
      </section>

      <ExecutionFlow />
      <ShowcaseBlock />
      <MetricsSection />
      <FinalCTA />
    </article>
  );
}
