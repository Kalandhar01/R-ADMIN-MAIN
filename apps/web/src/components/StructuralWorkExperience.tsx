"use client";

import type { PointerEvent as ReactPointerEvent } from "react";
import { useEffect, useRef } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Building2, Grid3X3, Ruler } from "lucide-react";
import Link from "next/link";
import { CompanyContactPanel } from "@/components/CompanyContactPanel";
import { useLenis } from "@/components/providers/SmoothScrollProvider";
import { ServiceRequestCTA } from "@/components/ServiceRequestCTA";

gsap.registerPlugin(ScrollTrigger);

const ease = [0.22, 1, 0.36, 1] as const;

const flowSteps = ["Planning", "Structural Analysis", "Execution", "Stability Validation"];

const capabilities = [
  {
    title: "Structural Coordination",
    body: "Civil, architectural and site teams aligned through precise structural checkpoints and building approval workflows.",
    Icon: Building2
  },
  {
    title: "PEB Systems",
    body: "Pre-engineered framing, beam logic and support systems organized for build clarity.",
    Icon: Grid3X3
  },
  {
    title: "Load & Stability Testing",
    body: "Load paths, interfaces, soil testing and building stability testing mapped before and during execution.",
    Icon: Ruler
  }
];

function StructuralVisual() {
  const reduceMotion = useReducedMotion();
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const smoothX = useSpring(pointerX, { damping: 34, stiffness: 120, mass: 0.75 });
  const smoothY = useSpring(pointerY, { damping: 34, stiffness: 120, mass: 0.75 });
  const rotateX = useTransform(smoothY, [-0.5, 0.5], [1.8, -1.8]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-2.4, 2.4]);
  const x = useTransform(smoothX, [-0.5, 0.5], [-6, 6]);
  const y = useTransform(smoothY, [-0.5, 0.5], [-5, 5]);

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (reduceMotion) return;
    const rect = event.currentTarget.getBoundingClientRect();
    pointerX.set((event.clientX - rect.left) / rect.width - 0.5);
    pointerY.set((event.clientY - rect.top) / rect.height - 0.5);
  };

  const columns = ["left-[18%]", "left-[38%]", "left-[58%]", "left-[78%]"];
  const beams = ["top-[24%]", "top-[42%]", "top-[60%]", "top-[78%]"];

  return (
    <motion.div
      data-structural-parallax
      initial={{ opacity: 0, y: 40, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 1, delay: 0.22, ease }}
      onPointerMove={handlePointerMove}
      onPointerLeave={() => {
        pointerX.set(0);
        pointerY.set(0);
      }}
      className="relative mx-auto w-full max-w-[34rem]"
      style={{ perspective: 1100 }}
    >
      <motion.div animate={reduceMotion ? undefined : { y: [0, -10, 0] }} transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}>
        <motion.div
          style={reduceMotion ? undefined : { rotateX, rotateY, x, y, transformStyle: "preserve-3d" }}
          className="relative min-h-[30rem] overflow-hidden rounded-[1.35rem] border border-[#28241c]/10 bg-[#fffdf8]/70 p-4 shadow-[0_34px_90px_rgba(45,38,25,0.12),inset_0_1px_0_rgba(255,255,255,0.72)]"
        >
        <div className="absolute inset-0 opacity-75" style={{ backgroundImage: "url('/HeaderBG.webp')", backgroundSize: "cover", backgroundPosition: "center" }} />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(214,180,95,0.2),transparent_34%),linear-gradient(135deg,rgba(255,255,255,0.76),rgba(236,231,221,0.72))]" />
        <div className="absolute inset-6 rounded-[1rem] border border-[#28241c]/10" />

        <div className="relative z-10 h-[27rem] rounded-[1rem] border border-[#28241c]/8 bg-[#f8f6f1]/54">
          <div className="absolute inset-0 opacity-[0.24] [background-image:linear-gradient(rgba(42,38,30,0.16)_1px,transparent_1px),linear-gradient(90deg,rgba(42,38,30,0.12)_1px,transparent_1px)] [background-size:34px_34px]" />
          <div className="absolute left-5 top-5 rounded-full border border-[#28241c]/10 bg-white/58 px-3 py-1.5 text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-[#8b6c22]">
            Structural Grid
          </div>

          <div className="absolute inset-x-10 bottom-12 top-20">
            {columns.map((position, index) => (
              <motion.span
                key={position}
                className={`absolute ${position} top-0 h-full w-px bg-[linear-gradient(180deg,transparent,#1d1a14_14%,#d6b45f_50%,#1d1a14_86%,transparent)]`}
                animate={reduceMotion ? undefined : { opacity: [0.52, 0.92, 0.52] }}
                transition={{ duration: 4.4, repeat: Infinity, ease: "easeInOut", delay: index * 0.18 }}
              />
            ))}
            {beams.map((position, index) => (
              <motion.span
                key={position}
                className={`absolute ${position} left-0 h-px w-full bg-[linear-gradient(90deg,transparent,#1d1a14_12%,#d6b45f_50%,#1d1a14_88%,transparent)]`}
                animate={reduceMotion ? undefined : { opacity: [0.46, 0.86, 0.46] }}
                transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut", delay: index * 0.16 }}
              />
            ))}
            <span className="absolute left-[18%] top-[24%] h-[54%] w-px origin-top rotate-[-22deg] bg-[#8d7a4e]/58" />
            <span className="absolute right-[20%] top-[24%] h-[54%] w-px origin-top rotate-[22deg] bg-[#8d7a4e]/58" />
            <span className="absolute left-0 right-0 bottom-0 h-2 rounded-full bg-[linear-gradient(90deg,transparent,rgba(29,26,20,0.34),rgba(214,180,95,0.48),rgba(29,26,20,0.34),transparent)]" />
          </div>

          <div className="absolute bottom-5 left-5 right-5 grid grid-cols-3 gap-2">
            {["Load Path", "Beam Grid", "QA Check"].map((label, index) => (
              <div key={label} className="rounded-[0.65rem] border border-[#28241c]/8 bg-white/58 p-3">
                <p className="text-[0.56rem] font-semibold uppercase tracking-[0.14em] text-[#8b6c22]">0{index + 1}</p>
                <p className="mt-2 truncate text-[0.78rem] font-semibold text-[#26231c]">{label}</p>
              </div>
            ))}
          </div>

          <motion.div
            className="absolute right-6 top-20 flex items-center gap-2 rounded-full border border-[#d6b45f]/24 bg-[#181612] px-3 py-2 text-[0.68rem] font-semibold text-[#fff8ec] shadow-[0_18px_42px_rgba(24,22,18,0.16)]"
            animate={reduceMotion ? undefined : { opacity: [0.78, 1, 0.78] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#d6b45f]" />
            Stable
          </motion.div>
        </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

function EngineeringFlow() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="systems" className="px-5 py-12 md:px-8 md:py-16">
      <div className="mx-auto max-w-[1120px]">
        <div data-structural-reveal className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-[#8b6c22]">Engineering Flow</p>
            <h2 className="mt-3 max-w-[34rem] font-display text-[clamp(2rem,4vw,3.8rem)] font-semibold leading-[0.98] tracking-[-0.052em] text-[#171512]">
              Structural execution without noise.
            </h2>
          </div>
          <p className="max-w-[25rem] text-[0.96rem] leading-7 text-[#5d584d]">
            A compact framework keeps analysis, site execution and validation connected through clear checkpoints.
          </p>
        </div>

        <div data-structural-reveal className="relative mt-10 rounded-[1.05rem] border border-[#302a1f]/10 bg-white/48 p-5 shadow-[0_24px_70px_rgba(57,48,31,0.08)]">
          <div className="absolute left-8 right-8 top-[3.1rem] hidden h-px bg-[#302a1f]/12 md:block" />
          <motion.div
            className="absolute left-8 top-[3.1rem] hidden h-px w-20 bg-[linear-gradient(90deg,transparent,#d6b45f,transparent)] md:block"
            animate={reduceMotion ? undefined : { x: ["0%", "900%"], opacity: [0, 1, 0] }}
            transition={{ duration: 5.8, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="grid gap-4 md:grid-cols-4">
            {flowSteps.map((step, index) => (
              <motion.div
                key={step}
                whileHover={reduceMotion ? undefined : { y: -4 }}
                transition={{ duration: 0.28, ease }}
                className="relative rounded-[0.85rem] border border-[#302a1f]/8 bg-[#fffdf8]/76 p-4 shadow-[0_18px_45px_rgba(57,48,31,0.07)]"
              >
                <div className="flex items-center gap-3">
                  <span className="relative flex h-8 w-8 items-center justify-center rounded-full border border-[#d6b45f]/34 bg-[#f3ead7] text-[0.72rem] font-bold text-[#755a18]">
                    {index + 1}
                    {index === 1 ? <span className="absolute inset-0 rounded-full shadow-[0_0_24px_rgba(214,180,95,0.45)]" /> : null}
                  </span>
                  <h3 className="font-display text-[1.04rem] font-semibold tracking-[-0.035em] text-[#171512]">{step}</h3>
                </div>
                <p className="mt-5 text-[0.84rem] leading-6 text-[#666054]">
                  {index === 0
                    ? "Site, scope and design intent are mapped before technical work begins."
                    : index === 1
                      ? "Load paths, beam logic and interfaces are reviewed with precision."
                      : index === 2
                        ? "Structural activity moves through controlled site sequencing."
                        : "Final checks validate stability, quality and documentation."}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function CapabilitiesSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="px-5 py-12 md:px-8 md:py-16">
      <div className="mx-auto max-w-[1120px]">
        <div data-structural-reveal className="max-w-[38rem]">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-[#8b6c22]">Core Capabilities</p>
          <h2 className="mt-3 font-display text-[clamp(2.1rem,4vw,4rem)] font-semibold leading-[0.98] tracking-[-0.052em] text-[#171512]">
            Clean systems for structural certainty.
          </h2>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {capabilities.map(({ title, body, Icon }) => (
            <motion.article
              key={title}
              data-structural-reveal
              whileHover={reduceMotion ? undefined : { y: -5 }}
              transition={{ duration: 0.3, ease }}
              className="rounded-[1rem] border border-[#302a1f]/10 bg-[#fffdf8]/66 p-5 shadow-[0_22px_60px_rgba(57,48,31,0.08)]"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#d6b45f]/24 bg-[#d6b45f]/10 text-[#80621d]">
                <Icon className="h-4 w-4" />
              </div>
              <h3 className="mt-8 font-display text-[1.34rem] font-semibold leading-tight tracking-[-0.04em] text-[#171512]">{title}</h3>
              <p className="mt-3 text-[0.92rem] leading-6 text-[#625d52]">{body}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="px-5 pb-24 pt-12 md:px-8 md:pb-28 md:pt-16">
      <div
        data-structural-reveal
        className="relative mx-auto max-w-[1120px] overflow-hidden rounded-[1.35rem] border border-[#302a1f]/10 bg-[#f8f6f1] px-5 py-14 text-center shadow-[0_30px_90px_rgba(57,48,31,0.1)] md:px-10 md:py-20"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(214,180,95,0.16),transparent_34rem),linear-gradient(180deg,rgba(255,255,255,0.78),rgba(236,231,221,0.66))]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.18] [background-image:linear-gradient(rgba(47,42,31,0.14)_1px,transparent_1px),linear-gradient(90deg,rgba(47,42,31,0.1)_1px,transparent_1px)] [background-size:46px_46px]" />
        <div className="relative z-10 mx-auto max-w-[42rem]">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-[#8b6c22]">Structural Execution</p>
          <h2 className="mt-5 font-display text-[clamp(2.35rem,5vw,5.4rem)] font-semibold leading-[0.94] tracking-[-0.06em] text-[#161512]">
            Build on engineered clarity.
          </h2>
          <Link
            href="/book-consultation"
            className="group mt-9 inline-flex min-h-12 items-center justify-center gap-2.5 rounded-[0.7rem] bg-[#11100e] px-5 text-[0.9rem] font-semibold text-[#fff8ec] shadow-[0_18px_52px_rgba(17,16,14,0.24)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_64px_rgba(17,16,14,0.3),0_0_34px_rgba(214,180,95,0.14)]"
          >
            Start Consultation
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
          <CompanyContactPanel mode="consultation" tone="transparent" compact className="mt-6" />
        </div>
      </div>
    </section>
  );
}

export function StructuralWorkExperience() {
  const rootRef = useRef<HTMLElement>(null);
  const lenis = useLenis();
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const context = gsap.context(() => {
      if (!reduceMotion) {
        gsap.to("[data-structural-grid]", {
          y: -24,
          duration: 24,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut"
        });

        gsap.to("[data-structural-glow]", {
          xPercent: 8,
          yPercent: -7,
          duration: 15,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut"
        });

        gsap.to("[data-structural-parallax]", {
          y: -34,
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: "bottom top",
            scrub: 1.35
          }
        });
      }

      gsap.utils.toArray<HTMLElement>("[data-structural-reveal]").forEach((item, index) => {
        gsap.fromTo(
          item,
          { opacity: 0, y: 40, force3D: true },
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
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(180deg,#F8F6F1_0%,#F5F2EB_52%,#ECE7DD_100%)]" />
      <div
        data-structural-grid
        className="pointer-events-none absolute -inset-x-12 top-0 -z-10 h-[70rem] opacity-[0.2] will-change-transform [background-image:linear-gradient(rgba(47,42,31,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(47,42,31,0.08)_1px,transparent_1px)] [background-size:62px_62px] [mask-image:linear-gradient(180deg,black,transparent_88%)]"
      />
      <div data-structural-glow className="pointer-events-none absolute right-[6%] top-28 -z-10 h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(214,180,95,0.19),rgba(255,255,255,0.4)_42%,transparent_70%)] opacity-80 will-change-transform" />

      <section className="relative flex min-h-[88svh] items-center px-5 pb-14 pt-32 md:px-8 lg:pt-36">
        <div className="mx-auto grid w-full max-w-[1120px] gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(22rem,0.9fr)] lg:items-center">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease }}
              className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[#8b6c22]"
            >
              Structural Systems
            </motion.p>
            <h1 className="mt-6 max-w-[660px] font-display text-[clamp(3rem,6.2vw,6.1rem)] font-semibold leading-[0.9] tracking-[-0.06em] text-[#171512]">
              {["Engineered for", "strength, precision", "and execution."].map((line, index) => (
                <motion.span
                  key={line}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.1 + index * 0.1, ease }}
                  className={index === 2 ? "block text-[#827456]" : "block"}
                >
                  {line}
                </motion.span>
              ))}
            </h1>
            <motion.p
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.38, ease }}
              className="mt-7 max-w-[620px] text-[1rem] leading-7 text-[#5f594f] md:text-[1.08rem]"
            >
               Structural coordination, engineering systems, land survey, soil testing and building stability testing designed for premium residential and commercial infrastructure.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5, ease }}
              className="mt-9 flex flex-col gap-3 sm:flex-row"
            >
              <Link
                href="/book-consultation"
                className="group inline-flex min-h-12 items-center justify-center gap-2.5 rounded-[0.7rem] bg-[#11100e] px-5 text-[0.9rem] font-semibold text-[#fff8ec] shadow-[0_18px_52px_rgba(17,16,14,0.22)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_62px_rgba(17,16,14,0.28),0_0_32px_rgba(214,180,95,0.14)]"
              >
                Start Consultation
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <ServiceRequestCTA showLabel={false} />
              <Link
                href="#systems"
                className="group inline-flex min-h-12 items-center justify-center gap-2.5 rounded-[0.7rem] border border-[#2c281e]/14 bg-white/56 px-5 text-[0.9rem] font-semibold text-[#171512] shadow-[0_18px_50px_rgba(57,48,31,0.08)] transition duration-300 hover:-translate-y-1 hover:border-[#d6b45f]/38 hover:bg-white/78"
              >
                View Systems
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link
                href="#"
                target="_blank"
                className="group inline-flex min-h-12 items-center justify-center gap-2.5 rounded-[0.7rem] border border-[#2c281e]/14 bg-white/56 px-5 text-[0.9rem] font-semibold text-[#171512] shadow-[0_18px_50px_rgba(57,48,31,0.08)] transition duration-300 hover:-translate-y-1 hover:border-[#d6b45f]/38 hover:bg-white/78"
              >
                For More Details, Check This
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </motion.div>
            <CompanyContactPanel mode="consultation" tone="transparent" compact className="mt-6 max-w-4xl" />
          </div>

          <StructuralVisual />
        </div>
      </section>

      <EngineeringFlow />
      <CapabilitiesSection />
      <FinalCTA />
    </article>
  );
}
