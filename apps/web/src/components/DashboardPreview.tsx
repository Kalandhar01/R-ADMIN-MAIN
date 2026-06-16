"use client";

import {
  ArrowDownUp,
  ChartNoAxesColumn,
  ChevronDown,
  LayoutGrid,
  Shield,
  Sparkle,
  SquareAsterisk,
  UsersRound,
  Waypoints
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Division } from "@/lib/types";
import { DashboardCard } from "@/components/DashboardCard";
import { cn } from "@/lib/utils";

interface DashboardPreviewProps {
  divisions: Division[];
  enableDesktopFloat?: boolean;
}

const mobileDashboardEase = [0.22, 1, 0.36, 1] as const;
const mobileDashboardQuery = "(max-width: 767px)";
const mobileIconStartDelay = 0.82;
const mobileCardStartDelay = 1.42;
const mobileIdleStartDelay = 2.35;
const mobileDashboardFailsafeMs = 3_500;

function debugMobileDashboard(message: string, reason?: string) {
  if (process.env.NODE_ENV === "development") {
    console.debug(`[MobileDashboard] ${message}${reason ? ` (${reason})` : ""}`);
  }
}

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    const updateMatches = () => setMatches(mediaQuery.matches);

    updateMatches();
    mediaQuery.addEventListener("change", updateMatches);
    return () => mediaQuery.removeEventListener("change", updateMatches);
  }, [query]);

  return matches;
}

export function DashboardPreview({ divisions, enableDesktopFloat = false }: DashboardPreviewProps) {
  void divisions;
  const shouldReduceMotion = useReducedMotion();
  const isMobileDashboard = useMediaQuery(mobileDashboardQuery);
  const shouldAnimateMobileDashboard = isMobileDashboard && !shouldReduceMotion;
  const bootRef = useRef<HTMLDivElement | null>(null);
  const mobileDashboardVisibleRef = useRef(false);
  const [mobileDashboardVisible, setMobileDashboardVisible] = useState(false);

  const miniCards = [
    {
      title: "Architecture & Real Estate Mandate",
      eyebrow: "Spatial + Asset Strategy",
      status: "In Progress",
      description: "Coordinate planning logic, property positioning, investor material and stakeholder approvals",
      iconText: "ARE",
      assignee: "Ractysh A",
      progress: "9 out of 14",
      due: "Active cycle"
    },
    {
      title: "Construction Delivery Control",
      eyebrow: "Construction Command",
      status: "In Progress",
      description: "Track civil works, MEP, building construction, interiors, landscape, swimming pools, lifts and turnkey delivery",
      iconText: "CON",
      assignee: "Ractysh C",
      progress: "18 out of 26",
      due: "Live lane"
    },
    {
      title: "Export-Import & OTC Exchange Desk",
      eyebrow: "Trade + Private Deals",
      status: "Ongoing",
      description: "Manage supplier movement, documentation, counterparty intake and private transaction readiness",
      iconText: "OTC",
      assignee: "Ractysh E",
      progress: "11 out of 18",
      due: "Private desk"
    }
  ];

  const sidebarIcons = [LayoutGrid, Waypoints, ChartNoAxesColumn, Sparkle, UsersRound, Shield];

  const showMobileDashboard = useCallback((reason: string) => {
    if (mobileDashboardVisibleRef.current) return;

    mobileDashboardVisibleRef.current = true;
    debugMobileDashboard("Dashboard Visible", reason);
    setMobileDashboardVisible(true);
  }, []);

  useEffect(() => {
    debugMobileDashboard("Dashboard Mounted");
  }, []);

  useEffect(() => {
    if (!shouldAnimateMobileDashboard) {
      mobileDashboardVisibleRef.current = false;
      setMobileDashboardVisible(false);
      return;
    }

    mobileDashboardVisibleRef.current = false;
    setMobileDashboardVisible(false);
    debugMobileDashboard("Animation Started");

    let cancelled = false;
    let frame = 0;
    let observer: IntersectionObserver | null = null;

    const complete = (reason: string) => {
      if (!cancelled) showMobileDashboard(reason);
    };

    const failsafe = window.setTimeout(() => complete("failsafe"), mobileDashboardFailsafeMs);
    const node = bootRef.current;

    if (node && "IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting || entry.intersectionRatio > 0)) {
            complete("viewport");
            observer?.disconnect();
          }
        },
        { threshold: 0.2, rootMargin: "120px 0px" }
      );
      observer.observe(node);
    } else {
      frame = window.requestAnimationFrame(() => complete("fallback"));
    }

    return () => {
      cancelled = true;
      window.clearTimeout(failsafe);
      if (frame) window.cancelAnimationFrame(frame);
      observer?.disconnect();
    };
  }, [shouldAnimateMobileDashboard, showMobileDashboard]);

  return (
    <div
      data-main-dashboard
      className="home-dashboard-frame absolute left-1/2 top-[24rem] z-20 h-[27rem] w-[54rem] origin-top -translate-x-1/2 transform-gpu sm:top-[23rem] md:top-[20.35rem] md:w-[min(54rem,97vw)]"
    >
      <motion.div
        data-dashboard-float-shell
        className="h-full w-full transform-gpu"
        animate={enableDesktopFloat ? { y: [-8, 8, -8] } : { y: 0 }}
        transition={
          enableDesktopFloat
            ? {
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
              }
            : { duration: 0.24, ease: "easeInOut" }
        }
        style={{ willChange: enableDesktopFloat ? "transform" : "auto" }}
      >
        <div className="home-dashboard-mobile-scale h-full w-full">
          <motion.div
            ref={bootRef}
            data-mobile-dashboard-boot
            key={shouldAnimateMobileDashboard ? "mobile-dashboard-boot" : "dashboard-static"}
            className="h-full w-full transform-gpu"
            initial={shouldAnimateMobileDashboard ? { opacity: 0, scale: 0.92 } : false}
            animate={
              shouldAnimateMobileDashboard
                ? mobileDashboardVisible
                  ? { opacity: 1, scale: 1 }
                  : { opacity: 0, scale: 0.92 }
                : undefined
            }
            transition={{ duration: 0.6, ease: mobileDashboardEase }}
            onAnimationComplete={() => {
              if (shouldAnimateMobileDashboard && mobileDashboardVisible) {
                debugMobileDashboard("Animation Completed");
              }
            }}
            style={{ willChange: shouldAnimateMobileDashboard ? "transform, opacity" : "auto" }}
          >
            <motion.div
              data-mobile-dashboard-idle
              className="h-full w-full transform-gpu"
              animate={shouldAnimateMobileDashboard && mobileDashboardVisible ? { y: [0, -4, 0] } : { y: 0 }}
              transition={
                shouldAnimateMobileDashboard && mobileDashboardVisible
                  ? {
                      delay: mobileIdleStartDelay,
                      duration: 5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }
                  : { duration: 0.2, ease: "easeOut" }
              }
              style={{ willChange: shouldAnimateMobileDashboard ? "transform" : "auto" }}
            >
              <div className="home-dashboard-scaler h-full w-full">
                <div className="home-dashboard-surface relative h-full w-full overflow-hidden rounded-lg border border-[#ECECEC] bg-[#FFFFFF] shadow-[0_30px_80px_rgba(0,0,0,0.08)]">
                  <motion.div
                    data-mobile-dashboard-reflection
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-y-0 left-[-38%] z-20 block w-[34%] -skew-x-12 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.55),rgba(198,164,91,0.16),transparent)] md:hidden"
                    initial={shouldAnimateMobileDashboard ? { opacity: 0, x: "-80%" } : false}
                    animate={
                      shouldAnimateMobileDashboard && mobileDashboardVisible
                        ? { opacity: [0, 0.18, 0], x: "520%" }
                        : undefined
                    }
                    transition={{ delay: 0.95, duration: 1.65, ease: mobileDashboardEase }}
                  />
                  <div className="grid h-full grid-cols-[3.45rem_1fr]">
                    <aside className="flex flex-col items-center gap-5 border-r border-[#efeee9] bg-[#fbfbf8] py-6">
                      <motion.div
                        data-mobile-dashboard-sidebar-icon
                        className="relative h-6 w-6"
                        initial={shouldAnimateMobileDashboard ? { opacity: 0, x: -10 } : false}
                        animate={
                          shouldAnimateMobileDashboard
                            ? mobileDashboardVisible
                              ? { opacity: 1, x: 0 }
                              : { opacity: 0, x: -10 }
                            : undefined
                        }
                        transition={{ delay: mobileIconStartDelay - 0.08, duration: 0.32, ease: mobileDashboardEase }}
                      >
                        <span className="absolute left-0 top-0 h-4 w-4 rounded-[0.22rem] bg-[#C6A45B]" />
                        <span className="absolute bottom-0 right-0 h-4 w-4 rounded-[0.22rem] bg-[#17243a] shadow-[0_8px_16px_rgba(23,36,58,0.16)]" />
                      </motion.div>
                      {sidebarIcons.map((Icon, index) => (
                        <motion.div
                          data-mobile-dashboard-sidebar-icon
                          key={index}
                          className="relative flex h-5 w-5 items-center justify-center text-[#9a9894]"
                          initial={shouldAnimateMobileDashboard ? { opacity: 0, x: -10 } : false}
                          animate={
                            shouldAnimateMobileDashboard
                              ? mobileDashboardVisible
                                ? { opacity: 1, x: 0 }
                                : { opacity: 0, x: -10 }
                              : undefined
                          }
                          transition={{
                            delay: mobileIconStartDelay + index * 0.08,
                            duration: 0.32,
                            ease: mobileDashboardEase
                          }}
                        >
                          {index === 1 ? <span className="absolute -left-[1.1rem] h-[3.95rem] w-[2px] rounded-full bg-[#303030]" /> : null}
                          <Icon className={cn("h-5 w-5", index === 1 && "text-[#303030]")} strokeWidth={1.75} />
                        </motion.div>
                      ))}
                    </aside>

                    <div className="relative overflow-hidden px-8 py-6">
                      <div className="mb-5">
                        <h2 className="font-display text-[1.2rem] font-semibold leading-none tracking-normal text-[#303030]">Dashboard</h2>
                        <p className="mt-2 text-[0.72rem] leading-none text-[#54524e]">Five-pillar enterprise operations in one place</p>
                      </div>
                      <div className="mb-5 flex flex-wrap gap-2.5 overflow-visible pb-0 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                        <button data-dashboard-filter className="flex h-8 w-[11.6rem] shrink-0 items-center gap-1.5 whitespace-nowrap rounded-md border border-[#ebe8e2] bg-white/90 px-2.5 text-[0.78rem] font-medium leading-[1.4] tracking-[0.04em] text-[rgba(32,20,15,0.58)] shadow-[0_6px_18px_rgba(48,48,48,0.014)] md:w-[12.4rem]">
                          <SquareAsterisk className="h-3.5 w-3.5 text-[rgba(32,20,15,0.46)]" strokeWidth={1.75} />
                          Entity: All companies
                          <ChevronDown className="ml-auto h-3 w-3 text-[rgba(32,20,15,0.42)]" />
                        </button>
                        <button data-dashboard-filter className="flex h-8 w-[13.9rem] shrink-0 items-center gap-1.5 whitespace-nowrap rounded-md border border-[#ebe8e2] bg-white/90 px-2.5 text-[0.78rem] font-medium leading-[1.4] tracking-[0.04em] text-[rgba(32,20,15,0.58)] shadow-[0_6px_18px_rgba(48,48,48,0.014)] md:w-[15.1rem]">
                          <ArrowDownUp className="h-3.5 w-3.5 text-[rgba(32,20,15,0.46)]" strokeWidth={1.75} />
                          Sort by: Executive priority
                          <ChevronDown className="ml-auto h-3 w-3 text-[rgba(32,20,15,0.42)]" />
                        </button>
                      </div>

                      <div className="grid grid-flow-row grid-cols-3 grid-rows-none gap-5 overflow-visible pb-0 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                        {miniCards.map((card, index) => (
                          <div key={card.title} className="relative min-h-[15.45rem]">
                            <div data-dashboard-placeholder className="absolute inset-0 rounded-md border border-[#e8e6e3] bg-white/38 shadow-[0_14px_40px_rgba(48,48,48,0.018)]" />
                            <div data-dashboard-slot-card className="absolute inset-0 md:opacity-0">
                              <motion.div
                                data-mobile-dashboard-card
                                className="h-full w-full transform-gpu"
                                initial={shouldAnimateMobileDashboard ? { opacity: 0, y: 20, scale: 0.96 } : false}
                                animate={
                                  shouldAnimateMobileDashboard
                                    ? mobileDashboardVisible
                                      ? { opacity: 1, y: 0, scale: 1 }
                                      : { opacity: 0, y: 20, scale: 0.96 }
                                    : undefined
                                }
                                transition={{
                                  delay: mobileCardStartDelay + index * 0.12,
                                  duration: 0.6,
                                  ease: mobileDashboardEase
                                }}
                                style={{ willChange: shouldAnimateMobileDashboard ? "transform, opacity" : "auto" }}
                              >
                                <DashboardCard
                                  {...card}
                                  index={index}
                                  compact
                                  showcase
                                  statusMotionState={shouldAnimateMobileDashboard ? (mobileDashboardVisible ? "visible" : "hidden") : undefined}
                                  statusMotionDelay={mobileCardStartDelay + index * 0.12 + 0.4}
                                />
                              </motion.div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white via-white/72 to-transparent" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
