"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { MarketingChrome } from "@/components/MarketingChrome";
import type { LegalDocument, SiteContent } from "@/lib/types";

export interface LegalEditorialSection {
  id: string;
  title: string;
  body: string;
}

interface LegalEditorialExperienceProps {
  content: SiteContent;
  document: LegalDocument;
  eyebrow: string;
  descriptor: string;
  sections: LegalEditorialSection[];
  closingText: string;
}

const ease = [0.22, 1, 0.36, 1] as const;

function Reveal({
  children,
  className = "",
  delay = 0
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 18 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.22 }}
      transition={{ duration: 0.62, delay, ease }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function LegalEditorialExperience({
  content,
  document,
  eyebrow,
  descriptor,
  sections,
  closingText
}: LegalEditorialExperienceProps) {
  return (
    <MarketingChrome content={content}>
      <div className="relative isolate overflow-hidden bg-[#f7f0e3] text-[#201914] [font-family:var(--font-manrope)]">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,#fffdf8_0%,#f8f1e4_48%,#efe2cf_100%)]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.2] [background-image:linear-gradient(rgba(68,52,36,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(68,52,36,0.055)_1px,transparent_1px)] [background-size:72px_72px]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-[linear-gradient(180deg,rgba(255,255,255,0.78),rgba(255,255,255,0))]" />

        <section className="relative z-10 px-5 pb-14 pt-32 md:px-8 md:pb-16 lg:pt-40">
          <div className="mx-auto max-w-[1000px] text-center">
            <Reveal>
              <p className="text-[0.78rem] font-semibold uppercase text-[#9a7428]">{eyebrow}</p>
              <h1 className="mx-auto mt-5 max-w-[820px] text-[3.45rem] font-semibold leading-[0.92] text-[#18130f] font-display sm:text-[4.5rem] md:text-[5.6rem] lg:text-[6.5rem]">
                {document.title}
              </h1>
              <p className="mx-auto mt-7 max-w-[46rem] text-[1rem] leading-8 text-[#62584e] md:text-[1.12rem] md:leading-9">
                {document.summary}
              </p>
            </Reveal>

            <Reveal delay={0.06} className="mx-auto mt-12 grid max-w-[860px] gap-3 border-y border-[#c8a65d]/28 py-5 text-[0.76rem] font-semibold uppercase text-[#756a5f] sm:grid-cols-3">
              <span>Last updated</span>
              <span>{document.updatedAt}</span>
              <span>{descriptor}</span>
            </Reveal>
          </div>
        </section>

        <section className="relative z-10 px-5 pb-20 md:px-8 lg:pb-28">
          <div className="mx-auto grid max-w-[1160px] gap-10 xl:grid-cols-[190px_minmax(0,1fr)]">
            <aside className="hidden xl:block">
              <Reveal className="sticky top-32 border-l border-[#c8a65d]/30 pl-5">
                <p className="text-[0.72rem] font-semibold uppercase text-[#9a7428]">Document Index</p>
                <nav className="mt-5 grid gap-3" aria-label={`${document.title} sections`}>
                  {sections.map((section, index) => (
                    <a
                      key={section.id}
                      href={`#${section.id}`}
                      className="group flex items-center gap-3 text-[0.78rem] font-semibold text-[#756b60] transition-colors duration-300 hover:text-[#18130f]"
                    >
                      <span className="h-px w-7 bg-[#c8a65d]/45 transition-all duration-300 group-hover:w-10 group-hover:bg-[#9a7428]" />
                      <span>{String(index + 1).padStart(2, "0")}</span>
                    </a>
                  ))}
                </nav>
              </Reveal>
            </aside>

            <article className="mx-auto w-full max-w-[940px] overflow-hidden rounded-[8px] border border-[#d8c18a]/70 bg-[#fffdf8]/86 shadow-[0_28px_90px_rgba(80,52,24,0.08),inset_0_1px_0_rgba(255,255,255,0.9)] backdrop-blur-sm">
              <Reveal className="border-b border-[#c8a65d]/24 px-5 py-7 md:px-10 md:py-9">
                <p className="text-[1rem] leading-8 text-[#554b42] md:text-[1.08rem] md:leading-9">{document.body}</p>
              </Reveal>

              <div>
                {sections.map((section, index) => (
                  <Reveal key={section.id} delay={Math.min(index * 0.025, 0.12)} className="border-b border-[#c8a65d]/22 last:border-b-0">
                    <section id={section.id} className="scroll-mt-28 px-5 py-8 md:px-10 md:py-10">
                      <p className="text-[0.76rem] font-semibold uppercase text-[#9a7428]">
                        {String(index + 1).padStart(2, "0")}
                      </p>
                      <h2 className="mt-3 text-[2.05rem] font-semibold leading-tight text-[#1b1511] font-display md:text-[2.65rem]">
                        {section.title}
                      </h2>
                      <p className="mt-4 max-w-[54rem] text-[1rem] leading-8 text-[#5d5349] md:text-[1.05rem] md:leading-9">
                        {section.body}
                      </p>
                    </section>
                  </Reveal>
                ))}
              </div>
            </article>
          </div>
        </section>

        <section className="relative z-10 px-5 pb-24 md:px-8 lg:pb-32">
          <Reveal className="mx-auto flex max-w-[1000px] flex-col gap-6 rounded-[8px] border border-[#d8c18a]/70 bg-[#f3e8d7]/78 p-6 shadow-[0_24px_70px_rgba(80,52,24,0.08)] md:flex-row md:items-center md:justify-between md:p-8">
            <p className="max-w-[39rem] text-[1rem] font-medium leading-8 text-[#4e443b]">{closingText}</p>
            <Link href="/contact" className="premium-cta group w-fit">
              Contact Enterprise Desk
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
          </Reveal>
        </section>
      </div>
    </MarketingChrome>
  );
}
