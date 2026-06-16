"use client";
import { motion } from "motion/react";
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  Building2,
  CheckCircle2,
  Clock3,
  Compass,
  HardHat,
  Layers3,
  MapPin,
  RadioTower,
  ShieldCheck,
  UsersRound,
  Workflow,
  Zap,
} from "lucide-react";
import React from "react";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";

export default function HeroScrollDemo() {
  return (
    <div className="relative flex flex-col overflow-hidden bg-[linear-gradient(180deg,#ffffff_0%,#fff7f7_52%,#ffffff_100%)] pt-20 md:pt-10">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red-200 to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(153,27,27,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.04)_1px,transparent_1px)] bg-[size:72px_72px]" />
      <div className="pointer-events-none absolute left-1/2 top-20 h-56 w-[min(54rem,86vw)] -translate-x-1/2 rounded-full bg-red-100/55 blur-3xl" />
      <ContainerScroll
        titleComponent={
          <div className="relative z-10 mx-auto max-w-5xl px-4">
            <h2 className="mx-auto max-w-3xl text-balance text-3xl font-bold leading-tight tracking-tight text-slate-950 sm:text-4xl md:text-5xl">
              A command layer for{" "}
              <span className="relative inline-block text-red-800">
                real site movement
                <span className="absolute -bottom-2 left-1 right-1 h-2 rounded-full bg-red-200/80" />
              </span>
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
              Approvals, BOQs, procurement, labour flow, quality proof, and
              client decisions stay connected to the work happening on site.
            </p>
          </div>
        }
      >
        <ConstructionGifScene />
      </ContainerScroll>
    </div>
  );
}

const ConstructionGifScene = () => {
  const partnerLogos = [
    { mark: "RD", name: "Ractysh Desk", role: "Control" },
    { mark: "AP", name: "Authority Desk", role: "Approval" },
    { mark: "SP", name: "Site Partners", role: "Field" },
    { mark: "QC", name: "Quality Cell", role: "Proof" },
  ];
  const commandTabs = ["Live Ops", "Procure", "QC Proof"];
  const metrics = [
    {
      icon: Layers3,
      value: "12",
      label: "Active scopes",
      detail: "+3 moving",
      percent: 86,
      barClass: "bg-red-300",
      glowClass: "from-red-400/30 to-red-500/5",
    },
    {
      icon: ShieldCheck,
      value: "96%",
      label: "Approval clarity",
      detail: "client ready",
      percent: 96,
      barClass: "bg-emerald-300",
      glowClass: "from-emerald-300/24 to-emerald-500/5",
    },
    {
      icon: AlertTriangle,
      value: "4",
      label: "Risk flags",
      detail: "2 closing",
      percent: 42,
      barClass: "bg-amber-300",
      glowClass: "from-amber-300/24 to-amber-500/5",
    },
    {
      icon: UsersRound,
      value: "8",
      label: "Partner teams",
      detail: "synced",
      percent: 78,
      barClass: "bg-sky-300",
      glowClass: "from-sky-300/24 to-sky-500/5",
    },
  ];
  const executionLanes = [
    { icon: ShieldCheck, label: "Authority approvals", status: "Clear", percent: 100, barClass: "bg-emerald-300" },
    { icon: HardHat, label: "Site execution", status: "Live", percent: 92, barClass: "bg-red-300" },
    { icon: Building2, label: "Material movement", status: "In transit", percent: 74, barClass: "bg-sky-300" },
    { icon: CheckCircle2, label: "Handover evidence", status: "Locked", percent: 88, barClass: "bg-amber-300" },
  ];
  const mapNodes = [
    { label: "Tower A", className: "left-[20%] top-[32%]", delay: 0 },
    { label: "MEP", className: "left-[54%] top-[22%]", delay: 0.18 },
    { label: "QC", className: "left-[70%] top-[60%]", delay: 0.34 },
    { label: "Store", className: "left-[34%] top-[72%]", delay: 0.5 },
  ];
  const alerts = [
    { label: "Concrete pour", value: "06:40", icon: Clock3 },
    { label: "Client approval", value: "Ready", icon: CheckCircle2 },
    { label: "Crew signal", value: "Strong", icon: RadioTower },
  ];

  return (
    <div className="relative min-h-[42rem] w-full overflow-hidden bg-[#030711] sm:min-h-[68rem] md:h-full md:min-h-0">
      <motion.div
        className="absolute inset-0 opacity-80"
        style={{
          backgroundImage:
            "linear-gradient(135deg, rgba(239,68,68,0.24), transparent 30%), linear-gradient(225deg, rgba(56,189,248,0.2), transparent 38%), linear-gradient(180deg, #09111f 0%, #04070d 100%)",
          backgroundSize: "160% 160%",
        }}
        animate={{ backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,7,12,0.08),rgba(5,7,12,0.92))]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.055)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:54px_54px] opacity-50" />

      <div className="absolute inset-0 overflow-hidden rounded-[2rem] bg-slate-950/72 shadow-[0_34px_110px_rgba(0,0,0,0.4)] backdrop-blur-xl sm:inset-4 sm:rounded-[1.35rem] sm:border sm:border-white/12 md:inset-6">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(248,113,113,0.22),transparent_25%),radial-gradient(circle_at_86%_8%,rgba(14,165,233,0.18),transparent_27%),radial-gradient(circle_at_62%_84%,rgba(16,185,129,0.12),transparent_29%),linear-gradient(135deg,rgba(255,255,255,0.09),transparent_48%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:42px_42px] opacity-50" />

        <div className="relative z-10 flex h-full flex-col gap-3 overflow-y-auto px-3 pb-5 pt-11 [-ms-overflow-style:none] [scrollbar-width:none] sm:hidden [&::-webkit-scrollbar]:hidden">
          <motion.div
            initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden rounded-lg border border-white/12 bg-white/[0.075] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-md"
          >
            <div className="flex items-center justify-between gap-3 border-b border-white/10 px-3.5 py-3">
              <div className="flex min-w-0 items-center gap-2.5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-red-200/18 bg-red-500/14 text-red-100 shadow-[0_0_28px_rgba(239,68,68,0.18)]">
                  <Compass className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/44">
                    SiteOS
                  </p>
                  <h3 className="truncate text-base font-semibold text-white">
                    Ractysh Command
                  </h3>
                </div>
              </div>
              <span className="flex shrink-0 items-center gap-1.5 rounded-full border border-emerald-300/20 bg-emerald-400/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-emerald-100">
                <motion.span
                  className="h-1.5 w-1.5 rounded-full bg-emerald-300"
                  animate={{ scale: [0.8, 1.25, 0.8], opacity: [0.55, 1, 0.55] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                />
                Live
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1.5 px-3.5 py-3">
              {commandTabs.map((tab, index) => (
                <span
                  key={tab}
                  className={`rounded-md px-2 py-2 text-center text-[10px] font-semibold ${
                    index === 0
                      ? "border border-red-200/20 bg-red-400/14 text-red-50"
                      : "border border-white/8 bg-black/18 text-white/50"
                  }`}
                >
                  {tab}
                </span>
              ))}
            </div>
          </motion.div>

          <div className="grid grid-cols-2 gap-2">
            {metrics.map((item, index) => {
              const Icon = item.icon;

              return (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{
                    duration: 0.48,
                    delay: 0.12 + index * 0.06,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="relative overflow-hidden rounded-lg border border-white/10 bg-black/32 p-3"
                >
                  <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${item.glowClass}`} />
                  <div className="relative z-10 flex items-start justify-between gap-3">
                    <div>
                      <p className="text-2xl font-semibold leading-none text-white">{item.value}</p>
                      <p className="mt-2 text-[9px] font-semibold uppercase tracking-[0.12em] text-white/48">
                        {item.label}
                      </p>
                    </div>
                    <Icon className="h-4 w-4 text-white/54" />
                  </div>
                  <div className="relative z-10 mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
                    <motion.span
                      className={`block h-full rounded-full ${item.barClass}`}
                      initial={{ width: "0%" }}
                      animate={{ width: `${item.percent}%` }}
                      transition={{ duration: 1, delay: 0.22 + index * 0.08, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </div>
                  <p className="relative z-10 mt-2 text-[10px] font-medium text-white/50">{item.detail}</p>
                </motion.div>
              );
            })}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.65, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="relative min-h-[18.5rem] overflow-hidden rounded-lg border border-white/10 bg-[#06111d]/88 p-4"
          >
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:31px_31px] opacity-55" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_68%_42%,rgba(56,189,248,0.16),transparent_28%),radial-gradient(circle_at_30%_72%,rgba(248,113,113,0.18),transparent_30%)]" />
            <div className="relative z-10 flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-sky-100/66">
                  Signal map
                </p>
                <h3 className="mt-1 text-xl font-semibold leading-none text-white">
                  Tamil Nadu zone
                </h3>
              </div>
              <span className="rounded-md border border-white/10 bg-white/[0.07] px-2.5 py-1 text-[10px] font-semibold text-white/62">
                TN-07
              </span>
            </div>
            <div className="relative z-10 mt-4 h-48 overflow-hidden rounded-lg border border-white/10 bg-black/26">
              <motion.div
                className="absolute left-[16%] top-[45%] h-px w-[68%] origin-left bg-gradient-to-r from-red-300 via-amber-200 to-sky-200"
                animate={{ scaleX: [0.7, 1, 0.7], opacity: [0.42, 0.96, 0.42] }}
                transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div
                className="absolute left-[48%] top-[20%] h-[62%] w-px origin-top bg-gradient-to-b from-sky-200 via-white/60 to-red-300"
                animate={{ scaleY: [0.7, 1, 0.7], opacity: [0.42, 0.92, 0.42] }}
                transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
              />
              {mapNodes.map((node) => (
                <div key={node.label} className={`absolute ${node.className}`}>
                  <motion.span
                    className="absolute left-1/2 top-1/2 h-9 w-9 -translate-x-1/2 -translate-y-1/2 rounded-full border border-red-300/20"
                    animate={{ scale: [0.78, 1.18, 0.78], opacity: [0.16, 0.5, 0.16] }}
                    transition={{ duration: 2.2, delay: node.delay, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <span className="relative z-10 block h-3 w-3 rounded-full bg-red-300 shadow-[0_0_24px_rgba(248,113,113,0.9)]" />
                </div>
              ))}
              <div className="absolute bottom-3 left-3 right-3 grid grid-cols-3 gap-1.5">
                {alerts.map((alert) => {
                  const Icon = alert.icon;

                  return (
                    <div key={alert.label} className="rounded-md border border-white/10 bg-black/36 p-2 backdrop-blur">
                      <Icon className="mb-1 h-3 w-3 text-white/56" />
                      <p className="truncate text-[9px] font-medium text-white/42">{alert.label}</p>
                      <p className="mt-0.5 text-[10px] font-semibold text-white">{alert.value}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.65, delay: 0.26, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-lg border border-white/10 bg-black/28 p-4 backdrop-blur-md"
          >
            <div className="mb-4 flex items-center justify-between gap-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/48">
                Execution lanes
              </p>
              <Workflow className="h-4 w-4 text-white/44" />
            </div>
            <div className="space-y-3">
              {executionLanes.map((lane, index) => {
                const Icon = lane.icon;

                return (
                  <div key={lane.label} className="rounded-md border border-white/10 bg-white/[0.055] p-3">
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <span className="flex min-w-0 items-center gap-2 text-xs font-semibold text-white/76">
                        <Icon className="h-3.5 w-3.5 shrink-0 text-white/50" />
                        <span className="truncate">{lane.label}</span>
                      </span>
                      <span className="text-[10px] font-semibold text-white/48">{lane.status}</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                      <motion.span
                        className={`block h-full rounded-full ${lane.barClass}`}
                        initial={{ width: "0%" }}
                        animate={{ width: `${lane.percent}%` }}
                        transition={{ duration: 1, delay: 0.35 + index * 0.11, ease: [0.22, 1, 0.36, 1] }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.65, delay: 0.34, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-lg border border-white/10 bg-black/32 p-4 backdrop-blur-md"
          >
            <div className="mb-4 flex items-center justify-between gap-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/48">
                Partner matrix
              </p>
              <span className="text-xs font-semibold text-emerald-100/80">
                4 aligned
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {partnerLogos.map((partner, index) => (
                <motion.div
                  key={partner.name}
                  initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{
                    duration: 0.45,
                    delay: 0.4 + index * 0.06,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="rounded-md border border-white/10 bg-white/[0.055] p-2.5"
                >
                  <div className="flex items-center gap-2">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-red-200/18 bg-red-500/14 text-[10px] font-bold text-red-100">
                      {partner.mark}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-xs font-semibold text-white/78">{partner.name}</p>
                      <p className="truncate text-[10px] text-white/42">{partner.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 32, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 hidden flex-wrap items-center gap-3 border-b border-white/10 bg-white/[0.055] px-4 py-3 backdrop-blur-md sm:flex md:flex-nowrap md:px-5"
        >
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-red-200/18 bg-red-500/14 text-red-100 shadow-[0_0_30px_rgba(239,68,68,0.18)]">
              <Compass className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-red-100/75">
                Ractysh SiteOS
              </p>
              <p className="mt-1 truncate text-sm font-semibold text-white md:text-base">
                Live construction intelligence
              </p>
            </div>
          </div>
          <div className="ml-auto flex rounded-lg border border-white/10 bg-black/24 p-1">
            {commandTabs.map((tab, index) => (
              <span
                key={tab}
                className={`rounded-md px-3 py-1.5 text-[11px] font-semibold ${
                  index === 0 ? "bg-red-400/18 text-red-50 shadow-[0_0_26px_rgba(239,68,68,0.12)]" : "text-white/44"
                }`}
              >
                {tab}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-emerald-300/20 bg-emerald-400/10 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-emerald-100">
            <motion.span
              className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_18px_rgba(110,231,183,0.86)]"
              animate={{ scale: [0.8, 1.22, 0.8], opacity: [0.55, 1, 0.55] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            />
            Handover path clear
          </div>
        </motion.div>

        <div className="relative z-10 hidden h-[calc(100%-5.05rem)] grid-cols-[3.9rem_1fr] overflow-hidden sm:grid">
          <aside className="flex flex-col items-center gap-3 border-r border-white/10 bg-black/18 px-2 py-4">
            {[Compass, Activity, Workflow, MapPin, UsersRound, Zap].map((Icon, index) => (
              <span
                key={index}
                className={`flex h-10 w-10 items-center justify-center rounded-lg border ${
                  index === 1 ? "border-red-200/22 bg-red-500/16 text-red-100" : "border-white/8 bg-white/[0.045] text-white/38"
                }`}
              >
                <Icon className="h-4 w-4" />
              </span>
            ))}
          </aside>

          <div className="grid min-h-0 grid-cols-1 gap-3 overflow-hidden p-3 md:grid-cols-[1.18fr_0.82fr] md:gap-4 md:p-4">
            <motion.section
              initial={{ opacity: 0, y: 42, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.75, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="relative min-h-0 overflow-hidden rounded-lg border border-white/12 bg-[#06111d]/86 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur-md"
            >
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.065)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:38px_38px] opacity-65" />
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_28%_28%,rgba(248,113,113,0.19),transparent_24%),radial-gradient(circle_at_74%_50%,rgba(56,189,248,0.18),transparent_27%),radial-gradient(circle_at_50%_86%,rgba(16,185,129,0.12),transparent_25%)]" />
              <div className="relative z-10 flex items-start justify-between gap-4">
                <div className="max-w-[25rem]">
                  <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-sky-100/66">
                    <RadioTower className="h-3.5 w-3.5" />
                    Tamil Nadu project grid
                  </p>
                  <h3 className="mt-3 text-3xl font-semibold leading-none text-white md:text-4xl">
                    Command map
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-white/54">
                    Site crews, authority approvals, material flow, and handover proof tracked in one live execution layer.
                  </p>
                </div>
                <div className="rounded-lg border border-white/10 bg-black/28 p-3 text-right">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/40">
                    Field status
                  </p>
                  <p className="mt-1 text-lg font-semibold text-emerald-100">Controlled</p>
                </div>
              </div>

              <div className="relative mt-5 h-[20rem] overflow-hidden rounded-lg border border-white/10 bg-black/24 md:h-[24rem]">
                <motion.div
                  className="absolute left-[14%] top-[48%] h-px w-[72%] origin-left bg-gradient-to-r from-red-300 via-amber-200 to-sky-200"
                  animate={{ scaleX: [0.68, 1, 0.68], opacity: [0.44, 1, 0.44] }}
                  transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                  className="absolute left-[48%] top-[18%] h-[66%] w-px origin-top bg-gradient-to-b from-sky-200 via-white/60 to-red-300"
                  animate={{ scaleY: [0.7, 1, 0.7], opacity: [0.42, 0.92, 0.42] }}
                  transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                  className="absolute left-[30%] top-[22%] h-[48%] w-[42%] rounded-full border border-sky-200/12"
                  animate={{ scale: [0.92, 1.04, 0.92], opacity: [0.28, 0.56, 0.28] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                />
                {mapNodes.map((node) => (
                  <div key={node.label} className={`absolute ${node.className}`}>
                    <motion.span
                      className="absolute left-1/2 top-1/2 h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full border border-red-300/20"
                      animate={{ scale: [0.78, 1.18, 0.78], opacity: [0.16, 0.52, 0.16] }}
                      transition={{ duration: 2.2, delay: node.delay, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <span className="relative z-10 flex h-4 w-4 items-center justify-center rounded-full bg-red-300 shadow-[0_0_28px_rgba(248,113,113,0.92)]">
                      <span className="h-1.5 w-1.5 rounded-full bg-white" />
                    </span>
                    <span className="absolute left-5 top-1 whitespace-nowrap rounded-md border border-white/10 bg-black/38 px-2 py-1 text-[10px] font-semibold text-white/66 backdrop-blur">
                      {node.label}
                    </span>
                  </div>
                ))}
                <div className="absolute bottom-4 left-4 right-4 grid grid-cols-3 gap-2">
                  {alerts.map((alert) => {
                    const Icon = alert.icon;

                    return (
                      <div key={alert.label} className="rounded-lg border border-white/10 bg-black/42 p-3 backdrop-blur-md">
                        <Icon className="mb-2 h-4 w-4 text-white/54" />
                        <p className="truncate text-[10px] font-medium uppercase tracking-[0.12em] text-white/38">{alert.label}</p>
                        <p className="mt-1 text-sm font-semibold text-white">{alert.value}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="relative z-10 mt-3 grid grid-cols-4 gap-2">
                {metrics.map((item, index) => {
                  const Icon = item.icon;

                  return (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, y: 22, filter: "blur(8px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      transition={{
                        duration: 0.5,
                        delay: 0.28 + index * 0.07,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="relative overflow-hidden rounded-lg border border-white/10 bg-black/34 p-3"
                    >
                      <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${item.glowClass}`} />
                      <div className="relative z-10 flex items-center justify-between gap-2">
                        <p className="text-xl font-semibold text-white">{item.value}</p>
                        <Icon className="h-4 w-4 text-white/46" />
                      </div>
                      <p className="relative z-10 mt-1 truncate text-[10px] font-semibold uppercase tracking-[0.1em] text-white/42">
                        {item.label}
                      </p>
                    </motion.div>
                  );
                })}
              </div>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 42, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.75, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="grid min-h-0 grid-rows-[auto_minmax(0,1fr)] gap-3"
            >
              <div className="rounded-lg border border-white/12 bg-black/28 p-3 backdrop-blur-md">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/48">
                      Active scope
                    </p>
                    <p className="mt-1 text-2xl font-semibold leading-none text-white">Live</p>
                  </div>
                  <span className="rounded-md border border-red-200/20 bg-red-500/12 px-2.5 py-1.5 text-[11px] font-semibold text-red-100">
                    Controlled
                  </span>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {metrics.slice(0, 2).map((item) => {
                    const Icon = item.icon;

                    return (
                      <div key={item.label} className="rounded-md border border-white/10 bg-white/[0.055] p-2.5">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-base font-semibold text-white">{item.value}</p>
                          <Icon className="h-3.5 w-3.5 text-white/46" />
                        </div>
                        <p className="mt-1 truncate text-[9px] font-semibold uppercase tracking-[0.1em] text-white/42">{item.label}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="min-h-0 overflow-hidden rounded-lg border border-white/12 bg-black/28 p-3 backdrop-blur-md">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/48">
                    Execution lanes
                  </p>
                  <ArrowUpRight className="h-4 w-4 text-white/42" />
                </div>
                <div className="mt-3 space-y-2">
                  {executionLanes.map((lane, index) => {
                    const Icon = lane.icon;

                    return (
                      <div key={lane.label} className="rounded-md border border-white/10 bg-white/[0.055] p-2.5">
                        <div className="mb-2 flex items-center justify-between gap-2">
                          <span className="flex min-w-0 items-center gap-2 text-xs font-semibold text-white/76">
                            <Icon className="h-3.5 w-3.5 shrink-0 text-white/46" />
                            <span className="truncate">{lane.label}</span>
                          </span>
                          <span className="shrink-0 text-[10px] font-semibold text-white/44">{lane.status}</span>
                        </div>
                        <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                          <motion.span
                            className={`block h-full rounded-full ${lane.barClass}`}
                            initial={{ width: "0%" }}
                            animate={{ width: `${lane.percent}%` }}
                            transition={{ duration: 1, delay: 0.4 + index * 0.1, ease: [0.22, 1, 0.36, 1] }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-3 flex items-center justify-between gap-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/48">
                    Partner matrix
                  </p>
                  <span className="text-xs font-semibold text-emerald-100/80">4 aligned</span>
                </div>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {partnerLogos.map((partner, index) => (
                    <motion.div
                      key={partner.name}
                      initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      transition={{
                        duration: 0.5,
                        delay: 0.44 + index * 0.08,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="flex min-w-0 items-center gap-2 rounded-md border border-white/10 bg-black/24 p-2"
                    >
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-red-200/18 bg-red-500/14 text-[9px] font-bold text-red-100">
                        {partner.mark}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-[11px] font-semibold text-white/78">{partner.name}</p>
                        <p className="truncate text-[9px] text-white/40">{partner.role}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.section>
          </div>
        </div>
      </div>
    </div>
  );
};
