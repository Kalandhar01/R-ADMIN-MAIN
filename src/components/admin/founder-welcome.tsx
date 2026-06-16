"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Building2, DraftingCompass, Factory, Globe2, HardHat, Landmark, ShieldCheck } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ProjectKey } from "@ractysh/types/admin";
import { adminProjectRoutes } from "@/lib/admin/projects";

const projectIcons: Partial<Record<ProjectKey, LucideIcon>> = {
  "ractysh-group": Landmark,
  infrastructure: Factory,
  architecture: DraftingCompass,
  construction: HardHat,
  "real-estate": Building2,
  "import-export": Globe2,
  "otc-exchange": ShieldCheck
};

function adminGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

export function FounderWelcomeScreen() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#080808] px-5 py-8 text-[#F5F5F5] sm:px-8">
      <div
        className="absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(184,134,11,.06) 1px, transparent 1px), linear-gradient(90deg, rgba(184,134,11,.06) 1px, transparent 1px)",
          backgroundSize: "48px 48px"
        }}
      />
      <motion.div
        aria-hidden="true"
        className="absolute left-1/2 top-[-22rem] h-[44rem] w-[44rem] -translate-x-1/2 rounded-full bg-[#b8860b]/10 blur-3xl"
        animate={{ opacity: [0.28, 0.5, 0.28], scale: [0.98, 1.03, 0.98] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[#b8860b]/50 to-transparent" />
      <div className="absolute inset-x-8 bottom-0 h-px bg-gradient-to-r from-transparent via-[#d4a843]/30 to-transparent" />

      <section className="relative z-10 mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-7xl flex-col items-center justify-center py-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center"
        >
          <div className="flex h-24 w-24 items-center justify-center rounded-[12px] border border-[#b8860b]/30 bg-gradient-to-br from-[#141414] to-[#0d0d0d] shadow-[0_0_90px_rgba(184,134,11,0.14)]">
            <Landmark className="h-12 w-12 text-[#b8860b]" />
          </div>
          <p className="mt-5 text-xs font-bold uppercase tracking-[0.3em] text-[#b8860b]">Ractysh Group</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 max-w-4xl"
        >
          <h1 className="font-display text-5xl font-semibold leading-[0.95] tracking-tight text-[#F5F5F5] sm:text-7xl">
            {adminGreeting()}.
          </h1>
          <p className="mx-auto mt-5 max-w-3xl text-xl font-medium leading-8 text-[#F5F5F5]/90 sm:text-2xl">
            Welcome to the Ractysh Enterprise Command Network.
          </p>
          <div className="mx-auto mt-7 max-w-2xl text-sm leading-7 text-[#9B9B9B] sm:text-base">
            <p>Select a division to continue.</p>
            <p>One ecosystem. Seven operational command centers.</p>
          </div>
        </motion.div>

        <div className="mt-12 grid w-full gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {adminProjectRoutes.map((project, index) => {
            const Icon = projectIcons[project.key] || Landmark;

            return (
              <motion.div
                key={project.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.58, delay: 0.3 + index * 0.08, ease: [0.22, 1, 0.36, 1] }}
              >
                <Link
                  href={project.href}
                  className="group flex min-h-[13rem] flex-col justify-between rounded-[8px] border border-[#232323] bg-[#111111]/88 p-5 text-left shadow-[0_28px_90px_rgba(0,0,0,0.28)] transition duration-300 hover:border-[#b8860b]/60 hover:bg-gradient-to-br hover:from-[#151515] hover:to-[#111111]"
                >
                  <div>
                    <div className="flex h-11 w-11 items-center justify-center rounded-[8px] border border-[#b8860b]/30 bg-gradient-to-br from-[#0d0d0d] to-[#111] text-[#b8860b]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h2 className="mt-6 font-display text-3xl font-medium leading-none tracking-tight text-[#F5F5F5]">
                      {project.label}
                    </h2>
                    <p className="mt-4 max-w-sm text-sm leading-6 text-[#9B9B9B]">{project.description}</p>
                  </div>
                  <span className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-[#b8860b]">
                    Open Command Center
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
