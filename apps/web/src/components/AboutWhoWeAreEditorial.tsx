"use client";

import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

interface AboutWhoWeAreEditorialProps {
  sectionId?: string;
  anchorId?: string;
}

const revealTransition = {
  duration: 0.95,
  ease: [0.22, 1, 0.36, 1] as const
};

export function AboutWhoWeAreEditorial({
  sectionId = "about-who-we-are",
  anchorId = "about-who-we-are-anchor"
}: AboutWhoWeAreEditorialProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  const imageY = useTransform(scrollYProgress, [0, 1], [-18, 18]);

  return (
    <section
      ref={sectionRef}
      id={sectionId}
      aria-label="Who we are"
      className="font-manrope relative isolate overflow-hidden bg-[#fbf6ec] px-5 py-24 text-[#211812] md:px-8 md:py-32 lg:py-40"
    >
      <span id={anchorId} className="absolute -top-24" aria-hidden="true" />

      <div
        className="pointer-events-none absolute inset-0 -z-20 opacity-[0.36]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(164, 124, 54, 0.11) 1px, transparent 1px), linear-gradient(90deg, rgba(164, 124, 54, 0.09) 1px, transparent 1px)",
          backgroundSize: "72px 72px"
        }}
      />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_78%_32%,rgba(214,180,95,0.22),transparent_31rem),radial-gradient(circle_at_12%_18%,rgba(255,255,255,0.88),transparent_28rem),linear-gradient(135deg,#fffaf1_0%,#f6ead8_54%,#efe0c8_100%)]" />
      <div className="pointer-events-none absolute left-0 top-0 -z-10 h-full w-full bg-[linear-gradient(90deg,rgba(255,255,255,0.58),transparent_42%,rgba(255,248,235,0.5))]" />

      <div className="mx-auto grid max-w-[88rem] items-center gap-14 lg:grid-cols-[minmax(0,1fr)_1px_minmax(0,1fr)] lg:gap-14 xl:gap-16">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={revealTransition}
          className="max-w-[42rem]"
        >
          <p className="text-[0.72rem] font-semibold uppercase leading-none tracking-[0.28em] text-[#8d6a25]">
            WHO WE ARE
          </p>
          <h2 className="mt-7 max-w-[43rem] [--ractysh-body-font:var(--font-cormorant)] [--ractysh-heading-tracking:-0.04em] font-display text-[clamp(2.65rem,7.2vw,4.9rem)] font-bold leading-[0.95] tracking-[-0.04em] text-[#17120f] [text-wrap:balance]">
            <span className="block">One ecosystem</span>
            <span className="block">built for modern</span>
            <span className="block">enterprise execution.</span>
          </h2>
          <p className="mt-8 max-w-[35rem] font-sans text-[clamp(1rem,1.18vw,1.12rem)] font-medium leading-[1.95] tracking-[0] text-[#51463c]">
            Ractysh integrates Architecture, Construction, Real Estate, Export & Import and OTC Exchange into one
            premium operational ecosystem designed for modern execution.
          </p>
        </motion.div>

        <motion.div
          aria-hidden="true"
          initial={reduceMotion ? false : { opacity: 0, scaleY: 0.84 }}
          whileInView={{ opacity: 1, scaleY: 1 }}
          viewport={{ once: true, amount: 0.42 }}
          transition={{ ...revealTransition, delay: 0.08 }}
          className="hidden h-[31rem] w-px origin-center bg-gradient-to-b from-transparent via-[#c7a456]/36 to-transparent lg:block"
        />

        <motion.figure
          initial={reduceMotion ? false : { opacity: 0, y: 34 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ ...revealTransition, delay: 0.14 }}
          className="relative min-h-[28rem] overflow-hidden rounded-[1.15rem] border border-[#dfcfad]/70 bg-[#2b2119] shadow-[0_34px_90px_rgba(72,48,20,0.18)] sm:min-h-[34rem] lg:min-h-[43rem]"
        >
          <motion.div
            className="absolute inset-0 will-change-transform"
            style={reduceMotion ? undefined : { y: imageY }}
            initial={reduceMotion ? false : { scale: 1.065 }}
            whileInView={reduceMotion ? undefined : { scale: 1.04 }}
            viewport={{ once: true, amount: 0.28 }}
            transition={reduceMotion ? undefined : { ...revealTransition, duration: 1.8 }}
          >
            <Image
              src="/contact/enterprise-architecture-workspace.webp"
              alt="Premium executive workspace with warm architectural light and city-facing glass"
              fill
              sizes="(min-width: 1280px) 44vw, (min-width: 1024px) 48vw, 100vw"
              quality={82}
              className="object-cover"
              style={{ objectPosition: "50% 50%" }}
            />
          </motion.div>
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,244,219,0.08),transparent_38%,rgba(35,20,12,0.22)),linear-gradient(90deg,rgba(255,248,234,0.12),transparent_46%)]" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#ffe5a5]/55 to-transparent" />
        </motion.figure>
      </div>
    </section>
  );
}
