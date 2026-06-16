"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, CalendarClock } from "lucide-react";
import Link from "next/link";
import { CompanyContactPanel } from "@/components/CompanyContactPanel";
import { Button } from "@/components/ui/button";

export function ConsultationFinalCTA() {
  return (
    <section className="relative isolate overflow-hidden px-5 py-16 text-white md:px-8 md:py-20">
      <div className="absolute inset-0 -z-10 bg-[#08111f]" />
      <div className="absolute left-1/2 top-[-12rem] -z-10 h-[38rem] w-[62rem] -translate-x-1/2 rounded-full bg-[#c6a45b]/14 blur-3xl" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#d9bf73]/70 to-transparent" />

      <motion.div
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.78, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto max-w-[76rem] text-center"
      >
        <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-[#d9bf73]">Private enterprise desk</p>
        <h2 className="mx-auto mt-3 max-w-4xl font-display text-[22px] font-semibold leading-[1.08] tracking-[-0.03em] md:text-[28px] lg:text-[34px]">
          Bring Ractysh into the room before the project becomes expensive to correct.
        </h2>
        <p className="mx-auto mt-4 max-w-3xl text-[15px] leading-[1.7] text-white/72 md:text-[16px]">
          Start with a premium demo built to clarify strategic fit, delivery model, commercial path and execution confidence.
        </p>
        <CompanyContactPanel mode="consultation" tone="dark" compact className="mx-auto mt-7 max-w-4xl" />
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild>
            <Link href="#consultation-form">
              Book a Demo
              <CalendarClock className="h-5 w-5" strokeWidth={1.8} />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="text-white"
          >
            <Link href="/">
              Return to Ecosystem
              <ArrowUpRight className="h-5 w-5" strokeWidth={1.8} />
            </Link>
          </Button>
        </div>
      </motion.div>
    </section>
  );
}
