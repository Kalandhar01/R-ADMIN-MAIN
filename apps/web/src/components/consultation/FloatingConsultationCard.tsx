"use client";

import { motion } from "framer-motion";
import {
  Building2,
  CheckCircle2,
  DraftingCompass,
  Gauge,
  HardHat,
  Layers3,
  ShieldCheck
} from "lucide-react";
import { CONSULTATION_CONTACT_ITEMS } from "@/lib/companyContact";
import { cn } from "@/lib/utils";

const metrics = [
  { label: "Scope clarity", value: "94%", tone: "navy" },
  { label: "Pillar lanes", value: "05", tone: "gold" },
  { label: "Risk gates", value: "15", tone: "navy" }
];

const previews = [
  { label: "Construction", value: "Feasibility", icon: HardHat },
  { label: "Architecture", value: "Concept review", icon: DraftingCompass },
  { label: "OTC Exchange", value: "Private intake", icon: ShieldCheck }
];

export function FloatingConsultationCard() {
  return (
    <motion.div
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1], delay: 0.18 }}
      className="relative mx-auto w-full max-w-[35rem] lg:ml-auto"
    >
      <motion.div
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="relative overflow-hidden rounded-[2rem] border border-white/65 bg-white/62 p-4 shadow-[0_34px_110px_rgba(23,36,58,0.16),inset_0_1px_0_rgba(255,255,255,0.9)] backdrop-blur-2xl sm:p-5"
      >
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#c6a45b]/70 to-transparent" />
        <div className="rounded-[1.5rem] border border-[#e7dfd1] bg-[#fffefa]/80 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.92)] sm:p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#17243a] text-[#f5df9a] shadow-[0_14px_30px_rgba(23,36,58,0.22)]">
                <Building2 className="h-5 w-5" strokeWidth={1.8} />
              </span>
              <div>
                <p className="text-[0.68rem] font-semibold uppercase text-[#9a7428]">
                  Enterprise profile
                </p>
                <h3 className="mt-1 font-display text-[16px] font-medium tracking-tight text-[#17243a]">Ractysh advisory desk</h3>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#d8c386]/70 bg-[#fff7df] px-3 py-1 text-[12px] font-semibold text-[#7d5f1d]">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Priority
            </span>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-2.5">
            {metrics.map((metric) => (
              <div
                key={metric.label}
                className={cn(
                  "rounded-2xl border p-3",
                  metric.tone === "gold"
                    ? "border-[#ead9a6] bg-[#fff8df]"
                    : "border-[#dfe4e8] bg-[#f7f9fb]"
                )}
              >
                <p className="text-[18px] font-semibold text-[#17243a]">{metric.value}</p>
                <p className="mt-1 text-[0.65rem] leading-4 text-[#6f6c63]">{metric.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-[1.2rem] border border-[#dde4ea] bg-[#f8fafb] p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#687280]">Planning metrics</p>
                <p className="mt-1 text-[14px] font-semibold text-[#17243a]">Demo readiness index</p>
              </div>
              <Gauge className="h-5 w-5 text-[#c6a45b]" strokeWidth={1.9} />
            </div>
            <div className="mt-4 space-y-3">
              {["Architecture brief", "Real estate model", "Trade and OTC sequence"].map((label, index) => (
                <div key={label}>
                  <div className="mb-1 flex justify-between text-[0.7rem] font-medium text-[#6b706e]">
                    <span>{label}</span>
                    <span>{86 + index * 4}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-[#e4e8ea]">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${86 + index * 4}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.2, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
                      className="h-full rounded-full bg-gradient-to-r from-[#17243a] via-[#2d425f] to-[#c6a45b]"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 grid gap-3">
            {previews.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.label}
                  className="flex items-center justify-between rounded-2xl border border-[#e5dfd3] bg-white/72 px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#17243a]/6 text-[#17243a]">
                      <Icon className="h-4 w-4" strokeWidth={1.8} />
                    </span>
                    <div>
                      <p className="text-[14px] font-semibold text-[#17243a]">{item.label}</p>
                      <p className="text-xs text-[#7a766d]">{item.value}</p>
                    </div>
                  </div>
                  <Layers3 className="h-4 w-4 text-[#c6a45b]" strokeWidth={1.9} />
                </div>
              );
            })}
          </div>

          <div className="mt-4 grid gap-2 rounded-[1.2rem] border border-[#ead9a6] bg-[#fffaf0]/76 p-3">
            {CONSULTATION_CONTACT_ITEMS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="flex items-center justify-between gap-3 rounded-xl px-2 py-1.5 text-left transition duration-300 hover:bg-white/70"
              >
                <span className="text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-[#9a7428]">
                  {item.label}
                </span>
                <span className="break-words text-right text-[12px] font-semibold text-[#17243a]">{item.value}</span>
              </a>
            ))}
          </div>
        </div>
      </motion.div>

      <motion.div
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.78, delay: 0.52, ease: [0.22, 1, 0.36, 1] }}
        className="absolute -right-1 top-10 hidden w-44 rounded-2xl border border-[#e5d8ba] bg-[#fff9e8]/88 p-4 shadow-[0_20px_54px_rgba(124,93,31,0.14)] backdrop-blur-xl sm:block lg:-right-10"
      >
        <ShieldCheck className="h-5 w-5 text-[#9a7428]" strokeWidth={1.9} />
        <p className="mt-3 text-[12px] font-semibold uppercase tracking-[0.08em] text-[#9a7428]">Status</p>
        <p className="mt-1 text-[14px] font-semibold text-[#17243a]">Private review lane open</p>
      </motion.div>
    </motion.div>
  );
}
