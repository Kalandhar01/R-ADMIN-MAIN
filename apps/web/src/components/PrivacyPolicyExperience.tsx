"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { MarketingChrome } from "@/components/MarketingChrome";
import type { LegalDocument, SiteContent } from "@/lib/types";

interface PrivacyPolicyExperienceProps {
  content: SiteContent;
  document: LegalDocument;
}

const ease = [0.22, 1, 0.36, 1] as const;

const privacySections = [
  {
    title: "Information We Collect",
    body:
      "Ractysh may collect information you choose to share through consultation forms, service requests, business inquiries, subscription forms and direct communications. This can include your name, email address, company details, project interest, message content and page context needed to route your inquiry correctly."
  },
  {
    title: "How We Use Information",
    body:
      "Information is used to respond to inquiries, evaluate service requirements, coordinate enterprise communication, improve website reliability and maintain clear records for client support. We do not sell private client information."
  },
  {
    title: "Enterprise Communications",
    body:
      "When you contact Ractysh, we may use your submitted details to provide requested updates, schedule briefings, route messages to the relevant division and maintain a professional communication history across the Ractysh ecosystem."
  },
  {
    title: "Data Security",
    body:
      "We apply practical safeguards designed to protect submitted information from unauthorized access, misuse or unnecessary exposure. Access is limited to operational teams and trusted service providers who support business communication and platform delivery."
  },
  {
    title: "Cookies & Tracking",
    body:
      "The website may use essential cookies, analytics signals and technical logs to understand site performance, improve user experience and protect platform reliability. These tools are used in a limited, business-focused manner."
  },
  {
    title: "Third-Party Services",
    body:
      "Ractysh may rely on trusted infrastructure, communication, analytics and delivery providers to operate the website and manage inquiries. These services are used only where needed to support secure and reliable business workflows."
  },
  {
    title: "Contact Information",
    body:
      "For privacy questions, enterprise information requests or communication preferences, contact the Ractysh operations desk. We will review the request and respond through an appropriate business channel."
  }
];

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
      initial={reduceMotion ? false : { opacity: 0, y: 22 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.24 }}
      transition={{ duration: 0.72, delay, ease }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function PrivacyPolicyExperience({ content, document }: PrivacyPolicyExperienceProps) {
  return (
    <MarketingChrome content={content}>
      <div className="relative isolate overflow-hidden bg-[#f8f4ea] text-[#211b16] [font-family:var(--font-manrope)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_74%_8%,rgba(214,180,95,0.16),transparent_30rem),radial-gradient(circle_at_12%_26%,rgba(255,255,255,0.88),transparent_28rem),linear-gradient(180deg,#fffdf8_0%,#f8f4ea_48%,#efe4d4_100%)]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.16] [background-image:linear-gradient(rgba(45,37,28,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(45,37,28,0.06)_1px,transparent_1px)] [background-size:56px_56px]" />

        <section className="relative z-10 px-5 pb-14 pt-32 md:px-8 md:pb-16 lg:pt-40">
          <div className="mx-auto max-w-[1000px]">
            <Reveal>
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.26em] text-[#9a7428]">Legal</p>
              <h1 className="mt-5 font-display text-[clamp(3.4rem,8vw,7rem)] font-semibold leading-[0.9] tracking-[-0.02em] text-[#18130f]">
                Privacy Policy
              </h1>
              <p className="mt-6 max-w-[46rem] text-[1.02rem] leading-[1.9] text-[#62584e] md:text-[1.12rem]">
                How Ractysh collects, manages and protects enterprise information across the ecosystem.
              </p>
            </Reveal>

            <Reveal delay={0.08} className="mt-10 flex flex-col gap-3 border-y border-[#c9a85a]/28 py-5 text-[0.78rem] font-semibold uppercase tracking-[0.16em] text-[#756a5f] sm:flex-row sm:items-center sm:justify-between">
              <span>Last updated: {document.updatedAt}</span>
              <span>Ractysh Enterprise Privacy</span>
            </Reveal>
          </div>
        </section>

        <section className="relative z-10 px-5 pb-20 md:px-8 lg:pb-28">
          <article className="mx-auto max-w-[1000px] rounded-[18px] border border-[#dfcfaa]/72 bg-[#fffdf8]/78 px-5 py-8 shadow-[0_26px_90px_rgba(80,52,24,0.08),inset_0_1px_0_rgba(255,255,255,0.86)] backdrop-blur-sm md:px-9 md:py-10">
            <Reveal>
              <p className="text-[1rem] leading-[1.9] text-[#554b42] md:text-[1.06rem]">{document.body}</p>
            </Reveal>

            <div className="mt-4">
              {privacySections.map((section, index) => (
                <Reveal key={section.title} delay={Math.min(index * 0.03, 0.14)} className="border-t border-[#c9a85a]/24 py-8 first:mt-4">
                  <h2 className="font-display text-[2rem] font-semibold leading-tight text-[#1b1511] md:text-[2.45rem]">
                    {section.title}
                  </h2>
                  <p className="mt-4 max-w-[52rem] text-[1rem] leading-[1.9] text-[#5d5349] md:text-[1.05rem]">
                    {section.body}
                  </p>
                </Reveal>
              ))}
            </div>
          </article>
        </section>

        <section className="relative z-10 px-5 pb-24 md:px-8 lg:pb-32">
          <Reveal className="mx-auto max-w-[1000px] overflow-hidden rounded-[18px] border border-[#d8c18a]/70 bg-[#f1e7d7]/72 p-6 shadow-[0_24px_70px_rgba(80,52,24,0.08)] md:flex md:items-center md:justify-between md:gap-8 md:p-8">
            <p className="max-w-[34rem] text-[1rem] font-medium leading-[1.8] text-[#4e443b]">
              For enterprise privacy inquiries, contact the Ractysh operations desk.
            </p>
            <Link
              href="/contact"
              className="group mt-5 inline-flex h-11 items-center justify-center gap-2.5 rounded-[14px] border border-[#d6b45f]/42 bg-[#0f0e0c] px-5 text-[0.88rem] font-semibold text-[#fffaf0] shadow-[0_16px_38px_rgba(15,14,12,0.22),0_0_18px_rgba(214,180,95,0.12)] transition duration-300 hover:-translate-y-0.5 hover:border-[#d6b45f]/70 hover:shadow-[0_20px_50px_rgba(15,14,12,0.28),0_0_28px_rgba(214,180,95,0.24)] md:mt-0"
            >
              Contact Enterprise Desk
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
          </Reveal>
        </section>
      </div>
    </MarketingChrome>
  );
}
