"use client";

import { Award, Headphones, Network, Sparkles } from "lucide-react";
import { GsapSection } from "@/components/animation/GsapSection";

const benefits = [
  {
    title: "Enterprise-Level Strategy",
    description:
      "Senior-led discovery across commercial goals, construction complexity, operational risk and execution readiness.",
    icon: Network
  },
  {
    title: "Premium Technical Expertise",
    description:
      "Architecture, Construction, Real Estate, Export-Import and Private Exchange models reviewed through one advisory lens.",
    icon: Award
  },
  {
    title: "End-to-End Project Execution",
    description:
      "A practical roadmap from requirement intake to partners, sequencing, governance and turnkey delivery.",
    icon: Sparkles
  },
  {
    title: "Dedicated Demo Support",
    description:
      "A private demo lane with structured follow-ups, curated documentation and executive-level coordination.",
    icon: Headphones
  }
];

export function ConsultationBenefits() {
  return (
    <GsapSection className="relative px-5 pb-[4.5rem] pt-0 md:px-8 md:pb-24 md:pt-0">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#ded6c6] to-transparent" />
      <div className="mx-auto max-w-[86rem]">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;

            return (
              <article
                key={benefit.title}
                data-gsap-reveal
                className="group min-h-[19rem] rounded-[1.75rem] border border-[#e4ddcf] bg-white/58 p-6 shadow-[0_18px_54px_rgba(23,36,58,0.06),inset_0_1px_0_rgba(255,255,255,0.88)] backdrop-blur-xl transition duration-500 hover:-translate-y-1 hover:border-[#c6a45b]/55 hover:bg-white"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#17243a] text-[#f5df9a] shadow-[0_16px_34px_rgba(23,36,58,0.18)] transition duration-500 group-hover:bg-[#c6a45b] group-hover:text-[#17243a]">
                  <Icon className="h-5 w-5" strokeWidth={1.8} />
                </span>
                <h3 className="mt-6 font-display text-[18px] font-medium tracking-tight text-[#17243a]">{benefit.title}</h3>
                <p className="mt-3 text-[14px] leading-[1.7] text-[#6f6a60]/80">{benefit.description}</p>
                <div className="mt-6 h-px w-full bg-gradient-to-r from-[#c6a45b]/70 via-[#17243a]/10 to-transparent" />
              </article>
            );
          })}
        </div>
      </div>
    </GsapSection>
  );
}
