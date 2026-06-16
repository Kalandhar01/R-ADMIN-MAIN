"use client";

import type { PointerEvent as ReactPointerEvent } from "react";
import { useEffect, useRef } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import {
  ArrowRight,
  Building2,
  DraftingCompass,
  Gauge,
  Globe2,
  HardHat,
  Layers3,
  Network,
  ShieldCheck,
  type LucideIcon
} from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CompanyContactPanel } from "@/components/CompanyContactPanel";
import { useLenis } from "@/components/providers/SmoothScrollProvider";

gsap.registerPlugin(ScrollTrigger);

interface EcosystemObject {
  label: string;
  detail: string;
  status: string;
  Icon: LucideIcon;
  className: string;
  depth: number;
  delay: number;
  duration: number;
}

const ecosystemObjects: EcosystemObject[] = [
  {
    label: "Architecture Layer",
    detail: "Design intelligence",
    status: "Synced",
    Icon: DraftingCompass,
    className: "left-[4%] top-[12%] w-[3.4rem] sm:left-[5%] sm:top-[8%] sm:w-[11rem]",
    depth: 92,
    delay: 0,
    duration: 9.8
  },
  {
    label: "Construction",
    detail: "25+ services",
    status: "Live",
    Icon: HardHat,
    className: "right-[4%] top-[17%] w-[3.4rem] sm:right-[5%] sm:top-[9%] sm:w-[10.8rem]",
    depth: 126,
    delay: 0.4,
    duration: 10.6
  },
  {
    label: "Real Estate",
    detail: "Asset strategy",
    status: "Mapped",
    Icon: Building2,
    className: "right-[5%] bottom-[14%] w-[3.4rem] sm:right-[7%] sm:bottom-[16%] sm:w-[12rem]",
    depth: 112,
    delay: 0.8,
    duration: 9.4
  },
  {
    label: "Export + OTC",
    detail: "Trade and private desk",
    status: "Active",
    Icon: Globe2,
    className: "bottom-[10%] left-[6%] w-[3.4rem] sm:bottom-[14%] sm:left-[8%] sm:w-[11.8rem]",
    depth: 78,
    delay: 1.05,
    duration: 11.2
  }
];

const coreRows = [
  { label: "Construction sync", value: "Live", progress: "76%" },
  { label: "Real estate layer", value: "Mapped", progress: "68%" },
  { label: "Trade and OTC desk", value: "Active", progress: "88%" }
];

const headingLines = ["Transform", "Five-Pillar", "Enterprise", "Operations"];

export function FinalCTASection() {
  const rootRef = useRef<HTMLElement>(null);
  const lenis = useLenis();

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const context = gsap.context(() => {
      gsap.to("[data-final-grid], [data-system-grid]", {
        y: -24,
        duration: 22,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });

      gsap.to("[data-final-light], [data-system-light]", {
        xPercent: 22,
        yPercent: -14,
        duration: 14,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });

      gsap.to("[data-system-beam]", {
        xPercent: 32,
        duration: 16,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });

      gsap.utils.toArray<HTMLElement>("[data-ecosystem-depth]").forEach((layer) => {
        const depth = Number(layer.dataset.depth || 1);

        gsap.to(layer, {
          x: depth * 0.06,
          y: depth * -0.12,
          z: depth * 0.36,
          rotateX: depth * 0.012,
          rotateY: depth * -0.012,
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.2
          }
        });
      });

      gsap.to("[data-ecosystem-stage]", {
        y: -14,
        rotateX: 1,
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.35
        }
      });
    }, root);

    const refreshId = requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      cancelAnimationFrame(refreshId);
      context.revert();
    };
  }, [lenis]);

  return (
    <section
      ref={rootRef}
      id="contact"
      className="relative isolate flex min-h-screen items-center overflow-hidden bg-[#F8F6F1] px-5 py-[92px] text-[#181512] sm:px-6 md:px-8 md:py-[122px]"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_72%_24%,rgba(214,180,95,0.2),transparent_32rem),radial-gradient(circle_at_18%_72%,rgba(255,252,247,0.95),transparent_30rem),linear-gradient(135deg,#FFFCF7_0%,#F8F6F1_48%,#F4F1EA_100%)]" />
      <div
        data-final-grid
        className="pointer-events-none absolute -inset-x-8 -inset-y-16 opacity-100 will-change-transform [background-image:linear-gradient(rgba(0,0,0,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.035)_1px,transparent_1px)] [background-size:58px_58px]"
      />
      <div className="pointer-events-none absolute inset-0 opacity-[0.1] [background-image:radial-gradient(circle,rgba(154,116,40,0.42)_1px,transparent_1.4px)] [background-size:38px_38px] [mask-image:radial-gradient(circle_at_70%_44%,black,transparent_68%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(214,180,95,0.42),transparent)]" />
      <div
        data-final-light
        className="pointer-events-none absolute right-[7%] top-[16%] h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(214,180,95,0.2),rgba(255,252,247,0.36)_38%,transparent_68%)] opacity-80 will-change-transform"
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-44 bg-[linear-gradient(180deg,transparent,rgba(255,252,247,0.78))]" />

      <motion.div
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.28 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 mx-auto grid w-full max-w-[1240px] gap-14 lg:grid-cols-[minmax(0,0.86fr)_minmax(24rem,1.06fr)] lg:items-center xl:gap-20"
      >
        <div>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.64 }}
            transition={{ duration: 0.92, ease: [0.22, 1, 0.36, 1] }}
            className="text-[0.78rem] font-semibold uppercase tracking-[0.26em] text-[#9A7428]"
          >
            Enterprise Transformation
          </motion.p>
          <h2
            aria-label="Transform Five-Pillar Enterprise Operations"
            className="mt-6 max-w-[760px] font-display text-[clamp(2.95rem,5.35vw,5.6rem)] font-[650] leading-[0.9] tracking-[-0.045em] text-[#181512]"
          >
            {headingLines.map((line, index) => (
              <motion.span
                key={line}
                aria-hidden="true"
                initial={{ opacity: 0, y: 80 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.62 }}
                transition={{ duration: 1.2, delay: 0.08 + index * 0.11, ease: [0.22, 1, 0.36, 1] }}
                className={index === headingLines.length - 1 ? "block text-[#74675b]" : "block"}
              >
                {line}
              </motion.span>
            ))}
          </h2>
          <motion.p
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.62 }}
            transition={{ duration: 0.95, delay: 0.34, ease: [0.22, 1, 0.36, 1] }}
            className="mt-7 max-w-[610px] text-[1rem] font-medium leading-7 text-[#665f55] md:text-[1.08rem]"
          >
            Bring Architecture, Construction, Real Estate, Export-Import and OTC Exchange workflows into a single
            premium operating ecosystem.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.62 }}
            transition={{ duration: 0.9, delay: 0.46, ease: [0.22, 1, 0.36, 1] }}
            className="mt-10 flex flex-col gap-3 sm:flex-row"
          >
            <motion.a
              href="/book-consultation"
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.985 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="group inline-flex min-h-[3rem] items-center justify-center gap-2.5 rounded-[0.6rem] border border-[#181512]/10 bg-[#090807] px-5 text-[0.9rem] font-semibold text-[#fff8ec] shadow-[0_18px_48px_rgba(24,21,18,0.18),0_0_28px_rgba(214,180,95,0.16),inset_0_1px_0_rgba(255,255,255,0.08)] transition-[box-shadow,border-color] duration-300 hover:border-[#d6b45f]/62 hover:shadow-[0_22px_56px_rgba(24,21,18,0.24),0_0_38px_rgba(214,180,95,0.24)]"
            >
              <span>Book a Demo</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={2.3} />
            </motion.a>
            <motion.a
              href="#enterprise-solutions"
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.985 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="group inline-flex min-h-[3rem] items-center justify-center gap-2.5 rounded-[0.6rem] border border-[#d6b45f]/30 bg-[#fffdf8]/58 px-5 text-[0.9rem] font-semibold text-[#181512] shadow-[0_16px_44px_rgba(98,78,34,0.08),inset_0_1px_0_rgba(255,255,255,0.88)] transition-[box-shadow,border-color,background-color] duration-300 hover:border-[#d6b45f]/48 hover:bg-white/76 hover:shadow-[0_22px_56px_rgba(98,78,34,0.12),0_0_30px_rgba(214,180,95,0.12)]"
            >
              <span>Explore Ecosystem</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={2.3} />
            </motion.a>
          </motion.div>
          <CompanyContactPanel mode="consultation" tone="transparent" compact className="mt-6 max-w-4xl" />
        </div>

        <EnterpriseTransformationVisual />
      </motion.div>
    </section>
  );
}

function EnterpriseTransformationVisual() {
  const reduceMotion = useReducedMotion();
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const smoothX = useSpring(pointerX, { damping: 32, stiffness: 120, mass: 0.7 });
  const smoothY = useSpring(pointerY, { damping: 32, stiffness: 120, mass: 0.7 });
  const sceneRotateX = useTransform(smoothY, [-0.5, 0.5], [2.4, -2.4]);
  const sceneRotateY = useTransform(smoothX, [-0.5, 0.5], [-3.6, 3.6]);
  const sceneX = useTransform(smoothX, [-0.5, 0.5], [-8, 8]);
  const sceneY = useTransform(smoothY, [-0.5, 0.5], [-6, 6]);

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (reduceMotion) return;

    const rect = event.currentTarget.getBoundingClientRect();
    pointerX.set((event.clientX - rect.left) / rect.width - 0.5);
    pointerY.set((event.clientY - rect.top) / rect.height - 0.5);
  };

  const resetPointer = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  return (
    <div
      onPointerLeave={resetPointer}
      onPointerMove={handlePointerMove}
      aria-hidden="true"
      className="relative min-h-[520px] overflow-hidden rounded-[1.55rem] border border-[#d4af37]/14 bg-white/45 p-4 shadow-[0_40px_130px_rgba(98,78,34,0.13),inset_0_1px_0_rgba(255,255,255,0.9)] sm:min-h-[610px] sm:p-6"
      style={{ perspective: "1500px" }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(255,255,255,0.92),transparent_34%),radial-gradient(circle_at_56%_58%,rgba(214,180,95,0.18),transparent_36%),radial-gradient(circle_at_82%_72%,rgba(139,17,24,0.06),transparent_34%),linear-gradient(145deg,rgba(255,252,247,0.68),rgba(244,241,234,0.38))]" />
      <div
        data-system-grid
        className="pointer-events-none absolute -inset-10 opacity-100 will-change-transform [background-image:linear-gradient(rgba(0,0,0,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.035)_1px,transparent_1px)] [background-size:38px_38px]"
      />
      <div
        data-system-light
        className="pointer-events-none absolute left-1/2 top-[18%] h-[31rem] w-[31rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(214,180,95,0.22),rgba(255,255,255,0.28)_34%,transparent_66%)] opacity-80 will-change-transform"
      />
      <div
        data-system-beam
        className="pointer-events-none absolute left-[-18%] top-[28%] h-[26rem] w-[48rem] -rotate-[18deg] bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.46),rgba(214,180,95,0.12),transparent)] opacity-70 will-change-transform"
      />
      <div className="pointer-events-none absolute inset-[1.05rem] rounded-[1.2rem] border border-[#d4af37]/14 shadow-[inset_0_0_34px_rgba(255,255,255,0.52)]" />
      <div className="pointer-events-none absolute left-7 right-7 top-8 h-px bg-gradient-to-r from-transparent via-[#d6b45f]/48 to-transparent" />
      <div className="pointer-events-none absolute bottom-8 left-8 right-8 h-px bg-gradient-to-r from-transparent via-[#181512]/10 to-transparent" />
      {[0, 1, 2, 3, 4, 5].map((item) => (
        <motion.span
          key={item}
          animate={reduceMotion ? undefined : { opacity: [0.18, 0.48, 0.18], y: [0, -10, 0] }}
          transition={{ duration: 5.8 + item * 0.4, delay: item * 0.45, repeat: Infinity, ease: "easeInOut" }}
          className="absolute h-1.5 w-1.5 rounded-full bg-[#d6b45f] shadow-[0_0_18px_rgba(214,180,95,0.42)] will-change-[opacity,transform]"
          style={{
            left: `${18 + item * 12}%`,
            top: `${18 + (item % 3) * 19}%`
          }}
        />
      ))}

      <motion.div
        data-ecosystem-stage
        className="absolute inset-0 will-change-transform [backface-visibility:hidden] [transform-style:preserve-3d]"
        style={reduceMotion ? undefined : { x: sceneX, y: sceneY, rotateX: sceneRotateX, rotateY: sceneRotateY }}
      >
        <div className="absolute left-[13%] right-[13%] top-[54%] h-px bg-gradient-to-r from-transparent via-[#d6b45f]/34 to-transparent [transform:translateZ(24px)_rotate(-7deg)]" />
        <div className="absolute left-[16%] right-[16%] top-[43%] h-px bg-gradient-to-r from-transparent via-white/80 to-transparent [transform:translateZ(86px)_rotate(7deg)]" />
        <div className="absolute left-[18%] top-[23%] h-[55%] w-px bg-gradient-to-b from-transparent via-[#9a7428]/18 to-transparent [transform:translateZ(36px)_rotate(17deg)]" />
        <div className="absolute right-[18%] top-[20%] h-[59%] w-px bg-gradient-to-b from-transparent via-[#9a7428]/16 to-transparent [transform:translateZ(38px)_rotate(-17deg)]" />
        <div className="absolute left-[20%] right-[20%] top-[34%] h-[32%] rounded-full border border-[#d6b45f]/18 [transform:translateZ(46px)_rotateX(62deg)]" />
        <div className="absolute left-[12%] right-[12%] top-[27%] h-[48%] rounded-full border border-[#181512]/8 [transform:translateZ(10px)_rotateX(66deg)]" />

        <div
          data-ecosystem-depth
          data-depth="20"
          className="absolute inset-x-[12%] bottom-[5%] h-[45%] rounded-[1rem] border border-[#d4af37]/14 bg-white/32 will-change-transform [transform:translateZ(-34px)_rotateX(68deg)]"
        />

        <div className="absolute left-1/2 top-1/2 z-40 w-[75%] max-w-[25rem] -translate-x-1/2 -translate-y-1/2 [transform-style:preserve-3d]">
          <div
            data-ecosystem-depth
            data-depth="150"
            className="will-change-transform [backface-visibility:hidden] [transform-style:preserve-3d]"
          >
            <motion.div
              animate={reduceMotion ? undefined : { y: [0, -14, 0], rotateY: [-1.25, 1.25, -1.25] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
              className="will-change-transform [backface-visibility:hidden] [transform-style:preserve-3d]"
            >
              <div className="relative overflow-hidden rounded-[1.45rem] border border-[#d4af37]/14 bg-white/58 p-4 text-[#211b17] shadow-[0_42px_120px_rgba(98,78,34,0.18),0_0_72px_rgba(214,180,95,0.14),inset_0_1px_0_rgba(255,255,255,0.94)] sm:p-5">
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.9),rgba(255,255,255,0.28)_44%,rgba(214,180,95,0.13))]" />
              <div className="pointer-events-none absolute inset-0 opacity-[0.16] [background-image:linear-gradient(rgba(154,116,40,0.32)_1px,transparent_1px),linear-gradient(90deg,rgba(154,116,40,0.24)_1px,transparent_1px)] [background-size:22px_22px]" />
              <motion.span
                animate={reduceMotion ? undefined : { x: ["-140%", "160%"] }}
                transition={{ duration: 6.4, repeat: Infinity, repeatDelay: 4.5, ease: "easeInOut" }}
                className="pointer-events-none absolute -top-12 bottom-[-24%] w-20 -rotate-12 bg-gradient-to-r from-transparent via-white/58 to-transparent opacity-70 will-change-transform"
              />

              <div className="relative z-10 flex items-start justify-between gap-4">
                <div>
                  <p className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-[#9a7428]">
                    Enterprise Core
                  </p>
                  <h3 className="mt-2.5 max-w-[13rem] font-display text-[1.35rem] font-semibold leading-[1.04] tracking-normal text-[#211b17] sm:text-[1.62rem]">
                    Operating ecosystem control
                  </h3>
                </div>
                <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-[0.9rem] border border-[#d6b45f]/28 bg-[#181512] text-[#fff7df] shadow-[0_18px_44px_rgba(33,27,23,0.16)]">
                  <Network className="h-5 w-5" strokeWidth={1.8} />
                  <motion.span
                    animate={reduceMotion ? undefined : { opacity: [0.34, 0, 0.34], scale: [1, 1.85, 1] }}
                    transition={{ duration: 2.8, repeat: Infinity, ease: "easeOut" }}
                    className="absolute inset-0 rounded-[0.9rem] border border-[#d6b45f]/45"
                  />
                </div>
              </div>

              <div className="relative z-10 mt-5 grid gap-2.5">
                {coreRows.map((row) => (
                  <div key={row.label} className="rounded-[0.75rem] border border-[#2d281f]/10 bg-white/46 p-2.5">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-[0.7rem] font-semibold text-[#3c352e]">{row.label}</span>
                      <span className="text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-[#9a7428]">
                        {row.value}
                      </span>
                    </div>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#2d281f]/8">
                      <span
                        className="relative block h-full rounded-full bg-[linear-gradient(90deg,#9a7428,#d6b45f)]"
                        style={{ width: row.progress }}
                      >
                        <motion.span
                          animate={reduceMotion ? undefined : { x: ["-120%", "180%"] }}
                          transition={{ duration: 2.8, repeat: Infinity, repeatDelay: 1.8, ease: "easeInOut" }}
                          className="absolute inset-y-0 w-12 bg-gradient-to-r from-transparent via-white/48 to-transparent will-change-transform"
                        />
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="relative z-10 mt-4 rounded-[0.9rem] border border-[#d4af37]/14 bg-white/48 p-3 text-[#181512] shadow-[inset_0_1px_0_rgba(255,255,255,0.78)]">
                <div className="flex items-center justify-between">
                  <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-[#9a7428]">
                    Execution pipeline
                  </p>
                  <span className="flex items-center gap-1.5 text-[0.58rem] font-semibold uppercase tracking-[0.14em] text-[#74675b]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#d6b45f] shadow-[0_0_12px_rgba(214,180,95,0.5)]" />
                    Syncing
                  </span>
                </div>
                <div className="mt-4 grid grid-cols-4 gap-2">
                  {["Plan", "Design", "Build", "Handover"].map((step, index) => (
                    <div key={step} className="relative min-h-12 rounded-[0.65rem] border border-[#181512]/8 bg-[#fffaf0]/58 p-2">
                      <span className="text-[0.56rem] font-semibold uppercase tracking-[0.12em] text-[#74675b]">
                        {step}
                      </span>
                      <motion.span
                        animate={reduceMotion ? undefined : { opacity: [0.2, 1, 0.2], scaleX: [0.35, 1, 0.35] }}
                        transition={{ duration: 2.6, delay: index * 0.22, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute bottom-2 left-2 right-2 h-px origin-left bg-[#d6b45f] will-change-[opacity,transform]"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative z-10 mt-4 grid grid-cols-3 gap-2">
                {[
                  { label: "Build", Icon: Building2 },
                  { label: "Pulse", Icon: Gauge },
                  { label: "Trust", Icon: ShieldCheck }
                ].map(({ label, Icon }) => (
                  <div
                    key={label}
                    className="flex min-h-14 flex-col items-center justify-center rounded-[0.72rem] border border-[#d6b45f]/20 bg-[#fff8ea]/64 text-center"
                  >
                    <Icon className="h-4 w-4 text-[#9a7428]" strokeWidth={1.8} />
                    <span className="mt-1.5 text-[0.58rem] font-semibold uppercase tracking-[0.12em] text-[#645a4e]">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
              </div>
            </motion.div>
          </div>
        </div>

        {ecosystemObjects.map((object, index) => (
          <EcosystemObjectLayer key={object.label} index={index} object={object} reduceMotion={Boolean(reduceMotion)} />
        ))}

        <div className="absolute bottom-[7%] right-[7%] z-50 flex items-center gap-2 rounded-full border border-[#d4af37]/18 bg-white/58 px-3 py-2 text-[#181512] shadow-[0_18px_52px_rgba(98,78,34,0.11)] [transform:translateZ(158px)] sm:bottom-[8%] sm:right-[9%] sm:px-4">
          <Layers3 className="h-4 w-4 text-[#9a7428]" strokeWidth={1.8} />
          <span className="text-[0.62rem] font-semibold uppercase tracking-[0.15em] sm:text-[0.7rem]">System live</span>
        </div>
      </motion.div>
    </div>
  );
}

function EcosystemObjectLayer({
  index,
  object,
  reduceMotion
}: {
  index: number;
  object: EcosystemObject;
  reduceMotion: boolean;
}) {
  const Icon = object.Icon;

  return (
    <div className={`absolute z-20 ${object.className} [transform-style:preserve-3d]`}>
      <div
        data-ecosystem-depth
        data-depth={object.depth}
        className="will-change-transform [backface-visibility:hidden] [transform-style:preserve-3d]"
      >
        <motion.div
          animate={reduceMotion ? undefined : { y: [0, -10, 0], opacity: [0.78, 0.96, 0.78] }}
          transition={{ duration: object.duration, delay: object.delay, repeat: Infinity, ease: "easeInOut" }}
          className="will-change-transform [backface-visibility:hidden] [transform-style:preserve-3d]"
        >
          <div className="relative inline-flex overflow-hidden rounded-full border border-[#d4af37]/14 bg-white/58 p-2.5 text-[#211b17] shadow-[0_24px_68px_rgba(98,78,34,0.12),inset_0_1px_0_rgba(255,255,255,0.86)]">
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.9),rgba(255,255,255,0.28)_48%,rgba(214,180,95,0.12))]" />
            <div className="relative z-10 flex items-center gap-2.5">
              <span className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#d6b45f]/30 bg-[#fffdf8]/76 text-[#9a7428] shadow-[0_12px_28px_rgba(111,84,24,0.09)]">
                <Icon className="h-3.5 w-3.5" strokeWidth={1.8} />
                <motion.span
                  animate={reduceMotion ? undefined : { opacity: [0.22, 0, 0.22], scale: [1, 2.15, 1] }}
                  transition={{ duration: 2.6, delay: index * 0.28, repeat: Infinity, ease: "easeOut" }}
                  className="absolute inset-0 rounded-full border border-[#d6b45f]/42"
                />
              </span>
              <div className="hidden min-w-0">
                <p className="truncate text-[0.52rem] font-semibold uppercase tracking-[0.12em] text-[#9a7428]">
                  {object.status}
                </p>
                <p className="mt-1 truncate text-[0.72rem] font-semibold leading-tight text-[#262018] sm:text-[0.78rem]">
                  {object.label}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
