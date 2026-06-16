"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  Building2,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  FileText,
  Layers3,
  Network,
  Route,
  ShieldCheck,
  type LucideIcon
} from "lucide-react";
import Link from "next/link";
import { ServiceRequestCTA } from "@/components/ServiceRequestCTA";

const ease = [0.22, 1, 0.36, 1] as const;

const heroLayers = [
  {
    kicker: "Strategy Layer",
    title: "Board intent translated into workstream control",
    className: "left-5 right-20 top-8 sm:left-8 sm:right-28 sm:top-10"
  },
  {
    kicker: "Coordination Layer",
    title: "Resources, vendors and infrastructure synced live",
    className: "left-12 right-8 top-[9.5rem] sm:left-24 sm:right-10 sm:top-[11rem]"
  },
  {
    kicker: "Execution Layer",
    title: "Milestones governed through a single operating rhythm",
    className: "left-7 right-14 top-[18rem] sm:left-12 sm:right-24 sm:top-[20rem]"
  }
];

const processSteps = [
  {
    title: "Strategy",
    body: "Executive intent, delivery priorities and operating constraints are converted into a controlled execution charter.",
    Icon: Route
  },
  {
    title: "Planning",
    body: "Milestones, dependencies, vendors and internal teams are mapped into a calm plan of action.",
    Icon: ClipboardCheck
  },
  {
    title: "Coordination",
    body: "People, approvals, sites and information flows are synchronized before complexity reaches delivery.",
    Icon: Network
  },
  {
    title: "Execution",
    body: "Live workstreams are managed through disciplined review cycles and focused decision pathways.",
    Icon: Layers3
  },
  {
    title: "Delivery",
    body: "Completion readiness, reporting and handover are closed with executive-grade visibility.",
    Icon: CheckCircle2
  }
];

const modules: Array<{
  title: string;
  body: string;
  Icon: LucideIcon;
}> = [
  {
    title: "Construction Oversight",
    body: "Site, asset and delivery movement observed through a composed operational lens.",
    Icon: Building2
  },
  {
    title: "Resource Coordination",
    body: "Teams, vendors and material dependencies aligned before delivery pressure compounds.",
    Icon: Network
  },
  {
    title: "Timeline Control",
    body: "Milestones monitored with escalation discipline and clear ownership across every layer.",
    Icon: Clock3
  },
  {
    title: "Enterprise Reporting",
    body: "Executive status narratives distilled into concise, decision-ready reporting cadences.",
    Icon: FileText
  },
  {
    title: "Delivery Monitoring",
    body: "Completion signals, blockers and acceptance checkpoints governed through one desk.",
    Icon: ShieldCheck
  }
];

const metrics = [
  { value: "24", label: "Active Enterprise Operations", note: "Live coordination environments" },
  { value: "05", label: "Coordinated Project Layers", note: "Strategy, planning, teams, sites, delivery" },
  { value: "360", label: "Execution Coverage", note: "End-to-end visibility across workstreams" },
  { value: "Live", label: "Operational Sync Status", note: "Executive reporting layer active" }
];

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

function Reveal({ children, className, delay = 0 }: RevealProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 34 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18, margin: "0px 0px -90px 0px" }}
      transition={{ duration: 0.82, delay, ease }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function ProjectManagementExecutionPage() {
  return (
    <article className="pm-project-page relative isolate overflow-hidden bg-[#f7f1e6] text-[#1c1712] font-manrope">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#fffaf0_0%,#f7f1e6_42%,#f1e7d7_100%)]" />
        <div className="pm-page-grid absolute inset-0 opacity-70" />
        <div className="absolute inset-x-0 top-[42rem] h-px bg-gradient-to-r from-transparent via-[#c6a45b]/30 to-transparent" />
      </div>

      <HeroSection />
      <ExecutionProcess />
      <LiveOperationModules />
      <EnterpriseMetrics />
      <FullWidthVisual />
      <ProjectExecutionCTA />

      <style>{`
        .pm-page-grid {
          background-image:
            linear-gradient(rgba(31, 23, 16, 0.045) 1px, transparent 1px),
            linear-gradient(90deg, rgba(31, 23, 16, 0.035) 1px, transparent 1px),
            linear-gradient(135deg, transparent 0%, transparent 49%, rgba(198, 164, 91, 0.055) 50%, transparent 51%, transparent 100%);
          background-size: 92px 92px, 92px 92px, 420px 420px;
          mask-image: linear-gradient(180deg, black 0%, rgba(0, 0, 0, 0.7) 44%, transparent 92%);
        }

        .pm-ecosystem {
          box-shadow:
            0 44px 110px rgba(67, 53, 34, 0.16),
            inset 0 1px 0 rgba(255, 255, 255, 0.82);
        }

        .pm-visual-grid {
          background-image:
            linear-gradient(rgba(31, 23, 16, 0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(31, 23, 16, 0.07) 1px, transparent 1px);
          background-size: 54px 54px;
          mask-image: linear-gradient(180deg, rgba(0, 0, 0, 0.82), rgba(0, 0, 0, 0.34));
        }

        .pm-system-path {
          fill: none;
          stroke: rgba(142, 111, 48, 0.42);
          stroke-width: 1.3;
          stroke-dasharray: 10 14;
          animation: pm-system-dash 15s linear infinite;
          vector-effect: non-scaling-stroke;
        }

        .pm-system-path-muted {
          stroke: rgba(31, 23, 16, 0.16);
          stroke-dasharray: none;
          animation: none;
        }

        .pm-route-node {
          fill: #c6a45b;
          filter: drop-shadow(0 0 10px rgba(198, 164, 91, 0.5));
        }

        .pm-ecosystem-layer {
          animation: pm-layer-float 8.5s ease-in-out infinite;
          box-shadow:
            0 24px 58px rgba(63, 49, 30, 0.12),
            inset 0 1px 0 rgba(255, 255, 255, 0.74);
        }

        .pm-layer-scan {
          animation: pm-layer-scan 4.8s ease-in-out infinite;
        }

        .pm-live-node {
          animation: pm-node-pulse 3.4s ease-in-out infinite;
        }

        .pm-progress-line::after,
        .pm-process-spine::after {
          content: "";
          position: absolute;
          background: linear-gradient(180deg, rgba(198, 164, 91, 0), rgba(198, 164, 91, 0.8), rgba(198, 164, 91, 0));
        }

        .pm-progress-line::after {
          inset-block: 0;
          left: 0;
          width: 34%;
          transform: translateX(-120%);
          background: linear-gradient(90deg, rgba(198, 164, 91, 0), rgba(198, 164, 91, 0.8), rgba(198, 164, 91, 0));
          animation: pm-horizontal-sync 5.4s ease-in-out infinite;
        }

        .pm-process-spine::after {
          left: 0;
          right: 0;
          top: 0;
          height: 28%;
          animation: pm-vertical-sync 6.8s ease-in-out infinite;
        }

        .pm-process-card,
        .pm-module-card,
        .pm-metric-tile {
          transition:
            transform 360ms cubic-bezier(0.22, 1, 0.36, 1),
            border-color 360ms cubic-bezier(0.22, 1, 0.36, 1),
            box-shadow 360ms cubic-bezier(0.22, 1, 0.36, 1),
            background-color 360ms cubic-bezier(0.22, 1, 0.36, 1);
        }

        .pm-process-card:hover,
        .pm-module-card:hover {
          transform: translateY(-7px);
          border-color: rgba(198, 164, 91, 0.58);
          background-color: rgba(255, 253, 248, 0.9);
          box-shadow: 0 26px 70px rgba(72, 56, 35, 0.13), 0 0 28px rgba(198, 164, 91, 0.11);
        }

        .pm-module-connector {
          transform: scaleX(0.32);
          transform-origin: left;
          opacity: 0.42;
          transition:
            transform 360ms cubic-bezier(0.22, 1, 0.36, 1),
            opacity 360ms cubic-bezier(0.22, 1, 0.36, 1);
        }

        .pm-module-card:hover .pm-module-connector {
          transform: scaleX(1);
          opacity: 1;
        }

        .pm-primary-cta {
          box-shadow:
            0 18px 48px rgba(17, 16, 14, 0.2),
            0 0 26px rgba(198, 164, 91, 0.15),
            inset 0 1px 0 rgba(255, 255, 255, 0.12);
        }

        .pm-primary-cta:hover {
          box-shadow:
            0 24px 62px rgba(17, 16, 14, 0.28),
            0 0 34px rgba(198, 164, 91, 0.22),
            inset 0 1px 0 rgba(255, 255, 255, 0.16);
        }

        .pm-secondary-cta {
          background-image: linear-gradient(115deg, rgba(255, 253, 248, 0.2) 0%, rgba(255, 253, 248, 0.86) 48%, rgba(198, 164, 91, 0.13) 100%);
          background-size: 220% 100%;
          background-position: 100% 0;
          transition:
            transform 300ms cubic-bezier(0.22, 1, 0.36, 1),
            border-color 300ms cubic-bezier(0.22, 1, 0.36, 1),
            box-shadow 300ms cubic-bezier(0.22, 1, 0.36, 1),
            background-position 520ms cubic-bezier(0.22, 1, 0.36, 1);
        }

        .pm-secondary-cta:hover {
          background-position: 0 0;
        }

        @keyframes pm-system-dash {
          to {
            stroke-dashoffset: -96;
          }
        }

        @keyframes pm-layer-float {
          0%,
          100% {
            transform: translate3d(0, 0, 0);
          }

          50% {
            transform: translate3d(0, -10px, 0);
          }
        }

        @keyframes pm-layer-scan {
          0% {
            opacity: 0;
            transform: translateX(-120%);
          }

          24%,
          68% {
            opacity: 1;
          }

          100% {
            opacity: 0;
            transform: translateX(320%);
          }
        }

        @keyframes pm-node-pulse {
          0%,
          100% {
            opacity: 0.58;
            transform: scale(0.92);
          }

          50% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes pm-horizontal-sync {
          0% {
            opacity: 0;
            transform: translateX(-120%);
          }

          18%,
          72% {
            opacity: 1;
          }

          100% {
            opacity: 0;
            transform: translateX(330%);
          }
        }

        @keyframes pm-vertical-sync {
          0% {
            opacity: 0;
            transform: translateY(-40%);
          }

          20%,
          70% {
            opacity: 1;
          }

          100% {
            opacity: 0;
            transform: translateY(340%);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .pm-system-path,
          .pm-ecosystem-layer,
          .pm-layer-scan,
          .pm-live-node,
          .pm-progress-line::after,
          .pm-process-spine::after {
            animation: none !important;
          }

          .pm-process-card:hover,
          .pm-module-card:hover {
            transform: none;
          }
        }

        @media (max-width: 767px) {
          .pm-page-grid {
            background-size: 68px 68px, 68px 68px, 280px 280px;
          }

          .pm-ecosystem-layer {
            animation: none;
          }
        }
      `}</style>
    </article>
  );
}

function HeroSection() {
  return (
    <section className="relative z-10 flex min-h-screen items-center px-5 pb-20 pt-32 sm:px-6 md:px-8 lg:pt-28">
      <div className="mx-auto grid w-full max-w-[1220px] gap-14 lg:grid-cols-[minmax(0,0.88fr)_minmax(28rem,1.12fr)] lg:items-center">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.78, ease }}
            className="text-[0.72rem] font-bold uppercase leading-none text-[#8e6f30]"
          >
            Project Execution Systems
          </motion.p>

          <h1
            aria-label="Project execution coordinated through precision systems."
            className="mt-7 max-w-[760px] font-display text-[3.35rem] font-semibold leading-[0.94] text-[#18130f] sm:text-[4.65rem] lg:text-[5.25rem] xl:text-[5.9rem]"
          >
            {["Project execution", "coordinated through", "precision systems."].map((line, index) => (
              <motion.span
                key={line}
                aria-hidden="true"
                initial={{ opacity: 0, y: 34 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.86, delay: 0.08 + index * 0.1, ease }}
                className="block"
              >
                {line}
              </motion.span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.86, delay: 0.38, ease }}
            className="mt-7 max-w-[630px] text-[1.03rem] font-medium leading-8 text-[#574d40] sm:text-[1.1rem]"
          >
            Ractysh manages enterprise operations, construction coordination and execution workflows through one integrated management layer.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.86, delay: 0.5, ease }}
            className="mt-11 flex flex-col gap-3 sm:flex-row"
          >
            <Link
              href="/book-consultation"
              className="pm-primary-cta group inline-flex min-h-[3.15rem] items-center justify-center gap-2 rounded-[8px] border border-[#11100e] bg-[#11100e] px-6 text-[0.94rem] font-semibold text-[#fffaf0] transition duration-300 hover:-translate-y-1 hover:bg-[#050505] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#c6a45b]"
            >
              Book Consultation
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={2.1} />
            </Link>
            <a
              href="#execution-process"
              className="pm-secondary-cta group inline-flex min-h-[3.15rem] items-center justify-center gap-2 rounded-[8px] border border-[#c6a45b]/52 bg-[#fffdf8]/42 px-6 text-[0.94rem] font-semibold text-[#1d1711] shadow-[inset_0_1px_0_rgba(255,255,255,0.86)] transition duration-300 hover:-translate-y-1 hover:border-[#c6a45b]/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#c6a45b]"
            >
              View Execution Flow
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={2.1} />
            </a>
          </motion.div>
        </div>

        <OperationalEcosystemVisual />
      </div>
    </section>
  );
}

function OperationalEcosystemVisual() {
  const reduceMotion = useReducedMotion();
  const routeOne = "M58 130 C148 74 258 84 348 142 S504 232 594 156";
  const routeTwo = "M78 312 C174 256 244 372 334 314 S500 210 585 298";
  const routeThree = "M84 226 C198 174 282 222 366 248 S498 330 586 250";

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 36 }}
      animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.92, delay: 0.18, ease }}
      className="relative mx-auto w-full max-w-[650px]"
    >
      <div className="pm-ecosystem relative h-[30rem] overflow-hidden rounded-[8px] border border-[#dac9aa] bg-[#fffdf8]/72 backdrop-blur-sm sm:h-[35rem]">
        <div className="pm-visual-grid absolute inset-0" />
        <div className="absolute inset-x-8 top-8 flex items-center justify-between text-[0.68rem] font-bold uppercase text-[#8e6f30]/82">
          <span>Integrated Management Layer</span>
          <span className="inline-flex items-center gap-2 text-[#4f5f42]">
            <span className="pm-live-node h-2 w-2 rounded-full bg-[#6f7c5a] shadow-[0_0_0_6px_rgba(111,124,90,0.12)]" />
            Live Sync
          </span>
        </div>

        <svg aria-hidden="true" className="absolute inset-0 h-full w-full" viewBox="0 0 640 520" preserveAspectRatio="none">
          <path className="pm-system-path pm-system-path-muted" d="M34 86 H606" />
          <path className="pm-system-path pm-system-path-muted" d="M46 430 H590" />
          <path className="pm-system-path" d={routeOne} />
          <path className="pm-system-path" d={routeTwo} />
          <path className="pm-system-path" d={routeThree} />
          <circle cx="58" cy="130" r="4" fill="#18130f" opacity="0.42" />
          <circle cx="594" cy="156" r="4" fill="#18130f" opacity="0.42" />
          <circle cx="78" cy="312" r="4" fill="#18130f" opacity="0.42" />
          <circle cx="585" cy="298" r="4" fill="#18130f" opacity="0.42" />
          {!reduceMotion ? (
            <>
              <circle className="pm-route-node" r="4.5">
                <animateMotion dur="8.5s" repeatCount="indefinite" path={routeOne} />
              </circle>
              <circle className="pm-route-node" r="3.8">
                <animateMotion dur="10s" repeatCount="indefinite" path={routeTwo} />
              </circle>
              <circle className="pm-route-node" r="3.4">
                <animateMotion dur="11.5s" repeatCount="indefinite" path={routeThree} />
              </circle>
            </>
          ) : null}
        </svg>

        {heroLayers.map((layer, index) => (
          <div
            key={layer.kicker}
            className={`pm-ecosystem-layer absolute rounded-[8px] border border-[#d8c49b]/78 bg-[#fffdf8]/78 p-4 backdrop-blur-sm ${layer.className}`}
            style={{ animationDelay: `${index * 0.7}s` }}
          >
            <div className="flex items-center justify-between gap-4">
              <span className="text-[0.67rem] font-bold uppercase text-[#8e6f30]">{layer.kicker}</span>
              <span className="inline-flex h-6 items-center rounded-full border border-[#d8c49b]/70 bg-[#f7f1e6]/80 px-2 text-[0.66rem] font-bold uppercase text-[#4b4032]">
                0{index + 1}
              </span>
            </div>
            <p className="mt-3 max-w-[24rem] font-display text-[1.58rem] font-semibold leading-tight text-[#18130f] sm:text-[1.85rem]">
              {layer.title}
            </p>
            <div className="pm-progress-line relative mt-4 h-px overflow-hidden bg-[#1c1712]/12">
              <span className="pm-layer-scan block h-px w-1/3 bg-[#c6a45b]" />
            </div>
          </div>
        ))}

        <div className="absolute bottom-6 left-5 right-5 grid gap-2 rounded-[8px] border border-[#d9c9aa]/72 bg-[#17130f]/92 p-3 text-[#fffaf0] shadow-[0_22px_50px_rgba(23,19,15,0.18)] sm:left-8 sm:right-8 sm:grid-cols-3 sm:p-4">
          {["Scope locked", "Teams synced", "Delivery watched"].map((item) => (
            <div key={item} className="flex items-center gap-2 text-[0.76rem] font-semibold">
              <CheckCircle2 className="h-4 w-4 text-[#d8bd73]" strokeWidth={2} />
              {item}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function ExecutionProcess() {
  return (
    <section id="execution-process" className="relative z-10 px-5 py-20 sm:px-6 md:px-8 lg:py-28">
      <div className="mx-auto max-w-[1140px]">
        <Reveal className="mx-auto max-w-[770px] text-center">
          <p className="text-[0.72rem] font-bold uppercase text-[#8e6f30]">Execution Process</p>
          <h2 className="mt-5 font-display text-[2.7rem] font-semibold leading-[0.98] text-[#18130f] sm:text-[3.8rem] lg:text-[4.35rem]">
            Strategy to delivery, governed as one enterprise rhythm.
          </h2>
          <p className="mx-auto mt-6 max-w-[630px] text-[1rem] font-medium leading-8 text-[#625649]">
            The flow stays simple at the executive level while each operating layer carries precise accountability underneath.
          </p>
        </Reveal>

        <div className="relative mt-16 lg:mt-20">
          <div className="pm-process-spine absolute bottom-8 left-1/2 top-8 hidden w-px -translate-x-1/2 overflow-hidden bg-[#cdbb91]/60 lg:block" />
          <ol className="space-y-8 lg:space-y-12">
            {processSteps.map((step, index) => {
              const Icon = step.Icon;
              const alternate = index % 2 === 1;

              return (
                <li key={step.title} className="relative grid gap-5 lg:grid-cols-[minmax(0,1fr)_5rem_minmax(0,1fr)] lg:items-center">
                  <Reveal
                    delay={index * 0.04}
                    className={`pm-process-card rounded-[8px] border border-[#decda9] bg-[#fffdf8]/66 p-6 shadow-[0_18px_58px_rgba(69,52,31,0.08)] backdrop-blur-sm sm:p-7 ${
                      alternate ? "lg:col-start-3" : "lg:col-start-1"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-5">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[8px] border border-[#d8c49b] bg-[#fffaf0] text-[#8e6f30]">
                        <Icon className="h-5 w-5" strokeWidth={1.9} />
                      </div>
                      <span className="font-display text-[3rem] font-semibold leading-none text-[#18130f]/10">0{index + 1}</span>
                    </div>
                    <h3 className="mt-8 font-display text-[2rem] font-semibold leading-none text-[#18130f]">{step.title}</h3>
                    <p className="mt-4 text-[0.96rem] font-medium leading-7 text-[#625649]">{step.body}</p>
                  </Reveal>

                  <div className="hidden lg:col-start-2 lg:row-start-1 lg:flex lg:items-center lg:justify-center">
                    <span className="relative flex h-14 w-14 items-center justify-center rounded-full border border-[#c6a45b]/60 bg-[#fffaf0] shadow-[0_14px_32px_rgba(69,52,31,0.1)]">
                      <span className="pm-live-node absolute h-3 w-3 rounded-full bg-[#c6a45b] shadow-[0_0_0_8px_rgba(198,164,91,0.13)]" style={{ animationDelay: `${index * 0.24}s` }} />
                    </span>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}

function LiveOperationModules() {
  return (
    <section className="relative z-10 px-5 py-20 sm:px-6 md:px-8 lg:py-28">
      <div className="mx-auto max-w-[1180px]">
        <Reveal className="flex flex-col justify-between gap-7 md:flex-row md:items-end">
          <div>
            <p className="text-[0.72rem] font-bold uppercase text-[#8e6f30]">Live Operation Modules</p>
            <h2 className="mt-5 max-w-[660px] font-display text-[2.7rem] font-semibold leading-[0.98] text-[#18130f] sm:text-[3.8rem] lg:text-[4.35rem]">
              Floating control surfaces for enterprise coordination.
            </h2>
          </div>
          <p className="max-w-[430px] text-[1rem] font-medium leading-8 text-[#625649]">
            Each module isolates operational pressure without turning the experience into a dense dashboard.
          </p>
        </Reveal>

        <div className="relative mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-6">
          {modules.map((module, index) => {
            const Icon = module.Icon;
            const wide = index === 0 || index === 4;

            return (
              <Reveal key={module.title} delay={index * 0.04} className={wide ? "lg:col-span-3" : "lg:col-span-2"}>
                <article className="pm-module-card group relative h-full overflow-hidden rounded-[8px] border border-[#decda9] bg-[#fffdf8]/70 p-6 shadow-[0_22px_62px_rgba(69,52,31,0.09)] backdrop-blur-sm sm:p-7">
                  <div className="flex items-start justify-between gap-5">
                    <div className="flex h-12 w-12 items-center justify-center rounded-[8px] border border-[#d8c49b] bg-[#fffaf0] text-[#8e6f30] shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
                      <Icon className="h-5 w-5" strokeWidth={1.9} />
                    </div>
                    <span className="rounded-full border border-[#d8c49b]/68 bg-[#f8f1e4]/72 px-3 py-1 text-[0.68rem] font-bold uppercase text-[#7c6a49]">
                      Module 0{index + 1}
                    </span>
                  </div>
                  <h3 className="mt-10 font-display text-[2rem] font-semibold leading-tight text-[#18130f]">{module.title}</h3>
                  <p className="mt-4 max-w-[28rem] text-[0.96rem] font-medium leading-7 text-[#625649]">{module.body}</p>
                  <div className="pm-module-connector mt-8 h-px bg-gradient-to-r from-[#c6a45b] via-[#d8c49b] to-transparent" />
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function EnterpriseMetrics() {
  return (
    <section className="relative z-10 px-5 py-20 sm:px-6 md:px-8 lg:py-28">
      <Reveal className="mx-auto max-w-[1180px]">
        <div className="rounded-[8px] border border-[#decda9] bg-[#fffdf8]/66 p-5 shadow-[0_26px_82px_rgba(69,52,31,0.1)] backdrop-blur-sm sm:p-8">
          <div className="flex flex-col justify-between gap-6 border-b border-[#1c1712]/10 pb-8 md:flex-row md:items-end">
            <div>
              <p className="text-[0.72rem] font-bold uppercase text-[#8e6f30]">Enterprise Metrics</p>
              <h2 className="mt-4 font-display text-[2.55rem] font-semibold leading-none text-[#18130f] sm:text-[3.45rem]">
                Minimal signals. Maximum clarity.
              </h2>
            </div>
            <div className="flex items-center gap-2 text-[0.86rem] font-bold text-[#4f5f42]">
              <span className="pm-live-node h-2 w-2 rounded-full bg-[#6f7c5a] shadow-[0_0_0_6px_rgba(111,124,90,0.12)]" />
              Operating cadence active
            </div>
          </div>

          <div className="grid gap-5 pt-8 sm:grid-cols-2 lg:grid-cols-4">
            {metrics.map((metric) => (
              <div key={metric.label} className="pm-metric-tile rounded-[8px] border border-[#decda9]/72 bg-[#fffaf0]/58 p-5">
                <p className="font-display text-[3.25rem] font-semibold leading-none text-[#18130f] sm:text-[3.65rem]">{metric.value}</p>
                <p className="mt-5 text-[0.92rem] font-bold text-[#1c1712]">{metric.label}</p>
                <p className="mt-3 text-[0.84rem] font-medium leading-6 text-[#6a5d4d]">{metric.note}</p>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}

function FullWidthVisual() {
  return (
    <section className="relative z-10 px-0 py-20 lg:py-28">
      <Reveal className="mx-auto max-w-[1500px] px-5 sm:px-6 md:px-8">
        <div className="relative min-h-[34rem] overflow-hidden rounded-[8px] border border-[#d7c49e] bg-[#17130f] shadow-[0_34px_100px_rgba(54,40,24,0.16)] lg:min-h-[43rem]">
          <img
            src="/contact/enterprise-architecture-workspace.webp"
            alt="Premium enterprise architecture workspace with project plans and controlled execution atmosphere"
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
            decoding="async"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(18,14,10,0.82)_0%,rgba(18,14,10,0.48)_42%,rgba(18,14,10,0.08)_100%)]" />
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-[linear-gradient(180deg,rgba(18,14,10,0),rgba(18,14,10,0.58))]" />
          <div className="relative flex min-h-[34rem] items-end p-7 sm:p-10 lg:min-h-[43rem] lg:p-14">
            <div className="max-w-[650px]">
              <p className="text-[0.72rem] font-bold uppercase text-[#e2c476]">Controlled Enterprise Execution</p>
              <h2 className="mt-5 font-display text-[3rem] font-semibold leading-[0.96] text-[#fffaf0] sm:text-[4.25rem] lg:text-[5rem]">
                Designed for
                <span className="block">controlled enterprise</span>
                <span className="block">execution.</span>
              </h2>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

function ProjectExecutionCTA() {
  return (
    <section className="relative z-10 px-5 py-20 sm:px-6 md:px-8 lg:py-28">
      <Reveal className="mx-auto max-w-[920px] text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-[8px] border border-[#d8c49b] bg-[#fffdf8]/76 text-[#8e6f30] shadow-[0_18px_44px_rgba(69,52,31,0.1)]">
          <BarChart3 className="h-5 w-5" strokeWidth={1.9} />
        </div>
        <h2 className="mx-auto mt-7 max-w-[760px] font-display text-[2.9rem] font-semibold leading-[0.98] text-[#18130f] sm:text-[4.1rem] lg:text-[4.8rem]">
          Connect with the Ractysh project execution desk.
        </h2>
        <p className="mx-auto mt-6 max-w-[610px] text-[1rem] font-medium leading-8 text-[#625649]">
          Bring project planning, construction coordination and delivery oversight into one calm operating layer.
        </p>
        <div className="mt-11 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/book-consultation"
            className="pm-primary-cta group inline-flex min-h-[3.15rem] w-full items-center justify-center gap-2 rounded-[8px] border border-[#11100e] bg-[#11100e] px-6 text-[0.94rem] font-semibold text-[#fffaf0] transition duration-300 hover:-translate-y-1 hover:bg-[#050505] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#c6a45b] sm:w-auto"
          >
            Book Consultation
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={2.1} />
          </Link>
          <ServiceRequestCTA
            className="w-full sm:w-auto"
            showLabel={false}
            buttonLabel="Connect With This Division"
            buttonClassName="pm-secondary-cta relative isolate min-h-[3.15rem] w-full rounded-[8px] border-[#c6a45b]/52 bg-[#fffdf8]/42 px-6 text-[0.94rem] text-[#1d1711] shadow-[inset_0_1px_0_rgba(255,255,255,0.86)] hover:border-[#c6a45b]/80 hover:bg-[#fffdf8]/68 hover:shadow-[0_18px_44px_rgba(96,76,36,0.12),0_0_24px_rgba(198,164,91,0.13),inset_0_1px_0_rgba(255,255,255,0.9)] sm:w-auto"
          />
        </div>
      </Reveal>
    </section>
  );
}
