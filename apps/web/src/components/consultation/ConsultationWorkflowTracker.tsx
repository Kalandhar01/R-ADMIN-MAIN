"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  FileText,
  ListChecks,
  LockKeyhole,
  MessagesSquare,
  Radio,
  Rocket,
  SearchCheck,
  ShieldCheck
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ApiRequestError, getConsultationWorkflow } from "@/lib/api";
import type { ConsultationRequest, ConsultationWorkflowStage, WorkflowStageKey } from "@/lib/types";
import { cn, formatDate } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

type TrackerReference = {
  id: string;
  trackingToken: string;
  version?: number;
  createdAt?: string;
};

type PresentationStageState = "completed" | "active" | "future";

const TRACKER_STORAGE_KEY = "ractysh-consultation-tracker";
const TRACKER_STORAGE_VERSION = 2;

const previewDescriptions = [
  "The client brief enters the secure demo desk with source details, scope signals and preferred timing.",
  "The operations team reviews business context, service lane, supporting files and readiness indicators.",
  "Identity, requirement files and internal acceptance checks move through a controlled verification layer.",
  "A strategic discussion aligns budget, delivery logic, risk boundaries and commercial next actions.",
  "Execution planning converts the approved brief into scope, owners, timelines and operating checkpoints.",
  "The project opens with coordinated teams, documented responsibilities and an enterprise delivery rhythm."
];

const stageSignals: Record<WorkflowStageKey, string[]> = {
  consultation_submitted: ["Brief encrypted", "Documents received", "Desk intake opened"],
  internal_review: ["Scope classified", "Service lane mapped", "Operational desk synced"],
  approval_verification: ["Documents verified", "KYC secured", "Approval layer active"],
  strategy_discussion: ["Decision makers aligned", "Risk notes prepared", "Call window confirmed"],
  execution_planning: ["Milestones drafted", "Resource model synced", "Delivery controls staged"],
  project_kickoff: ["Teams assigned", "Kickoff ledger opened", "Execution rhythm live"]
};

const stageMetrics: Record<WorkflowStageKey, string[]> = {
  consultation_submitted: ["T+0", "Secure", "Intake"],
  internal_review: ["Ops", "Review", "Desk"],
  approval_verification: ["KYC", "Files", "Clear"],
  strategy_discussion: ["Strategy", "Scope", "Ready"],
  execution_planning: ["Plan", "Owners", "SLA"],
  project_kickoff: ["Launch", "Teams", "Live"]
};

const previewStages: ConsultationWorkflowStage[] = [
  "Demo Submitted",
  "Internal Review",
  "Approval & Verification",
  "Strategy Discussion",
  "Execution Planning",
  "Project Kickoff"
].map((title, index) => ({
  id: title,
  key: [
    "consultation_submitted",
    "internal_review",
    "approval_verification",
    "strategy_discussion",
    "execution_planning",
    "project_kickoff"
  ][index] as WorkflowStageKey,
  title,
  description: previewDescriptions[index],
  position: index + 1,
  status: index === 0 ? "active" : "locked",
  stateLabel: index === 0 ? "Awaiting Submission" : "Locked",
  updatedAt: new Date().toISOString(),
  responseDocuments: []
}));

const stageIcons: Record<WorkflowStageKey, typeof ClipboardCheck> = {
  consultation_submitted: ClipboardCheck,
  internal_review: SearchCheck,
  approval_verification: ShieldCheck,
  strategy_discussion: MessagesSquare,
  execution_planning: ListChecks,
  project_kickoff: Rocket
};

const presentationMeta: Record<
  PresentationStageState,
  {
    cardClassName: string;
    badgeClassName: string;
    label: string;
    icon: typeof CheckCircle2;
    dot: string;
    opacity: number;
    scale: number;
  }
> = {
  completed: {
    cardClassName: "border-[#34d37c]/24",
    badgeClassName: "border-[#34d37c]/40 bg-[#34d37c]/18 text-white",
    label: "Completed",
    icon: CheckCircle2,
    dot: "bg-[#34d37c]",
    opacity: 0.9,
    scale: 0.96
  },
  active: {
    cardClassName: "border-[#f1c94a]/42",
    badgeClassName: "border-[#f1c94a]/90 bg-[#f1c94a] text-[#111111]",
    label: "Active",
    icon: Clock3,
    dot: "bg-[#111b2c]",
    opacity: 1,
    scale: 1
  },
  future: {
    cardClassName: "pointer-events-none border-white/10",
    badgeClassName: "border-white/10 bg-white/10 text-white",
    label: "Queued",
    icon: LockKeyhole,
    dot: "bg-white/70",
    opacity: 0.84,
    scale: 0.92
  }
};

function removeStoredTracker() {
  try {
    window.localStorage.removeItem(TRACKER_STORAGE_KEY);
  } catch {
    // Ignore private browsing and storage policy failures.
  }
}

function parseStoredTracker(): TrackerReference | null {
  try {
    const raw = window.localStorage.getItem(TRACKER_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<TrackerReference>;

    if (parsed.version !== TRACKER_STORAGE_VERSION || !parsed.id || !parsed.trackingToken) {
      removeStoredTracker();
      return null;
    }

    return {
      id: parsed.id,
      trackingToken: parsed.trackingToken,
      version: TRACKER_STORAGE_VERSION,
      createdAt: parsed.createdAt
    };
  } catch {
    removeStoredTracker();
    return null;
  }
}

function isInvalidTrackerError(error: unknown): boolean {
  return error instanceof ApiRequestError && [400, 401, 403, 404].includes(error.status);
}

function isServiceUnavailableError(error: unknown): boolean {
  return error instanceof ApiRequestError && error.status >= 500;
}

function visualStateForStage(index: number, activeIndex: number, isComplete: boolean): PresentationStageState {
  if (isComplete || index < activeIndex) return "completed";
  return index === activeIndex ? "active" : "future";
}

function transformForVisualState(visualState: PresentationStageState): string {
  if (visualState === "active") return "translate3d(0, 0, 0) scale(1)";
  if (visualState === "completed") return "translate3d(0, 10px, 0) scale(0.985)";
  return "translate3d(0, 32px, 0) scale(0.97)";
}

function opacityForVisualState(visualState: PresentationStageState): number {
  if (visualState === "active") return 1;
  if (visualState === "completed") return 0.94;
  return 0.84;
}

function lineScaleForVisualState(visualState: PresentationStageState): number {
  if (visualState === "completed") return 1;
  if (visualState === "active") return 0.72;
  return 0.22;
}

export function ConsultationWorkflowTracker() {
  const sectionRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const cinematicShellRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const stageFieldRef = useRef<HTMLDivElement>(null);
  const presentationStateRef = useRef({ complete: false, index: 0 });
  const [tracker, setTracker] = useState<TrackerReference | null>(null);
  const [workflow, setWorkflow] = useState<ConsultationRequest | null>(null);
  const [syncState, setSyncState] = useState("Awaiting secure submission");
  const [presentationIndex, setPresentationIndex] = useState(0);
  const [presentationComplete, setPresentationComplete] = useState(false);
  const hasWorkflow = Boolean(workflow);

  const stages = workflow?.workflowStages?.length ? workflow.workflowStages : previewStages;
  const safeStageCount = Math.max(stages.length, 1);
  const activePresentationIndex = Math.min(presentationIndex, safeStageCount - 1);
  const activeStage = presentationComplete ? stages[stages.length - 1] : stages[activePresentationIndex];
  const completedCount = presentationComplete ? stages.length : activePresentationIndex;
  const workflowScrollMinHeight = `${Math.max(320, safeStageCount * 64 + 116)}svh`;

  const refreshWorkflow = useCallback(async (nextTracker: TrackerReference) => {
    const nextWorkflow = await getConsultationWorkflow(nextTracker.id, nextTracker.trackingToken);
    setWorkflow(nextWorkflow);
    setSyncState("Live workflow synced");
  }, []);

  const handleWorkflowSyncError = useCallback((error: unknown, fallbackMessage: string) => {
    if (isInvalidTrackerError(error)) {
      removeStoredTracker();
      setTracker(null);
      setWorkflow(null);
      setSyncState("Workflow tracker expired");
      return;
    }

    if (isServiceUnavailableError(error)) {
      setTracker(null);
      setSyncState("Workflow sync paused");
      return;
    }

    setSyncState(fallbackMessage);
  }, []);

  useEffect(() => {
    const stored = parseStoredTracker();
    if (!stored) return;

    setSyncState("Restoring workflow sync");
    refreshWorkflow(stored)
      .then(() => setTracker(stored))
      .catch((error) => handleWorkflowSyncError(error, "Workflow sync paused"));
  }, [handleWorkflowSyncError, refreshWorkflow]);

  useEffect(() => {
    const section = sectionRef.current;
    const sticky = stickyRef.current;
    const shell = cinematicShellRef.current;
    const progress = progressRef.current;
    const stageField = stageFieldRef.current;

    if (!section || !sticky || !shell || !progress || !stageField || !stages.length) return;

    const context = gsap.context(() => {
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const cards = gsap.utils.toArray<HTMLElement>("[data-workflow-stage-card]");
      const ambient = section.querySelector<HTMLElement>("[data-workflow-ambient]");
      const indicators = gsap.utils.toArray<HTMLElement>("[data-workflow-indicator]");

      gsap.ticker.lagSmoothing(0);
      gsap.set([sticky, shell, stageField, progress, ambient, ...cards, ...indicators], {
        backfaceVisibility: "hidden",
        force3D: true
      });
      gsap.set([sticky, shell, stageField, progress, ambient], { willChange: "transform" });
      gsap.set(cards, { willChange: "transform, opacity" });
      gsap.set(indicators, { willChange: "transform, opacity" });
      gsap.set(ambient, { scale: 1.24, transformOrigin: "50% 50%" });
      gsap.set(progress, { scaleX: 0, transformOrigin: "0% 50%" });

      if (reduceMotion) {
        setPresentationIndex(0);
        setPresentationComplete(false);
        gsap.set(progress, { scaleX: 1 });
        return undefined;
      }

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: 1.2,
          anticipatePin: 1,
          invalidateOnRefresh: false,
          onUpdate: (self) => {
            const nextIndex = Math.min(stages.length - 1, Math.max(0, Math.floor(self.progress * stages.length)));
            const isComplete = self.progress >= 0.985;

            if (presentationStateRef.current.index !== nextIndex) {
              presentationStateRef.current.index = nextIndex;
              setPresentationIndex(nextIndex);
            }

            if (presentationStateRef.current.complete !== isComplete) {
              presentationStateRef.current.complete = isComplete;
              setPresentationComplete(isComplete);
            }
          }
        }
      });

      timeline
        .fromTo(shell, { scale: 0.985, y: 20 }, { scale: 1, y: 0, duration: 0.8, ease: "power3.out" }, 0)
        .to(progress, { scaleX: 1, duration: stages.length, ease: "none" }, 0)
        .to(stageField, { yPercent: -4, duration: stages.length, ease: "none" }, 0)
        .to(ambient, { yPercent: 8, duration: stages.length, ease: "none" }, 0);

      requestAnimationFrame(() => ScrollTrigger.refresh());
      return () => timeline.kill();
    }, section);

    return () => context.revert();
  }, [stages.length]);

  useEffect(() => {
    const handleSubmitted = (event: Event) => {
      const detail = (event as CustomEvent<ConsultationRequest>).detail;
      if (!detail?._id || !detail.trackingToken) return;

      const nextTracker = {
        id: detail._id,
        trackingToken: detail.trackingToken,
        version: TRACKER_STORAGE_VERSION,
        createdAt: new Date().toISOString()
      };
      setTracker(nextTracker);
      setWorkflow(detail);
      setSyncState("Live workflow synced");
    };

    window.addEventListener("ractysh-consultation-submitted", handleSubmitted);
    return () => window.removeEventListener("ractysh-consultation-submitted", handleSubmitted);
  }, []);

  useEffect(() => {
    if (!tracker || !hasWorkflow) return;

    const source = new EventSource(
      `/api/consultations/${tracker.id}/events?trackingToken=${encodeURIComponent(tracker.trackingToken)}`
    );
    const handleWorkflow = (event: MessageEvent<string>) => {
      try {
        setWorkflow(JSON.parse(event.data) as ConsultationRequest);
        setSyncState("Live workflow synced");
      } catch {
        setSyncState("Workflow stream paused");
      }
    };

    source.addEventListener("workflow", handleWorkflow as EventListener);
    source.onerror = () => {
      source.close();
      setSyncState("Polling workflow updates");
    };

    const poller = window.setInterval(() => {
      refreshWorkflow(tracker).catch((error) => handleWorkflowSyncError(error, "Workflow sync paused"));
    }, 8000);

    return () => {
      source.removeEventListener("workflow", handleWorkflow as EventListener);
      source.close();
      window.clearInterval(poller);
    };
  }, [handleWorkflowSyncError, hasWorkflow, refreshWorkflow, tracker]);

  const latestActivity = useMemo(() => {
    if (!workflow?.statusHistory?.length) return null;
    return workflow.statusHistory[0];
  }, [workflow?.statusHistory]);

  return (
    <section
      ref={sectionRef}
      className="workflow-wrapper relative isolate bg-[#16110d] pb-16 text-white md:pb-20 lg:pb-24"
      style={{ minHeight: workflowScrollMinHeight }}
    >
      <div
        ref={stickyRef}
        className="workflow-sticky workflow-gpu sticky top-0 flex min-h-[100svh] items-center overflow-hidden px-5 py-5 md:px-8 md:py-7"
      >
        <div
          data-workflow-ambient
          className="workflow-gpu pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_18%,rgba(212,175,55,0.28),transparent_28%),radial-gradient(circle_at_82%_16%,rgba(58,126,95,0.18),transparent_30%),linear-gradient(135deg,#211814_0%,#120d0b_56%,#221b15_100%)]"
        />
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(rgba(255,248,232,0.055)_1px,transparent_1px),linear-gradient(90deg,rgba(255,248,232,0.04)_1px,transparent_1px)] [background-size:54px_54px]" />
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(22,17,13,0.12),rgba(22,17,13,0.78))]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#d4af37]/62 to-transparent" />

        <div
          ref={cinematicShellRef}
          className="workflow-gpu mx-auto flex h-full w-full max-w-[88rem] flex-col justify-center"
        >
          <div className="grid gap-5 xl:grid-cols-[0.72fr_1fr] xl:items-end">
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#d4af37]">
                Demo Workflow
              </p>
              <h2 className="mt-3 max-w-[32rem] font-display text-[28px] font-semibold leading-[1.02] tracking-[0] text-white drop-shadow-[0_14px_34px_rgba(0,0,0,0.58)] md:max-w-[34rem] md:text-[30px] md:leading-[1.04] lg:text-[36px]">
                A private path from first brief to execution confidence.
              </h2>
              <p className="mt-4 max-w-2xl text-[14px] leading-[1.75] text-white/80 md:text-[16px]">
                Every submitted brief creates a live workflow record, stage history and response documents from
                the operational desk.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { label: "Current Stage", value: activeStage?.title || "Not started" },
                { label: "Completed", value: `${completedCount}/${stages.length}` },
                { label: "Sync", value: syncState }
              ].map((item) => (
                <div
                  key={item.label}
                  data-workflow-indicator
                  className={cn(
                    "workflow-indicator-gpu rounded-lg border border-white/10 bg-white/[0.04] p-4 backdrop-blur-xl transition-opacity duration-[800ms] ease-[cubic-bezier(0.215,0.61,0.355,1)]",
                    item.label === "Current Stage"
                      ? "shadow-[0_18px_54px_rgba(212,175,55,0.12),inset_0_1px_0_rgba(255,255,255,0.08)]"
                      : "shadow-[0_14px_42px_rgba(0,0,0,0.16)]"
                  )}
                >
                  <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-white/70">{item.label}</p>
                  <p className="mt-2 min-h-10 text-[14px] font-semibold leading-[1.45] text-white/95">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-7 overflow-hidden rounded-xl border border-white/10 bg-white/[0.04] shadow-[0_34px_110px_rgba(0,0,0,0.32),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl">
            <div className="flex flex-col gap-4 border-b border-white/10 px-5 py-4 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.1em] text-[#d4af37]">
                  <Radio className="h-4 w-4" />
                  Operational tracker
                </div>
                <p className="mt-2 text-[14px] leading-[1.7] text-white/75">
                  {workflow
                    ? `${workflow.companyName} · submitted ${formatDate(workflow.createdAt)}`
                    : "Secure workflow instance activates after demo documents are submitted."}
                </p>
              </div>
              {latestActivity ? (
                <span className="rounded-md border border-white/10 bg-white/[0.04] px-3 py-2 text-[12px] text-white/75 backdrop-blur-xl">
                  {latestActivity.label || latestActivity.toStatus}
                </span>
              ) : null}
            </div>

            <div className="relative px-5 py-6">
              <div className="absolute left-8 right-8 top-[2.6rem] h-px bg-white/10" />
              <div
                ref={progressRef}
                className="workflow-gpu absolute left-8 right-8 top-[2.55rem] h-[2px] origin-left overflow-hidden bg-gradient-to-r from-[#34d37c] via-[#d4af37] to-[#f1c94a] shadow-[0_0_28px_rgba(212,175,55,0.4)]"
              >
                <span className="workflow-progress-shine absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-transparent via-white/82 to-transparent" />
              </div>

              <>
                <div className="overflow-x-auto pb-2 pt-4 lg:overflow-visible" data-lenis-prevent>
                  <div
                    ref={stageFieldRef}
                    className="workflow-gpu grid min-w-[92rem] grid-cols-6 gap-4 lg:min-w-0"
                  >
                    {stages.map((stage, index) => {
                      const StageIcon = stageIcons[stage.key];
                      const visualState = visualStateForStage(index, activePresentationIndex, presentationComplete);
                      const meta = presentationMeta[visualState];
                      const StateIcon = meta.icon;
                      const signals = stageSignals[stage.key];
                      const metrics = stageMetrics[stage.key];

                      return (
                        <article
                          key={stage.key}
                          data-workflow-stage-card
                          className="workflow-card-gpu relative"
                        >
                          <div
                            style={{
                              opacity: opacityForVisualState(visualState),
                              transform: transformForVisualState(visualState),
                              borderColor: "rgba(255,255,255,0.1)"
                            }}
                            className={cn(
                              "workflow-card-gpu relative flex min-h-[23rem] flex-col overflow-hidden rounded-lg border border-white/10 bg-white/[0.04] p-4 text-white shadow-[0_18px_58px_rgba(0,0,0,0.18),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl transition-[transform,opacity] duration-[800ms] ease-[cubic-bezier(0.215,0.61,0.355,1)]",
                              meta.cardClassName
                            )}
                          >
                            <div className="pointer-events-none absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-white/32 to-transparent" />
                            <span
                              className={cn(
                                "pointer-events-none absolute inset-0 rounded-lg border border-[#d4af37]/44 opacity-0 shadow-[inset_0_0_0_1px_rgba(212,175,55,0.22),0_0_54px_rgba(212,175,55,0.24)] transition-opacity duration-[800ms] ease-[cubic-bezier(0.215,0.61,0.355,1)] workflow-indicator-gpu",
                                visualState === "active" && "opacity-100"
                              )}
                            />

                            <div className="relative flex items-start justify-between gap-3">
                              <span
                                data-workflow-indicator
                                className={cn(
                                  "workflow-indicator-gpu flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-white backdrop-blur-xl",
                                  visualState === "active"
                                    ? "shadow-[0_16px_38px_rgba(212,175,55,0.24)]"
                                    : visualState === "completed"
                                      ? "shadow-[0_12px_30px_rgba(52,211,124,0.14)]"
                                      : ""
                                )}
                              >
                                <StageIcon className="h-5 w-5" strokeWidth={1.8} />
                              </span>
                              <span
                                data-workflow-indicator
                                style={{
                                  opacity: 1,
                                  transform: visualState === "active" ? "translate3d(0,0,0) scale(1)" : "translate3d(0,0,0) scale(0.98)"
                                }}
                                className={cn(
                                  "workflow-card-gpu flex items-center gap-1.5 rounded-md border px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.06em] transition-[transform,opacity] duration-[800ms] ease-[cubic-bezier(0.215,0.61,0.355,1)]",
                                  meta.badgeClassName
                                )}
                              >
                                <span
                                  className={cn(
                                    "workflow-indicator-gpu h-1.5 w-1.5 rounded-full",
                                    visualState === "active" && "animate-pulse",
                                    meta.dot
                                  )}
                                />
                                {meta.label}
                              </span>
                            </div>

                            <div className="relative mt-5 flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.06em] text-white/70">
                              <span
                                data-workflow-indicator
                                className={cn(
                                  "workflow-indicator-gpu flex h-4 w-4 items-center justify-center transition-[transform,opacity] duration-[800ms] ease-[cubic-bezier(0.215,0.61,0.355,1)]",
                                  visualState === "future" ? "opacity-80" : "opacity-100"
                                )}
                              >
                                <StateIcon className="h-4 w-4" />
                              </span>
                              Stage {stage.position}
                            </div>
                            <h3 className="relative mt-3 min-h-12 font-display text-[16px] font-medium leading-snug tracking-tight text-white md:text-[18px]">
                              {stage.title}
                            </h3>
                            <p className="relative mt-3 text-[13px] leading-relaxed text-white/65">{stage.description}</p>

                            <div className="relative mt-4 space-y-2">
                              {signals.map((signal) => (
                                <div
                                  key={signal}
                                  data-workflow-indicator
                                  className={cn(
                                    "workflow-card-gpu relative overflow-hidden rounded-md border border-white/10 bg-white/[0.04] px-3 py-2 backdrop-blur-xl transition-opacity duration-[800ms] ease-[cubic-bezier(0.215,0.61,0.355,1)]",
                                    visualState === "future" ? "opacity-90" : "opacity-100"
                                  )}
                                >
                                  <div className="flex items-center gap-2">
                                    <span
                                      className={cn(
                                        "h-1.5 w-1.5 shrink-0 rounded-full",
                                        visualState === "completed"
                                          ? "bg-[#34d37c]"
                                          : visualState === "active"
                                            ? "bg-[#f1c94a]"
                                            : "bg-white/28"
                                      )}
                                    />
                                    <span className="min-w-0 flex-1 truncate text-[11px] font-medium text-white/85">
                                      {signal}
                                    </span>
                                    <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-white/70">
                                      {visualState === "completed" ? "verified" : visualState === "active" ? "live" : "queued"}
                                    </span>
                                  </div>
                                  <span className="absolute inset-x-3 bottom-1 h-px origin-left overflow-hidden bg-white/10">
                                    <span
                                      className={cn(
                                        "workflow-indicator-gpu block h-full origin-left transition-[transform,opacity] duration-[800ms] ease-[cubic-bezier(0.215,0.61,0.355,1)]",
                                        visualState === "completed" ? "bg-[#34d37c]" : "bg-[#f1c94a]"
                                      )}
                                      style={{
                                        opacity: visualState === "future" ? 0.22 : 0.86,
                                        transform: `translateZ(0) scaleX(${lineScaleForVisualState(visualState)})`
                                      }}
                                    />
                                  </span>
                                </div>
                              ))}
                            </div>

                            <div className="relative mt-4 grid grid-cols-3 gap-2">
                              {metrics.map((metric) => (
                                <span
                                  key={metric}
                                  data-workflow-indicator
                                  className={cn(
                                    "workflow-indicator-gpu rounded-md border border-white/10 bg-white/[0.04] px-2 py-2 text-center text-[10px] font-semibold uppercase tracking-[0.08em] text-white/75 backdrop-blur-xl transition-opacity duration-[800ms] ease-[cubic-bezier(0.215,0.61,0.355,1)]",
                                    visualState === "future" ? "opacity-90" : "opacity-100"
                                  )}
                                >
                                  {metric}
                                </span>
                              ))}
                            </div>

                            {stage.responseDocuments.length ? (
                              <div className="relative mt-4 space-y-2">
                                {stage.responseDocuments.slice(0, 2).map((document) =>
                                  document.url ? (
                                    <a
                                      key={document.id || document.filename}
                                      href={document.url}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="flex items-center gap-2 rounded-md border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white/80 backdrop-blur-xl transition hover:text-white"
                                    >
                                      <FileText className="h-3.5 w-3.5" />
                                      <span className="min-w-0 truncate">{document.filename}</span>
                                    </a>
                                  ) : (
                                    <span
                                      key={document.id || document.filename}
                                      className="flex items-center gap-2 rounded-md border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white/70 backdrop-blur-xl"
                                    >
                                      <FileText className="h-3.5 w-3.5" />
                                      <span className="min-w-0 truncate">{document.filename}</span>
                                    </span>
                                  )
                                )}
                              </div>
                            ) : null}
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </div>
              </>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
