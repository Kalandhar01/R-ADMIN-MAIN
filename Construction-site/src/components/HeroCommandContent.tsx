"use client";

import { motion } from "motion/react";
import Link from "next/link";

const tickerItems = [
  "COMMERCIAL CONSTRUCTION",
  "RESIDENTIAL CONSTRUCTION",
  "CIVIL ENGINEERING",
  "MEP ENGINEERING",
  "TURNKEY PROJECTS",
  "PMC SERVICES",
  "GOVERNMENT PROJECTS",
  "INFRASTRUCTURE DEVELOPMENT",
];

export default function HeroCommandContent() {
  return (
    <div className="relative mx-auto flex h-full w-full max-w-7xl flex-col items-center justify-center">
      <div className="mx-auto flex w-full max-w-5xl -translate-y-4 flex-col items-center text-center sm:-translate-y-3">
        {/* Floating label - right side */}
        <motion.div
          initial={{ opacity: 0, x: 40, filter: "blur(6px)" }}
          animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.8, delay: 1.6, ease: [0.22, 1, 0.36, 1] }}
          className="absolute right-0 top-4 hidden border border-white/20 bg-black/60 px-4 py-3 text-left backdrop-blur-md lg:block"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/70">
            PROJECT DELIVERY<br />PARTNER
          </p>
          <p className="mt-1.5 text-[10px] leading-relaxed text-white/40">
            Planning &bull; Engineering<br />
            Construction &bull; Handover
          </p>
        </motion.div>

        {/* Section label */}
        <motion.p
          initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-white/50"
        >
          Construction & Engineering Division
        </motion.p>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="text-5xl font-bold leading-[1.08] tracking-tight text-white sm:text-6xl lg:text-7xl"
        >
          One Team.<br />
          <span className="text-[#C4A87C]">One Responsibility.</span><br />
          Complete Project Delivery.
        </motion.h1>

        {/* Supporting text */}
        <motion.p
          initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.7, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mt-5 max-w-2xl text-base leading-7 text-white/65 sm:text-lg sm:leading-8"
        >
          From site planning and approvals to engineering, construction and
          final handover, we deliver residential, commercial and infrastructure
          projects through a single accountable process built on precision,
          transparency and execution excellence.
        </motion.p>

        {/* Trust strip */}
        <motion.div
          initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.6, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mt-7 flex flex-wrap justify-center gap-x-6 gap-y-2"
        >
          {[
            ["25+", "Integrated Services"],
            ["250+", "Projects Delivered"],
            ["98%", "Client Satisfaction"],
            ["End-to-End", "Project Delivery"],
          ].map(([val, label]) => (
            <div key={label} className="flex items-center gap-2">
              <span className="text-sm font-bold text-[#C4A87C]">{val}</span>
              <span className="text-xs text-white/50">{label}</span>
              <span className="h-3 w-px bg-white/10 last:hidden" />
            </div>
          ))}
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 34, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.82, delay: 1.1, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 flex flex-col items-center justify-center gap-3 sm:mt-9 sm:flex-row"
        >
          <Link
            href="/#contact"
            className="group relative inline-flex h-12 min-w-44 items-center justify-center overflow-hidden bg-[#991b1b] px-6 text-sm font-semibold text-white shadow-[0_0_34px_rgba(127,29,29,0.34)] transition hover:bg-[#b91c1c]"
          >
            <span className="relative z-10">Start Your Project</span>
            <span className="absolute inset-y-0 -left-12 w-10 rotate-12 bg-white/45 transition duration-500 group-hover:left-[120%]" />
          </Link>
          <Link
            href="/construction-services"
            className="inline-flex h-12 min-w-44 items-center justify-center border border-white/20 bg-white/10 px-6 text-sm font-semibold text-white backdrop-blur-sm transition hover:border-white/40 hover:bg-white/20"
          >
            Explore Construction Services
          </Link>
        </motion.div>
      </div>

      {/* Bottom running text */}
      <motion.div
        initial={{ opacity: 0, y: 42, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.94, delay: 1.35, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-x-0 bottom-7 mx-auto w-full max-w-5xl overflow-hidden border-y border-white/10 bg-black/40 py-3 shadow-sm backdrop-blur-md sm:bottom-10"
      >
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
          className="flex w-max gap-6 whitespace-nowrap text-xs font-semibold uppercase text-white/60"
        >
          {[...tickerItems, ...tickerItems, ...tickerItems].map((item, index) => (
            <span key={`${item}-${index}`} className="flex items-center gap-6">
              {item}
              <span className="h-1 w-1 bg-[#ef4444]" />
            </span>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
