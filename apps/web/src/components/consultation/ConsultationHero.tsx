"use client";

import { motion } from "framer-motion";
import { ArrowRight, CalendarClock, ChevronDown, Gem, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CompanyContactPanel } from "@/components/CompanyContactPanel";
import { FloatingConsultationCard } from "@/components/consultation/FloatingConsultationCard";

const trustItems = ["Five-pillar intake", "Export-import advisory", "OTC exchange routing"];

export function ConsultationHero() {
  return (
    <section id="consultation-hero" className="relative isolate min-h-[94svh] overflow-hidden px-5 pb-16 pt-24 md:px-8 md:pt-28">
      <div className="absolute inset-0 -z-20 bg-[#f8f6ef]" />
      <div
        className="absolute inset-0 -z-10 bg-cover bg-center opacity-80"
        style={{ backgroundImage: "url('/HeaderBG.webp')" }}
        aria-hidden
      />
      <div className="absolute left-1/2 top-0 -z-10 h-[42rem] w-[42rem] -translate-x-1/2 rounded-full bg-[#fffdf8]/90 blur-3xl" />
      <div className="absolute right-[-14rem] top-24 -z-10 h-[42rem] w-[42rem] rounded-full bg-[#c6a45b]/10 blur-3xl" />
      <svg
        className="absolute inset-x-0 bottom-0 -z-10 h-56 w-full text-[#17243a]/[0.06]"
        viewBox="0 0 1440 220"
        fill="none"
        aria-hidden
      >
        <path
          d="M-40 151C201 38 419 58 614 127C812 197 1012 244 1480 72"
          stroke="currentColor"
          strokeWidth="38"
          strokeLinecap="round"
        />
        <path
          d="M-60 193C221 94 414 111 614 165C842 226 1077 238 1496 126"
          stroke="currentColor"
          strokeWidth="1.2"
        />
      </svg>

      <div className="mx-auto grid min-h-[calc(94svh-9rem)] max-w-[92rem] items-center gap-10 py-10 lg:grid-cols-[minmax(0,1.02fr)_minmax(28rem,0.82fr)] lg:gap-14 lg:py-12">
        <div>
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex items-center gap-2 rounded-full border border-[#ded6c8] bg-white/58 px-3.5 py-2 text-[13px] font-semibold uppercase tracking-[0.08em] text-[#8a6929] shadow-[0_14px_34px_rgba(23,36,58,0.06)] backdrop-blur-xl"
          >
            <Gem className="h-4 w-4" strokeWidth={1.8} />
            Book Consultation
          </motion.div>

          <motion.h1
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.82, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="mt-7 max-w-4xl font-display text-[32px] font-semibold leading-[0.98] tracking-[-0.04em] text-[#17243a] md:text-[42px] lg:text-[52px]"
          >
            Let&apos;s Build Your Next Enterprise Ecosystem Together
          </motion.h1>

          <motion.p
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.78, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
            className="mt-5 max-w-3xl text-[15px] leading-[1.7] text-[#5e5b54]/80 md:text-[16px]"
          >
            From Architecture and Construction to Real Estate, Export-Import and OTC Exchange coordination - Ractysh
            delivers premium business ecosystems tailored for modern enterprises.
          </motion.p>

          <motion.div
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.72, delay: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="mt-7 flex flex-col gap-3 sm:flex-row"
          >
            <Button asChild>
              <Link href="#consultation-form">
                Book Consultation
                <CalendarClock className="h-5 w-5" strokeWidth={1.8} />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/#enterprise-solutions">
                Explore Services
                <ArrowRight className="h-5 w-5" strokeWidth={1.8} />
              </Link>
            </Button>
          </motion.div>

          <motion.div
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.72, delay: 0.34, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 grid max-w-3xl gap-3 sm:grid-cols-3"
          >
            {trustItems.map((item) => (
              <div
                key={item}
                className="flex items-center gap-2 rounded-2xl border border-[#ded9ce] bg-white/48 px-3.5 py-2.5 text-[14px] font-medium text-[#555248]/80 backdrop-blur-xl"
              >
                <ShieldCheck className="h-4 w-4 shrink-0 text-[#9a7428]" strokeWidth={1.8} />
                <span>{item}</span>
              </div>
            ))}
          </motion.div>

          <motion.div
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.72, delay: 0.42, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 max-w-3xl"
          >
            <CompanyContactPanel mode="consultation" tone="transparent" />
          </motion.div>
        </div>

        <FloatingConsultationCard />
      </div>

      <motion.a
        href="#consultation-form"
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.9 }}
        className="absolute bottom-7 left-1/2 hidden -translate-x-1/2 items-center gap-2 rounded-full border border-[#ddd4c4] bg-white/50 px-4 py-2 text-[14px] font-medium text-[#6c675d] backdrop-blur-xl md:inline-flex"
      >
        Begin private intake
        <ChevronDown className="h-4 w-4" strokeWidth={1.8} />
      </motion.a>
    </section>
  );
}
