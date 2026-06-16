"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { ArrowUpRight, Building2, CheckCircle2, DraftingCompass, Layers3, Network, PanelTop, Sparkles, UsersRound } from "lucide-react";
import { CareerApplicationModal } from "@/components/CareerApplicationModal";
import { useLenis } from "@/components/providers/SmoothScrollProvider";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

const ease = [0.22, 1, 0.36, 1] as const;

const whyCards = [
  {
    title: "Enterprise Innovation",
    text: "Work on premium operational systems and modern enterprise experiences.",
    Icon: Sparkles
  },
  {
    title: "Growth & Learning",
    text: "Collaborate with Architecture, Construction, Real Estate, Trade and OTC operation teams.",
    Icon: Layers3
  },
  {
    title: "Premium Work Culture",
    text: "Designed for focus, creativity and long-term professional growth.",
    Icon: Building2
  }
];

const heroMetrics = [
  { value: 50, suffix: "+", label: "Projects Delivered" },
  { value: 5, suffix: "", label: "Enterprise Divisions" },
  { value: 100, suffix: "%", label: "Execution Focused" }
];

type HeroMetric = (typeof heroMetrics)[number];

const heroDisciplines = ["Architecture.", "Construction.", "Real Estate.", "Import & Export.", "OTC Exchange."];

const heroTeamSignals = ["Design", "Build", "Trade", "Exchange"];

const heroActivityCards = [
  {
    title: "Design review",
    detail: "Architecture studio",
    status: "Live",
    Icon: DraftingCompass
  },
  {
    title: "Project control",
    detail: "Construction + Real Estate",
    status: "Active",
    Icon: Building2
  },
  {
    title: "Private desk",
    detail: "Trade + OTC Exchange",
    status: "Secure",
    Icon: Network
  }
];

const heroDashboardRows = [
  { label: "Execution", value: "100%", width: "100%" },
  { label: "Division sync", value: "5/5", width: "82%" },
  { label: "Reviews", value: "12", width: "68%" }
];

const openRoles = [
  { title: "Frontend Developer", meta: "Full Time — Coimbatore • Palani • Dindigul" },
  { title: "UI/UX Designer", meta: "Full Time — Hybrid" },
  { title: "Enterprise Operations Associate", meta: "Full Time — Coimbatore • Palani • Dindigul" },
  { title: "Architecture Visualization Designer", meta: "Full Time — Remote" }
];

const lifeExperiences = [
  {
    title: "Operational Precision",
    eyebrow: "01 / Operating Culture",
    body:
      "Every team works inside clear ownership, documented cadence and calm execution loops so ambitious enterprise work stays controlled from idea to delivery.",
    image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1500&q=86",
    alt: "Premium enterprise office with warm architectural lighting",
    signal: "Execution Control",
    metric: "Daily",
    metricLabel: "review cadence",
    modules: ["Ownership maps", "Quality checkpoints", "Client-ready reporting"],
    Icon: DraftingCompass
  },
  {
    title: "Creative Intelligence",
    eyebrow: "02 / Design Systems",
    body:
      "Creative decisions are shaped through research, visual discipline and operational context, giving every interface, space and presentation a sharper business purpose.",
    image: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1500&q=86",
    alt: "Bright premium creative studio workspace with modern desks",
    signal: "Concept Studio",
    metric: "4D",
    metricLabel: "creative review",
    modules: ["Spatial systems", "Interface craft", "Presentation intelligence"],
    Icon: Sparkles
  },
  {
    title: "Enterprise Collaboration",
    eyebrow: "03 / Connected Teams",
    body:
      "Architecture, Construction, Real Estate, Export-Import, OTC Exchange and client teams move as one connected ecosystem, reducing handoffs and keeping decisions aligned.",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1500&q=86",
    alt: "Enterprise team collaborating in a modern meeting space",
    signal: "Team Network",
    metric: "One",
    metricLabel: "connected system",
    modules: ["Division sync", "Shared context", "Leadership visibility"],
    Icon: UsersRound
  },
  {
    title: "Calm Execution Standards",
    eyebrow: "04 / Delivery Philosophy",
    body:
      "High standards do not require noise. Ractysh teams prioritize measured communication, strong documentation and focused delivery windows.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1500&q=86",
    alt: "Operational dashboards and enterprise analytics on screens",
    signal: "Standards Room",
    metric: "Zero",
    metricLabel: "noise execution",
    modules: ["Risk clarity", "Documentation depth", "Decision discipline"],
    Icon: Layers3
  },
  {
    title: "Modern Workplace Culture",
    eyebrow: "05 / Professional Growth",
    body:
      "The workplace is designed for long-term craft, thoughtful autonomy and premium presentation standards across the full Ractysh ecosystem.",
    image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1500&q=86",
    alt: "Modern warm workplace lounge with premium interiors",
    signal: "Culture System",
    metric: "360",
    metricLabel: "growth exposure",
    modules: ["Mentorship", "Focused autonomy", "Cross-domain learning"],
    Icon: Building2
  }
];

const connectedLifeIndex = lifeExperiences.findIndex(({ title }) => title === "Enterprise Collaboration");

const processSteps = [
  {
    title: "Apply",
    description: "Submit your professional profile."
  },
  {
    title: "Review",
    description: "Operational and creative evaluation."
  },
  {
    title: "Interview",
    description: "Executive and technical discussion."
  },
  {
    title: "Selection",
    description: "Final leadership approval."
  },
  {
    title: "Welcome to Ractysh",
    description: "Enter the premium ecosystem."
  }
];

function ApplyLink({
  children,
  className,
  onClick
}: {
  children: React.ReactNode;
  className?: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "premium-cta group",
        className
      )}
    >
      {children}
      <ArrowUpRight className="h-4 w-4 transition duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </button>
  );
}

function easeOutQuart(progress: number): number {
  return 1 - Math.pow(1 - progress, 4);
}

function AnimatedHeroMetricCard({
  metric,
  isActive,
  className,
  valueClassName,
  labelClassName,
  dark = false,
  showTopAccent = false
}: {
  metric: HeroMetric;
  isActive: boolean;
  className?: string;
  valueClassName?: string;
  labelClassName?: string;
  dark?: boolean;
  showTopAccent?: boolean;
}) {
  const valueRef = useRef<HTMLSpanElement>(null);
  const frameRef = useRef<number | null>(null);
  const hasStartedRef = useRef(false);
  const counterValue = useMotionValue(0);
  const shouldReduceMotion = useReducedMotion();
  const [hasEntered, setHasEntered] = useState(false);
  const [isCounting, setIsCounting] = useState(false);

  const setCounterText = useCallback(
    (value: number, isComplete: boolean) => {
      if (!valueRef.current) return;
      valueRef.current.textContent = `${value}${isComplete ? metric.suffix : ""}`;
    },
    [metric.suffix]
  );

  useEffect(() => {
    setCounterText(0, false);
    counterValue.set(0);
  }, [counterValue, setCounterText]);

  useEffect(() => {
    const unsubscribe = counterValue.on("change", (latestValue) => {
      const nextValue = Math.min(metric.value, Math.floor(latestValue));
      setCounterText(nextValue, false);
    });

    return unsubscribe;
  }, [counterValue, metric.value, setCounterText]);

  useEffect(() => {
    if (!isActive || hasStartedRef.current) return undefined;

    hasStartedRef.current = true;
    setHasEntered(true);

    if (shouldReduceMotion) {
      counterValue.set(metric.value);
      setCounterText(metric.value, true);
      return undefined;
    }

    setIsCounting(true);
    const duration = 2200;
    let startTime: number | null = null;

    const completeCounter = () => {
      counterValue.set(metric.value);
      setCounterText(metric.value, false);

      frameRef.current = window.requestAnimationFrame(() => {
        setCounterText(metric.value, true);
        setIsCounting(false);
        frameRef.current = null;
      });
    };

    const tick = (time: number) => {
      if (startTime === null) startTime = time;

      const progress = Math.min((time - startTime) / duration, 1);
      const eased = easeOutQuart(progress);
      const nextValue = Math.min(metric.value - 1, Math.floor(eased * metric.value));

      if (progress < 1) {
        counterValue.set(Math.max(0, nextValue));
        frameRef.current = window.requestAnimationFrame(tick);
        return;
      }

      completeCounter();
    };

    frameRef.current = window.requestAnimationFrame(tick);

    return () => {
      if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current);
    };
  }, [counterValue, isActive, metric.value, setCounterText, shouldReduceMotion]);

  return (
    <motion.article
      aria-label={`${metric.value}${metric.suffix} ${metric.label}`}
      initial={false}
      animate={{
        opacity: hasEntered ? 1 : 0.58,
        y: hasEntered ? 0 : 10,
        filter: hasEntered ? "blur(0px)" : "blur(4px)",
        boxShadow: isCounting
          ? dark
            ? "0 18px 42px rgba(0,0,0,0.2), 0 0 24px rgba(214,180,95,0.18)"
            : "0 22px 58px rgba(86,58,27,0.09), 0 0 28px rgba(214,180,95,0.2)"
          : dark
            ? "0 12px 28px rgba(0,0,0,0.16)"
            : "0 18px 50px rgba(86,58,27,0.07)"
      }}
      whileHover={{ y: hasEntered ? -4 : 10 }}
      transition={{ duration: 0.62, ease }}
      className={cn("group relative overflow-hidden will-change-[opacity,transform,filter]", className)}
    >
      {showTopAccent ? (
        <span
          className="absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-[#d6b45f]/80 to-transparent"
          aria-hidden
        />
      ) : null}
      <span
        className={cn(
          "pointer-events-none absolute inset-0 opacity-0 transition duration-500",
          isCounting && (dark ? "opacity-100 bg-[radial-gradient(circle_at_50%_0%,rgba(214,180,95,0.2),transparent_62%)]" : "opacity-100 bg-[radial-gradient(circle_at_50%_0%,rgba(214,180,95,0.18),transparent_64%)]")
        )}
        aria-hidden
      />
      <span
        ref={valueRef}
        className={cn("relative z-10 block font-display tabular-nums tracking-normal", valueClassName)}
      >
        0
      </span>
      <span className={cn("relative z-10 block", labelClassName)}>{metric.label}</span>
    </motion.article>
  );
}

function AnimatedHeroMetricsGroup({
  className,
  metricClassName,
  valueClassName,
  labelClassName,
  dark = false,
  showTopAccent = false,
  entrance = false
}: {
  className?: string;
  metricClassName?: string;
  valueClassName?: string;
  labelClassName?: string;
  dark?: boolean;
  showTopAccent?: boolean;
  entrance?: boolean;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const hasTriggeredRef = useRef(false);
  const shouldReduceMotion = useReducedMotion();
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const element = rootRef.current;
    if (!element) return undefined;

    const trigger = () => {
      if (hasTriggeredRef.current) return;
      hasTriggeredRef.current = true;
      setIsActive(true);
    };

    if (shouldReduceMotion || typeof IntersectionObserver === "undefined") {
      trigger();
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        trigger();
        observer.disconnect();
      },
      { threshold: 0.32, rootMargin: "0px 0px -10% 0px" }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [shouldReduceMotion]);

  return (
    <motion.div
      ref={rootRef}
      initial={entrance ? { opacity: 0, y: 24 } : false}
      animate={entrance ? { opacity: 1, y: 0 } : undefined}
      transition={entrance ? { duration: 0.82, delay: 0.52, ease } : undefined}
      className={className}
    >
      {heroMetrics.map((metric) => (
        <AnimatedHeroMetricCard
          key={metric.label}
          metric={metric}
          isActive={isActive}
          dark={dark}
          showTopAccent={showTopAccent}
          className={metricClassName}
          valueClassName={valueClassName}
          labelClassName={labelClassName}
        />
      ))}
    </motion.div>
  );
}

const lifeStoryParticles = Array.from({ length: 14 }, (_, index) => ({
  left: 8 + ((index * 17) % 84),
  top: 10 + ((index * 23) % 76),
  delay: index * -0.48,
  drift: 8 + (index % 4) * 4
}));

const lifeNetworkNodes = [
  { label: "Design", x: 22, y: 30 },
  { label: "Build", x: 68, y: 26 },
  { label: "Trade", x: 46, y: 50 },
  { label: "Client", x: 76, y: 70 },
  { label: "Delivery", x: 24, y: 72 }
];

const lifeNetworkRoutes = [
  "M22 30 C35 18 54 18 68 26",
  "M22 30 C25 42 34 48 46 50",
  "M68 26 C65 40 58 48 46 50",
  "M46 50 C58 53 68 61 76 70",
  "M46 50 C36 56 28 64 24 72",
  "M24 72 C40 82 62 82 76 70"
];

function LifeStoryVisual({ activeIndex }: { activeIndex: number }) {
  const shouldReduceMotion = useReducedMotion();
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const smoothX = useSpring(pointerX, { stiffness: 72, damping: 26, mass: 0.7 });
  const smoothY = useSpring(pointerY, { stiffness: 72, damping: 26, mass: 0.7 });
  const rotateX = useTransform(smoothY, [-1, 1], [2.4, -2.4]);
  const rotateY = useTransform(smoothX, [-1, 1], [-3.2, 3.2]);
  const depthX = useTransform(smoothX, [-1, 1], [-4, 4]);
  const depthY = useTransform(smoothY, [-1, 1], [-4, 4]);
  const glassX = useTransform(smoothX, [-1, 1], [3, -3]);
  const glassY = useTransform(smoothY, [-1, 1], [3, -3]);

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (shouldReduceMotion) return;

    const bounds = event.currentTarget.getBoundingClientRect();
    pointerX.set(((event.clientX - bounds.left) / bounds.width - 0.5) * 2);
    pointerY.set(((event.clientY - bounds.top) / bounds.height - 0.5) * 2);
  };

  const handlePointerLeave = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  return (
    <motion.div
      data-life-visual-shell
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{ rotateX, rotateY, transformPerspective: 1200 }}
      className="relative mx-auto h-full min-h-0 aspect-[4/5] overflow-hidden rounded-[28px] border border-[#d8c8a9] bg-[#15110e] text-[#fff8ec] shadow-[0_30px_96px_rgba(57,38,17,0.18)] will-change-transform [contain:layout_paint] md:aspect-auto md:w-full md:min-h-[34rem] lg:min-h-[42rem]"
    >
      <style>
        {`
          .life-story-grid {
            background-image:
              linear-gradient(rgba(255, 248, 230, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 248, 230, 0.08) 1px, transparent 1px);
            background-size: 62px 62px;
            mask-image: radial-gradient(ellipse at center, black 0%, rgba(0, 0, 0, 0.72) 58%, transparent 88%);
            animation: life-story-grid-drift 28s linear infinite;
            will-change: transform;
          }

          .life-story-particle {
            position: absolute;
            left: var(--life-particle-left);
            top: var(--life-particle-top);
            height: 2px;
            width: 2px;
            border-radius: 999px;
            background: rgba(244, 220, 154, 0.76);
            opacity: 0.18;
            box-shadow: 0 0 14px rgba(214, 180, 95, 0.44);
            animation: life-story-particle-drift 8.8s ease-in-out var(--life-particle-delay) infinite;
            will-change: transform, opacity;
          }

          .life-story-reflection {
            animation: life-story-reflection-sweep 9.6s cubic-bezier(0.42, 0, 0.58, 1) infinite;
            will-change: transform, opacity;
          }

          .life-story-architecture-line {
            animation: life-story-architecture-float 11s ease-in-out var(--life-line-delay) infinite;
            will-change: transform, opacity;
          }

          .life-story-glass {
            box-shadow:
              0 26px 72px rgba(0, 0, 0, 0.28),
              0 10px 34px rgba(214, 180, 95, 0.08),
              inset 0 1px 0 rgba(255, 255, 255, 0.18);
            background:
              linear-gradient(145deg, rgba(255, 255, 255, 0.13), rgba(255, 255, 255, 0.055)),
              rgba(255, 255, 255, 0.08);
            border: 1px solid rgba(255, 255, 255, 0.16);
            backdrop-filter: blur(18px) saturate(135%);
            -webkit-backdrop-filter: blur(18px) saturate(135%);
          }

          .life-story-network-node {
            transform: translate3d(-50%, -50%, 0);
          }

          @media (max-width: 768px) {
            .careers-mobile-image-overlay {
              display: none !important;
            }
          }

          @keyframes life-story-grid-drift {
            0% { transform: translate3d(0, 0, 0); }
            100% { transform: translate3d(62px, 62px, 0); }
          }

          @keyframes life-story-particle-drift {
            0%, 100% { opacity: 0.08; transform: translate3d(0, 0, 0); }
            45% { opacity: 0.28; transform: translate3d(var(--life-particle-drift), -18px, 0); }
          }

          @keyframes life-story-reflection-sweep {
            0%, 18% { opacity: 0; transform: translate3d(-48%, -18%, 0) rotate(15deg); }
            45% { opacity: 0.22; }
            78%, 100% { opacity: 0; transform: translate3d(54%, 18%, 0) rotate(15deg); }
          }

          @keyframes life-story-architecture-float {
            0%, 100% { opacity: 0.32; transform: translate3d(0, 0, 0); }
            50% { opacity: 0.58; transform: translate3d(18px, -12px, 0); }
          }

          @media (prefers-reduced-motion: reduce) {
            .life-story-grid,
            .life-story-particle,
            .life-story-reflection,
            .life-story-architecture-line {
              animation: none !important;
            }
          }
        `}
      </style>

      <motion.div style={{ x: depthX, y: depthY }} className="absolute inset-[-4%]">
        {lifeExperiences.map(({ Icon, ...experience }, index) => (
          <article
            key={experience.title}
            data-life-visual-layer
            data-life-step={index}
            aria-hidden={activeIndex !== index}
            style={
              shouldReduceMotion
                ? {
                    opacity: activeIndex === index ? 1 : 0,
                    visibility: activeIndex === index ? "visible" : "hidden",
                    transform: "none"
                  }
                : undefined
            }
            className="absolute inset-0 overflow-hidden opacity-0 will-change-[opacity,transform,filter]"
          >
            <div className="absolute inset-[-5%]">
              <img
                data-life-visual-image
                src={experience.image}
                alt={experience.alt}
                decoding="async"
                loading={index === 0 ? "eager" : "lazy"}
                className="careers-mobile-clean-life-image h-full w-full object-cover object-center opacity-100 will-change-transform [transform:translateZ(0)] md:opacity-[0.88]"
              />
            </div>
            <div className="careers-mobile-clean-life-gradient absolute inset-0 bg-[linear-gradient(135deg,rgba(20,14,10,0.02),rgba(20,14,10,0.2)_62%,rgba(20,14,10,0.42))] md:bg-[linear-gradient(135deg,rgba(20,14,10,0.08),rgba(20,14,10,0.62)_62%,rgba(20,14,10,0.9))]" />
            <div
              data-life-ambient-layer
              className={cn(
                "careers-mobile-clean-life-ambient absolute inset-0 opacity-35 md:opacity-80",
                index === 0 && "bg-[radial-gradient(circle_at_24%_18%,rgba(214,180,95,0.28),transparent_34%),radial-gradient(circle_at_72%_78%,rgba(139,17,24,0.16),transparent_34%)]",
                index === 1 && "bg-[radial-gradient(circle_at_72%_22%,rgba(255,246,216,0.28),transparent_32%),radial-gradient(circle_at_28%_76%,rgba(214,180,95,0.18),transparent_36%)]",
                index === 2 && "bg-[radial-gradient(circle_at_48%_44%,rgba(214,180,95,0.26),transparent_36%),radial-gradient(circle_at_78%_68%,rgba(139,17,24,0.2),transparent_34%)]",
                index === 3 && "bg-[radial-gradient(circle_at_30%_74%,rgba(255,248,230,0.24),transparent_32%),radial-gradient(circle_at_74%_28%,rgba(214,180,95,0.2),transparent_38%)]",
                index === 4 && "bg-[radial-gradient(circle_at_52%_26%,rgba(214,180,95,0.32),transparent_36%),radial-gradient(circle_at_18%_74%,rgba(255,248,230,0.2),transparent_34%)]"
              )}
            />

            <div className="life-story-grid absolute inset-0 opacity-[0.16]" aria-hidden />

            <div className="pointer-events-none absolute inset-0" aria-hidden>
              {Array.from({ length: 5 }).map((_, lineIndex) => (
                <span
                  key={lineIndex}
                  className="life-story-architecture-line absolute h-px bg-gradient-to-r from-transparent via-[#f4dc9a]/44 to-transparent"
                  style={
                    {
                      left: `${8 + lineIndex * 13}%`,
                      top: `${18 + ((lineIndex * 17 + index * 7) % 58)}%`,
                      width: `${26 + lineIndex * 8}%`,
                      transform: `rotate(${lineIndex % 2 === 0 ? -12 : 14}deg)`,
                      "--life-line-delay": `${(lineIndex + index) * -0.72}s`
                    } as React.CSSProperties
                  }
                />
              ))}
            </div>

            {index === 2 && (
              <div data-life-network className="careers-mobile-image-overlay absolute inset-0 z-10 hidden md:block">
                <svg
                  aria-hidden
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                  className="absolute inset-[8%] h-[84%] w-[84%] overflow-visible opacity-80"
                >
                  <defs>
                    <linearGradient id="lifeNetworkGold" x1="0%" x2="100%" y1="0%" y2="100%">
                      <stop offset="0%" stopColor="rgba(255,248,230,0.1)" />
                      <stop offset="48%" stopColor="rgba(214,180,95,0.86)" />
                      <stop offset="100%" stopColor="rgba(255,248,230,0.24)" />
                    </linearGradient>
                  </defs>
                  {lifeNetworkRoutes.map((route) => (
                    <path
                      key={route}
                      data-life-network-route
                      d={route}
                      fill="none"
                      stroke="url(#lifeNetworkGold)"
                      strokeLinecap="round"
                      strokeWidth="0.65"
                      pathLength={1}
                    />
                  ))}
                </svg>
                {lifeNetworkNodes.map((node) => (
                  <div
                    key={node.label}
                    data-life-network-node
                    className="life-story-network-node absolute rounded-full border border-[#d6b45f]/28 bg-[#17120f]/72 px-3 py-2 text-[0.58rem] font-semibold uppercase tracking-[0.18em] text-[#f2d994] shadow-[0_16px_42px_rgba(0,0,0,0.22)] backdrop-blur-md"
                    style={{ left: `${node.x}%`, top: `${node.y}%` }}
                  >
                    {node.label}
                  </div>
                ))}
              </div>
            )}

            <motion.div
              style={{ x: glassX, y: glassY }}
              className="careers-mobile-image-overlay absolute inset-[4%] z-20 hidden md:block"
            >
              <div
                data-life-glass
                className="life-story-glass absolute left-3 top-3 flex max-w-[calc(100%-1.5rem)] origin-top-left items-center gap-2.5 rounded-[18px] px-3 py-2.5 md:left-10 md:top-10 md:max-w-[24rem] md:gap-3 md:rounded-[20px] md:px-5 md:py-4"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[13px] border border-[#d6b45f]/34 bg-white/[0.07] text-[#f2d994] md:h-10 md:w-10 md:rounded-[14px]">
                  <Icon className="h-[18px] w-[18px] md:h-5 md:w-5" strokeWidth={1.7} />
                </span>
                <span className="min-w-0">
                  <span className="block text-[0.56rem] font-semibold uppercase leading-[1.35] tracking-[0.16em] text-[#d6b45f] md:text-[0.62rem] md:tracking-[0.18em]">
                    {experience.signal}
                  </span>
                  <span className="mt-1 block text-[12px] font-semibold leading-4 text-[#fff8ec] md:mt-1.5 md:text-sm md:leading-5">Culture layer</span>
                </span>
              </div>

              <div
                data-life-glass
                className="life-story-glass absolute bottom-3 left-3 right-3 origin-bottom-left rounded-[20px] p-4 md:bottom-10 md:left-10 md:right-auto md:w-[22rem] md:rounded-[24px] md:p-6"
              >
                <div className="flex items-center justify-between gap-4 md:gap-5">
                  <div>
                    <p className="text-[0.56rem] font-semibold uppercase leading-[1.35] tracking-[0.16em] text-[#d6b45f] md:text-[0.62rem] md:tracking-[0.18em]">
                      Active Mode
                    </p>
                    <p className="mt-2 font-display text-[22px] font-semibold leading-none tracking-normal md:mt-3 md:text-[30px]">
                      {experience.metric}
                    </p>
                    <p className="mt-2 text-[10px] font-medium uppercase leading-[1.45] tracking-[0.12em] text-white/62 md:mt-2.5 md:text-xs md:tracking-[0.14em]">
                      {experience.metricLabel}
                    </p>
                  </div>
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#d6b45f]/32 bg-[#d6b45f]/12 md:h-12 md:w-12">
                    <span className="h-2 w-2 rounded-full bg-[#f1d58d] shadow-[0_0_22px_rgba(214,180,95,0.86)]" />
                  </div>
                </div>
              </div>

              <div
                data-life-glass
                className="life-story-glass absolute right-10 top-[37%] hidden w-[17rem] rounded-[22px] p-5 text-white md:block"
              >
                <p className="text-[0.62rem] font-semibold uppercase leading-[1.35] tracking-[0.18em] text-[#f2d994]">
                  Culture Modules
                </p>
                <div className="mt-5 space-y-3.5">
                  {experience.modules.map((module, moduleIndex) => (
                    <div key={module} className="flex items-center gap-3.5">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/14 bg-white/[0.07] text-[11px] font-semibold text-[#f2d994]">
                        {moduleIndex + 1}
                      </span>
                      <span className="text-sm font-medium leading-5 text-white/84">{module}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </article>
        ))}
      </motion.div>

      <div className="pointer-events-none absolute inset-0 z-30 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),transparent_34%,rgba(0,0,0,0.2))]" aria-hidden />
      <div className="life-story-reflection pointer-events-none absolute -left-1/2 top-[-16%] z-30 h-[140%] w-[42%] rotate-[15deg] bg-[linear-gradient(90deg,transparent,rgba(255,248,230,0.22),transparent)]" aria-hidden />
      {lifeStoryParticles.map((particle, index) => (
        <span
          key={index}
          className="life-story-particle z-30"
          style={
            {
              "--life-particle-left": `${particle.left}%`,
              "--life-particle-top": `${particle.top}%`,
              "--life-particle-delay": `${particle.delay}s`,
              "--life-particle-drift": `${particle.drift}px`
            } as React.CSSProperties
          }
        />
      ))}
    </motion.div>
  );
}

export function PremiumCareersPage() {
  const rootRef = useRef<HTMLDivElement>(null);
  const heroArtRef = useRef<HTMLDivElement>(null);
  const lifeSectionRef = useRef<HTMLElement>(null);
  const lifePinRef = useRef<HTMLDivElement>(null);
  const lifeScrollTriggerRef = useRef<ScrollTrigger | null>(null);
  const activeLifeIndexRef = useRef(0);
  const lastLifeInteractionRef = useRef(0);
  const lifeScrollActiveRef = useRef(false);
  const processJourneyRef = useRef<HTMLDivElement>(null);
  const processLineRef = useRef<HTMLSpanElement>(null);
  const lenis = useLenis();
  const shouldReduceMotion = useReducedMotion();
  const [activeLifeIndex, setActiveLifeIndex] = useState(0);
  const [activeProcessStep, setActiveProcessStep] = useState(0);
  const [applicationRole, setApplicationRole] = useState<string | null>(null);
  const heroPointerX = useMotionValue(0);
  const heroPointerY = useMotionValue(0);
  const heroSmoothX = useSpring(heroPointerX, { stiffness: 82, damping: 26, mass: 0.55 });
  const heroSmoothY = useSpring(heroPointerY, { stiffness: 82, damping: 26, mass: 0.55 });
  const heroImageX = useTransform(heroSmoothX, [-1, 1], [-10, 10]);
  const heroImageY = useTransform(heroSmoothY, [-1, 1], [-8, 8]);
  const heroCardNearX = useTransform(heroSmoothX, [-1, 1], [8, -8]);
  const heroCardNearY = useTransform(heroSmoothY, [-1, 1], [7, -7]);
  const heroCardFarX = useTransform(heroSmoothX, [-1, 1], [-6, 6]);
  const heroCardFarY = useTransform(heroSmoothY, [-1, 1], [-5, 5]);
  const heroVisualRotateX = useTransform(heroSmoothY, [-1, 1], [1.8, -1.8]);
  const heroVisualRotateY = useTransform(heroSmoothX, [-1, 1], [-2.4, 2.4]);

  const handleHeroPointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (shouldReduceMotion) return;

      const bounds = event.currentTarget.getBoundingClientRect();
      heroPointerX.set(((event.clientX - bounds.left) / bounds.width - 0.5) * 2);
      heroPointerY.set(((event.clientY - bounds.top) / bounds.height - 0.5) * 2);
    },
    [heroPointerX, heroPointerY, shouldReduceMotion]
  );

  const handleHeroPointerLeave = useCallback(() => {
    heroPointerX.set(0);
    heroPointerY.set(0);
  }, [heroPointerX, heroPointerY]);

  const openApplicationModal = useCallback((roleTitle: string) => {
    setApplicationRole(roleTitle);
  }, []);

  const closeApplicationModal = useCallback(() => {
    setApplicationRole(null);
  }, []);

  const activateLifeExperience = useCallback((index: number, fromInteraction = false) => {
    const nextIndex = (index + lifeExperiences.length) % lifeExperiences.length;

    if (fromInteraction) {
      lastLifeInteractionRef.current = Date.now();
    }

    activeLifeIndexRef.current = nextIndex;
    setActiveLifeIndex((currentIndex) => (currentIndex === nextIndex ? currentIndex : nextIndex));
  }, []);

  const scrollToLifeExperience = useCallback(
    (index: number) => {
      const nextIndex = Math.min(lifeExperiences.length - 1, Math.max(0, index));
      const trigger = lifeScrollTriggerRef.current;

      lastLifeInteractionRef.current = Date.now();
      activateLifeExperience(nextIndex, true);

      if (!trigger || shouldReduceMotion) return;

      const targetProgress = nextIndex / Math.max(1, lifeExperiences.length - 1);
      const targetScroll = trigger.start + (trigger.end - trigger.start) * targetProgress;

      if (lenis) {
        lenis.scrollTo(targetScroll, {
          duration: 1.15,
          easing: (time: number) => 1 - Math.pow(1 - time, 3)
        });
        return;
      }

      window.scrollTo({ top: targetScroll, behavior: "smooth" });
    },
    [activateLifeExperience, lenis, shouldReduceMotion]
  );

  useEffect(() => {
    lifeExperiences.forEach(({ image }) => {
      const preload = new window.Image();
      preload.decoding = "async";
      preload.src = image;
    });
  }, []);

  useEffect(() => {
    if (shouldReduceMotion) return;

    const processInterval = window.setInterval(() => {
      setActiveProcessStep((current) => (current + 1) % processSteps.length);
    }, 2700);

    return () => window.clearInterval(processInterval);
  }, [shouldReduceMotion]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const context = gsap.context(() => {
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const isMobileViewport = window.matchMedia("(max-width: 767px)").matches;
      const revealY = isMobileViewport ? 20 : 34;
      const lifePanelY = isMobileViewport ? 20 : 46;
      const lifeItemY = isMobileViewport ? 18 : 40;
      const lifeGlassY = isMobileViewport ? 16 : 34;
      const lifeGlassScale = isMobileViewport ? 0.78 : 1;
      const networkHiddenY = isMobileViewport ? 14 : 22;
      const networkHiddenScale = isMobileViewport ? 0.74 : 0.92;
      const networkVisibleScale = isMobileViewport ? 0.8 : 1;

      if (reduceMotion) {
        gsap.set("[data-careers-reveal]", { opacity: 1, y: 0 });
        gsap.set(processLineRef.current, { scaleX: 1 });
        gsap.set("[data-life-progress-fill]", { scaleY: 1, transformOrigin: "top center" });
        return;
      }

      gsap.utils.toArray<HTMLElement>("[data-careers-reveal]").forEach((element) => {
        gsap.fromTo(
          element,
          { opacity: 0, y: revealY },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power4.out",
            scrollTrigger: {
              trigger: element,
              start: "top 84%",
              once: true
            }
          }
        );
      });

      if (heroArtRef.current) {
        gsap.to(heroArtRef.current, {
          y: isMobileViewport ? 20 : 44,
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: "bottom top",
            scrub: 1.2
          }
        });
      }

      if (lifeSectionRef.current && lifePinRef.current) {
        const lifeSection = lifeSectionRef.current;
        const lifePin = lifePinRef.current;
        const lifeGrid = lifeSection.querySelector("[data-life-grid]");
        const lifeGlow = lifeSection.querySelector("[data-life-glow]");
        const lifeBackdrop = lifeSection.querySelector("[data-life-backdrop]");
        const copyPanels = gsap.utils.toArray<HTMLElement>("[data-life-copy-panel]", lifeSection);
        const visualLayers = gsap.utils.toArray<HTMLElement>("[data-life-visual-layer]", lifeSection);
        const visualImages = gsap.utils.toArray<HTMLElement>("[data-life-visual-image]", lifeSection);
        const progressFill = lifeSection.querySelector("[data-life-progress-fill]");
        const progressGlow = lifeSection.querySelector("[data-life-progress-glow]");
        const menuButtons = gsap.utils.toArray<HTMLElement>("[data-life-menu-button]", lifeSection);
        const menuLines = gsap.utils.toArray<HTMLElement>("[data-life-menu-line]", lifeSection);
        const menuDots = gsap.utils.toArray<HTMLElement>("[data-life-menu-dot]", lifeSection);
        const allCopyItems = copyPanels.flatMap((panel) =>
          gsap.utils.toArray<HTMLElement>("[data-life-copy-item]", panel)
        );
        const allGlass = visualLayers.flatMap((panel) =>
          gsap.utils.toArray<HTMLElement>("[data-life-glass]", panel)
        );
        const networkRoutes = gsap.utils.toArray<SVGPathElement>("[data-life-network-route]", lifeSection);
        const networkNodes = gsap.utils.toArray<HTMLElement>("[data-life-network-node]", lifeSection);
        const totalSegments = lifeExperiences.length - 1;
        const storyDuration = totalSegments + 0.95;

        gsap.set([lifeGrid, lifeGlow, lifeBackdrop].filter(Boolean), { force3D: true });
        gsap.set(copyPanels, { autoAlpha: 0, y: lifePanelY, force3D: true });
        gsap.set(allCopyItems, { autoAlpha: 0, y: lifeItemY, force3D: true });
        gsap.set(visualLayers, { autoAlpha: 0, scale: 1.035, force3D: true });
        gsap.set(visualImages, { scale: 1.14, xPercent: 1, yPercent: -1, force3D: true });
        gsap.set(allGlass, { autoAlpha: 0, y: lifeGlassY, scale: lifeGlassScale, force3D: true });
        gsap.set(networkRoutes, { opacity: 0, strokeDasharray: 1, strokeDashoffset: 1 });
        gsap.set(networkNodes, { autoAlpha: 0, y: networkHiddenY, scale: networkHiddenScale, force3D: true });
        gsap.set(progressFill, { scaleY: 0, transformOrigin: "top center", force3D: true });
        gsap.set(progressGlow, { autoAlpha: 0.34, yPercent: 0, force3D: true });
        gsap.set(menuButtons, { opacity: (index) => (index === 0 ? 1 : 0.54), force3D: true });
        gsap.set(menuLines, { scaleY: (index) => (index === 0 ? 1 : 0.18), transformOrigin: "top center" });
        gsap.set(menuDots, { scale: (index) => (index === 0 ? 1 : 0.78), transformOrigin: "50% 50%" });

        if (copyPanels[0]) {
          const firstItems = gsap.utils.toArray<HTMLElement>("[data-life-copy-item]", copyPanels[0]);
          gsap.set(copyPanels[0], { autoAlpha: 1, y: 0 });
          gsap.set(firstItems, { autoAlpha: 1, y: 0 });
        }

        if (visualLayers[0]) {
          const firstGlass = gsap.utils.toArray<HTMLElement>("[data-life-glass]", visualLayers[0]);
          gsap.set(visualLayers[0], { autoAlpha: 1, scale: 1 });
          gsap.set(firstGlass, { autoAlpha: 1, y: 0, scale: lifeGlassScale });
        }

        const lifeTimeline = gsap.timeline({
          defaults: { ease: "power3.inOut" },
          scrollTrigger: {
            trigger: lifeSection,
            start: "top top",
            end: () => `+=${Math.max(window.innerHeight * 4.6, lifeExperiences.length * 760)}`,
            pin: lifePin,
            scrub: 1.28,
            pinSpacing: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onEnter: () => {
              lifeScrollActiveRef.current = true;
            },
            onEnterBack: () => {
              lifeScrollActiveRef.current = true;
            },
            onLeave: () => {
              lifeScrollActiveRef.current = false;
            },
            onLeaveBack: () => {
              lifeScrollActiveRef.current = false;
            },
            onRefresh: (self) => {
              lifeScrollTriggerRef.current = self;
            },
            onUpdate: (self) => {
              const nextIndex = Math.min(
                lifeExperiences.length - 1,
                Math.max(0, Math.round(self.progress * totalSegments))
              );

              if (nextIndex !== activeLifeIndexRef.current) {
                activateLifeExperience(nextIndex);
              }
            }
          }
        });

        lifeScrollTriggerRef.current = lifeTimeline.scrollTrigger ?? null;

        lifeTimeline.to(progressFill, { scaleY: 1, duration: storyDuration, ease: "none" }, 0);
        lifeTimeline.to(progressGlow, { yPercent: 210, duration: storyDuration, ease: "none" }, 0);

        if (lifeGrid) {
          lifeTimeline.to(lifeGrid, { xPercent: -2.4, yPercent: 1.8, duration: storyDuration, ease: "none" }, 0);
        }

        if (lifeGlow) {
          lifeTimeline.to(lifeGlow, { x: 64, y: -42, scale: 1.16, duration: storyDuration, ease: "none" }, 0);
        }

        if (lifeBackdrop) {
          lifeTimeline.to(lifeBackdrop, { y: -34, scale: 1.025, duration: storyDuration, ease: "none" }, 0);
        }

        if (visualImages[0]) {
          lifeTimeline.to(
            visualImages[0],
            { scale: 1.045, xPercent: -1.2, yPercent: 0.8, duration: 1.35, ease: "none" },
            0
          );
        }

        Array.from({ length: totalSegments }).forEach((_, segmentIndex) => {
          const nextIndex = segmentIndex + 1;
          const position = nextIndex;
          const previousCopy = copyPanels[segmentIndex];
          const currentCopy = copyPanels[nextIndex];
          const previousLayer = visualLayers[segmentIndex];
          const currentLayer = visualLayers[nextIndex];
          const currentImage = visualImages[nextIndex];
          const previousItems = previousCopy
            ? gsap.utils.toArray<HTMLElement>("[data-life-copy-item]", previousCopy)
            : [];
          const currentItems = currentCopy
            ? gsap.utils.toArray<HTMLElement>("[data-life-copy-item]", currentCopy)
            : [];
          const previousGlass = previousLayer
            ? gsap.utils.toArray<HTMLElement>("[data-life-glass]", previousLayer)
            : [];
          const currentGlass = currentLayer
            ? gsap.utils.toArray<HTMLElement>("[data-life-glass]", currentLayer)
            : [];

          lifeTimeline.to(
            previousItems,
            {
              autoAlpha: 0,
              y: -26,
              duration: 0.52,
              stagger: 0.03
            },
            position - 0.56
          );
          lifeTimeline.to(
            previousCopy,
            {
              autoAlpha: 0,
              y: -34,
              duration: 0.76
            },
            position - 0.52
          );
          lifeTimeline.fromTo(
            currentCopy,
            { autoAlpha: 0, y: lifePanelY },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.92
            },
            position - 0.5
          );
          lifeTimeline.fromTo(
            currentItems,
            { autoAlpha: 0, y: lifeItemY },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.84,
              stagger: 0.08
            },
            position - 0.46
          );

          lifeTimeline.to(
            previousGlass,
            {
              autoAlpha: 0,
              y: isMobileViewport ? -14 : -20,
              scale: lifeGlassScale,
              duration: 0.56,
              stagger: 0.04
            },
            position - 0.58
          );
          lifeTimeline.to(
            previousLayer,
            {
              autoAlpha: 0,
              scale: 1.018,
              duration: 1.05
            },
            position - 0.62
          );
          lifeTimeline.fromTo(
            currentLayer,
            { autoAlpha: 0, scale: 1.035 },
            {
              autoAlpha: 1,
              scale: 1,
              duration: 1.08
            },
            position - 0.62
          );
          lifeTimeline.fromTo(
            currentImage,
            { scale: 1.145, xPercent: 1.4, yPercent: -1 },
            {
              scale: 1.04,
              xPercent: -1.15,
              yPercent: 0.85,
              duration: 1.58,
              ease: "none"
            },
            position - 0.62
          );
          lifeTimeline.fromTo(
            currentGlass,
            { autoAlpha: 0, y: lifeGlassY, scale: lifeGlassScale },
            {
              autoAlpha: 1,
              y: 0,
              scale: lifeGlassScale,
              duration: 0.92,
              stagger: 0.08
            },
            position - 0.32
          );

          lifeTimeline.to(
            menuButtons,
            {
              opacity: (buttonIndex) => (buttonIndex === nextIndex ? 1 : buttonIndex < nextIndex ? 0.72 : 0.48),
              duration: 0.7
            },
            position - 0.4
          );
          lifeTimeline.to(
            menuLines,
            {
              scaleY: (buttonIndex) => (buttonIndex === nextIndex ? 1 : buttonIndex < nextIndex ? 0.5 : 0.18),
              duration: 0.72
            },
            position - 0.4
          );
          lifeTimeline.to(
            menuDots,
            {
              scale: (buttonIndex) => (buttonIndex === nextIndex ? 1 : buttonIndex < nextIndex ? 0.88 : 0.74),
              duration: 0.72
            },
            position - 0.4
          );
        });

        lifeTimeline.to(
          networkRoutes,
          {
            opacity: 0.88,
            strokeDashoffset: 0,
            duration: 0.95,
            stagger: 0.08
          },
          connectedLifeIndex - 0.18
        );
        lifeTimeline.to(
          networkNodes,
          {
            autoAlpha: 1,
            y: 0,
            scale: networkVisibleScale,
            duration: 0.9,
            stagger: 0.09
          },
          connectedLifeIndex - 0.02
        );
      }

      if (processLineRef.current) {
        gsap.fromTo(
          processLineRef.current,
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: "none",
            scrollTrigger: {
              trigger: processLineRef.current,
              start: "top 78%",
              end: "bottom 42%",
              scrub: 1.1
            }
          }
        );
      }

      if (processJourneyRef.current) {
        gsap.to("[data-hiring-depth='soft']", {
          y: -26,
          ease: "none",
          scrollTrigger: {
            trigger: processJourneyRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.2
          }
        });

        gsap.to("[data-hiring-depth='near']", {
          y: 18,
          ease: "none",
          scrollTrigger: {
            trigger: processJourneyRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.4
          }
        });
      }
    }, root);

    return () => {
      lifeScrollActiveRef.current = false;
      lifeScrollTriggerRef.current = null;
      context.revert();
    };
  }, [activateLifeExperience]);

  return (
    <div ref={rootRef} className="relative overflow-hidden bg-[#f8f3e8] text-[#1e1814]">
      <section className="relative isolate min-h-[100svh] overflow-hidden px-4 pb-6 pt-[5.35rem] sm:px-6 md:px-8 md:pb-10 md:pt-28 lg:min-h-screen lg:pt-32">
        <style>
          {`
            .careers-hero-grid {
              background-image:
                linear-gradient(rgba(87, 65, 38, 0.09) 1px, transparent 1px),
                linear-gradient(90deg, rgba(87, 65, 38, 0.075) 1px, transparent 1px);
              background-size: 72px 72px;
              mask-image: linear-gradient(90deg, rgba(0, 0, 0, 0.72), rgba(0, 0, 0, 0.28) 74%, transparent);
            }

            .careers-hero-scan {
              animation: careers-hero-scan 8.8s cubic-bezier(0.42, 0, 0.58, 1) infinite;
              will-change: transform, opacity;
            }

            .careers-hero-flow-line {
              animation: careers-hero-flow-line 11s ease-in-out infinite;
              will-change: transform, opacity;
            }

            .careers-hero-live-dot {
              animation: careers-hero-live-dot 3.4s ease-in-out infinite;
              will-change: opacity, transform;
            }

            @keyframes careers-hero-scan {
              0%, 18% { opacity: 0; transform: translate3d(-62%, 0, 0); }
              48% { opacity: 0.28; }
              82%, 100% { opacity: 0; transform: translate3d(82%, 0, 0); }
            }

            @keyframes careers-hero-flow-line {
              0%, 100% { opacity: 0.32; transform: translate3d(-8px, 0, 0); }
              50% { opacity: 0.72; transform: translate3d(12px, 0, 0); }
            }

            @keyframes careers-hero-live-dot {
              0%, 100% { opacity: 0.62; transform: scale(0.92); }
              50% { opacity: 1; transform: scale(1); }
            }

            @media (max-width: 768px) {
              .careers-mobile-image-overlay {
                display: none !important;
              }

              .careers-mobile-clean-hero-gradient {
                background:
                  linear-gradient(115deg, rgba(18, 14, 11, 0.04), rgba(18, 14, 11, 0.03) 38%, rgba(18, 14, 11, 0.24)),
                  linear-gradient(180deg, transparent 56%, rgba(18, 14, 11, 0.32)) !important;
              }

              .careers-mobile-clean-life-image {
                opacity: 1 !important;
              }

              .careers-mobile-clean-life-gradient {
                background: linear-gradient(135deg, rgba(20, 14, 10, 0.02), rgba(20, 14, 10, 0.2) 62%, rgba(20, 14, 10, 0.42)) !important;
              }

              .careers-mobile-clean-life-ambient {
                opacity: 0.35 !important;
              }
            }

            @media (prefers-reduced-motion: reduce) {
              .careers-hero-scan,
              .careers-hero-flow-line,
              .careers-hero-live-dot {
                animation: none !important;
              }
            }
          `}
        </style>

        <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(118deg,#fffdf8_0%,#f8f0e5_52%,#ecddc3_100%)]" aria-hidden />
        <div className="careers-hero-grid pointer-events-none absolute inset-0 -z-10 opacity-80" aria-hidden />
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(255,255,255,0.74),transparent_42%,rgba(214,180,95,0.1)),linear-gradient(180deg,rgba(255,255,255,0.58),transparent_48%,rgba(99,65,26,0.08))]" aria-hidden />
        <div className="pointer-events-none absolute left-[-8%] top-[18%] -z-10 h-px w-[62vw] rotate-[-13deg] bg-gradient-to-r from-transparent via-[#d6b45f]/54 to-transparent" aria-hidden />
        <div className="pointer-events-none absolute bottom-[16%] right-[-10%] -z-10 h-px w-[54vw] rotate-[10deg] bg-gradient-to-r from-transparent via-[#8b1118]/16 to-transparent" aria-hidden />

        <div className="mx-auto grid min-h-[calc(100svh-6.85rem)] w-full max-w-[92rem] items-start gap-5 md:min-h-[calc(100svh-9rem)] md:gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:gap-12">
          <div className="relative z-10 max-w-[44rem] lg:pb-6">
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.72, ease }}
              className="text-[0.68rem] font-bold uppercase tracking-[0.24em] text-[#8b1118] md:text-[0.74rem]"
            >
              Careers at Ractysh
            </motion.p>

            <h1 className="mt-3 text-[clamp(2.9rem,11.4vw,4.35rem)] font-semibold italic leading-[0.9] tracking-[0] text-[#17120f] font-display [word-spacing:0.035em] md:mt-5 md:text-[clamp(4.45rem,6.7vw,6.85rem)] md:[word-spacing:0.02em] lg:max-w-[13ch]">
              <span className="md:hidden">
                {["Build the", "future of", "enterprise", "excellence."].map((line, index) => (
                  <motion.span
                    key={line}
                    initial={{ opacity: 0, y: 46 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.92, delay: 0.08 + index * 0.08, ease }}
                    className="block whitespace-nowrap will-change-[opacity,transform,filter]"
                  >
                    {line}
                  </motion.span>
                ))}
              </span>
              <span className="hidden md:block">
                {["Build the", "future of", "enterprise", "excellence."].map((line, index) => (
                  <motion.span
                    key={line}
                    initial={{ opacity: 0, y: 46 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.92, delay: 0.08 + index * 0.08, ease }}
                    className="block whitespace-nowrap will-change-[opacity,transform,filter]"
                  >
                    {line}
                  </motion.span>
                ))}
              </span>
            </h1>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.82, delay: 0.32, ease }}
              className="mt-5 max-w-[39rem] text-[14px] leading-[1.7] text-[#5f5549] md:mt-7 md:text-[17px]"
            >
              <p className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[0.72rem] font-semibold uppercase leading-[1.7] tracking-[0] text-[#b68a35] [font-family:var(--font-manrope)] md:gap-x-3.5 md:text-[0.82rem]">
                {heroDisciplines.map((discipline, index) => (
                  <span key={discipline} className="inline-flex items-center gap-x-3 md:gap-x-3.5">
                    <span>{discipline.replace(/\.$/, "")}</span>
                    {index < heroDisciplines.length - 1 ? (
                      <span className="text-[#8b1118]/45" aria-hidden="true">
                        •
                      </span>
                    ) : null}
                  </span>
                ))}
              </p>
              <p className="mt-3 max-w-[35rem] text-[1.12rem] font-semibold italic leading-[1.45] tracking-[0] text-[#67513b] font-display md:mt-4 md:text-[1.34rem]">
                One ecosystem. One team. One standard of execution.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.78, delay: 0.42, ease }}
              className="mt-5 flex flex-wrap items-center gap-2.5 md:mt-8 md:gap-3"
            >
              <a href="/book-consultation" className="premium-cta">
                Book Consultation
                <ArrowUpRight className="h-4 w-4" />
              </a>
              <a href="/contact" className="premium-cta-secondary">
                Contact Team
                <ArrowUpRight className="h-4 w-4" />
              </a>
              <a href="#open-roles" className="premium-cta">
                Explore Opportunities
                <ArrowUpRight className="h-4 w-4" />
              </a>
              <button
                type="button"
                onClick={() => openApplicationModal("General Application")}
                className="premium-cta-secondary"
              >
                Submit Resume
                <ArrowUpRight className="h-4 w-4" />
              </button>
            </motion.div>

            <AnimatedHeroMetricsGroup
              entrance
              className="mt-8 hidden grid-cols-3 gap-3 lg:grid"
              showTopAccent
              metricClassName="rounded-[22px] border border-[#d9c79c]/76 bg-white/66 px-4 py-4 backdrop-blur-md transition duration-500 hover:border-[#c8a35a] hover:bg-[#fffaf0]"
              valueClassName="min-w-[4.8rem] text-[34px] font-semibold leading-none text-[#181512]"
              labelClassName="mt-2 text-[0.66rem] font-bold uppercase leading-4 tracking-[0.16em] text-[#806224]"
            />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 28, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.05, delay: 0.24, ease }}
            onPointerMove={handleHeroPointerMove}
            onPointerLeave={handleHeroPointerLeave}
            style={{ rotateX: heroVisualRotateX, rotateY: heroVisualRotateY, transformPerspective: 1400 }}
            className="relative z-10 mx-auto w-full max-w-[42rem] origin-center will-change-transform lg:max-w-none"
          >
            <div ref={heroArtRef} className="relative h-[clamp(17rem,36svh,22rem)] w-full will-change-transform md:h-[34rem] lg:h-[clamp(38rem,70vh,46rem)]">
              <div className="absolute inset-0 overflow-hidden rounded-[26px] border border-[#d9c799] bg-[#17120f] shadow-[0_32px_90px_rgba(73,48,23,0.18)] md:rounded-[34px]">
                <motion.div
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: shouldReduceMotion ? 0 : 1.25, ease }}
                  style={{ x: heroImageX, y: heroImageY }}
                  className="absolute inset-[-3%] will-change-transform"
                >
                  <Image
                    src="/contact/enterprise-architecture-workspace.webp"
                    alt="Premium Ractysh enterprise workspace"
                    fill
                    priority
                    fetchPriority="high"
                    sizes="(max-width: 1024px) 100vw, 52vw"
                    className="object-cover object-center"
                  />
                </motion.div>
                <div className="careers-mobile-clean-hero-gradient absolute inset-0 bg-[linear-gradient(115deg,rgba(18,14,11,0.04),rgba(18,14,11,0.03)_38%,rgba(18,14,11,0.24)),linear-gradient(180deg,transparent_56%,rgba(18,14,11,0.32))] md:bg-[linear-gradient(115deg,rgba(18,14,11,0.16),rgba(18,14,11,0.1)_38%,rgba(18,14,11,0.72)),linear-gradient(180deg,transparent_44%,rgba(18,14,11,0.74))]" aria-hidden />
                <div className="careers-mobile-image-overlay absolute inset-0 hidden opacity-35 [background-image:linear-gradient(rgba(255,248,230,0.14)_1px,transparent_1px),linear-gradient(90deg,rgba(255,248,230,0.12)_1px,transparent_1px)] [background-size:54px_54px] md:block" aria-hidden />
                <span className="careers-mobile-image-overlay careers-hero-scan pointer-events-none absolute inset-y-0 left-0 hidden w-1/2 bg-[linear-gradient(90deg,transparent,rgba(255,248,230,0.34),transparent)] md:block" aria-hidden />

                <motion.div
                  style={{ x: heroCardFarX, y: heroCardFarY }}
                  className="careers-mobile-image-overlay absolute left-3 top-3 hidden w-[min(16rem,calc(100%-1.5rem))] rounded-[18px] border border-white/18 bg-[#fff8e8]/14 p-3 text-[#fff8ec] shadow-[0_18px_46px_rgba(0,0,0,0.18)] backdrop-blur-xl will-change-transform sm:left-5 sm:top-5 sm:w-[17rem] sm:p-4 md:block"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[12px] border border-[#d6b45f]/35 bg-[#17120f]/42 text-[#f1d58d]">
                      <UsersRound className="h-[18px] w-[18px]" strokeWidth={1.8} />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[0.58rem] font-bold uppercase tracking-[0.18em] text-[#f1d58d]">
                        Live team
                      </span>
                      <span className="mt-1 block truncate text-sm font-semibold">Leadership sync active</span>
                    </span>
                  </div>
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <div className="flex -space-x-2">
                      {heroTeamSignals.map((signal, index) => (
                        <span
                          key={signal}
                          className="flex h-7 w-7 items-center justify-center rounded-full border border-white/24 bg-[#f8ead0] text-[10px] font-bold text-[#241a12] shadow-[0_8px_18px_rgba(0,0,0,0.16)]"
                          title={signal}
                          style={{ zIndex: heroTeamSignals.length - index }}
                        >
                          {signal.charAt(0)}
                        </span>
                      ))}
                    </div>
                    <span className="inline-flex items-center gap-2 text-[0.6rem] font-bold uppercase tracking-[0.16em] text-white/78">
                      <span className="careers-hero-live-dot h-1.5 w-1.5 rounded-full bg-[#f1d58d] shadow-[0_0_14px_rgba(241,213,141,0.7)]" />
                      Online
                    </span>
                  </div>
                </motion.div>

                <motion.div
                  style={{ x: heroCardNearX, y: heroCardNearY }}
                  className="absolute right-3 top-3 hidden w-[15.5rem] rounded-[18px] border border-white/16 bg-[#17120f]/54 p-4 text-[#fff8ec] shadow-[0_18px_52px_rgba(0,0,0,0.2)] backdrop-blur-xl will-change-transform md:right-5 md:top-5 lg:block"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span>
                      <span className="block text-[0.58rem] font-bold uppercase tracking-[0.18em] text-[#f1d58d]">
                        Executive dashboard
                      </span>
                      <span className="mt-1 block text-sm font-semibold">Operating signals</span>
                    </span>
                    <span className="flex h-9 w-9 items-center justify-center rounded-[12px] border border-white/14 bg-white/[0.07] text-[#f1d58d]">
                      <PanelTop className="h-[18px] w-[18px]" strokeWidth={1.75} />
                    </span>
                  </div>
                  <div className="mt-4 space-y-3">
                    {heroDashboardRows.map((row) => (
                      <div key={row.label}>
                        <div className="flex items-center justify-between text-[11px] font-semibold text-white/72">
                          <span>{row.label}</span>
                          <span>{row.value}</span>
                        </div>
                        <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/12">
                          <span
                            className="careers-hero-flow-line block h-full rounded-full bg-gradient-to-r from-[#8b1118] via-[#d6b45f] to-[#fff0b8]"
                            style={{ width: row.width }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>

                <motion.div
                  style={{ x: heroCardNearX, y: heroCardNearY }}
                  className="careers-mobile-image-overlay absolute bottom-4 right-4 hidden w-[22rem] rounded-[20px] border border-white/16 bg-[#fff8e8]/13 p-4 text-[#fff8ec] shadow-[0_22px_58px_rgba(0,0,0,0.22)] backdrop-blur-xl will-change-transform md:block"
                >
                  <div className="flex items-center justify-between gap-4">
                    <span>
                      <span className="block text-[0.58rem] font-bold uppercase tracking-[0.18em] text-[#f1d58d]">
                        Project activity
                      </span>
                      <span className="mt-1 block text-sm font-semibold">Enterprise workstreams</span>
                    </span>
                    <CheckCircle2 className="h-5 w-5 text-[#f1d58d]" strokeWidth={1.8} />
                  </div>
                  <div className="mt-4 grid gap-2">
                    {heroActivityCards.map(({ title, detail, status, Icon }) => (
                      <div key={title} className="grid grid-cols-[2rem_1fr_auto] items-center gap-3 rounded-[13px] border border-white/10 bg-white/[0.06] px-3 py-2.5">
                        <span className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[#17120f]/44 text-[#f1d58d]">
                          <Icon className="h-4 w-4" strokeWidth={1.8} />
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate text-[13px] font-semibold">{title}</span>
                          <span className="mt-0.5 block truncate text-[11px] font-medium text-white/56">{detail}</span>
                        </span>
                        <span className="rounded-full border border-[#d6b45f]/28 bg-[#d6b45f]/12 px-2.5 py-1 text-[0.56rem] font-bold uppercase tracking-[0.12em] text-[#f1d58d]">
                          {status}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>

                <AnimatedHeroMetricsGroup
                  dark
                  className="careers-mobile-image-overlay absolute inset-x-3 bottom-3 hidden grid-cols-3 gap-2 md:grid lg:hidden"
                  metricClassName="min-w-0 rounded-[15px] border border-white/18 bg-[#fff8e8]/18 px-2.5 py-2.5 text-[#fff8ec] backdrop-blur-xl"
                  valueClassName="min-w-[3.35rem] text-[22px] font-semibold leading-none md:text-[28px]"
                  labelClassName="mt-1 text-[0.52rem] font-bold uppercase leading-[1.25] tracking-[0.12em] text-[#f1d58d]"
                />
              </div>

              <div className="pointer-events-none absolute -bottom-3 left-6 right-6 h-px bg-gradient-to-r from-transparent via-[#8b1118]/18 to-transparent" aria-hidden />
            </div>
          </motion.div>
        </div>
      </section>

      <section className="px-5 py-12 md:px-8 md:py-16 lg:py-20">
        <div className="mx-auto max-w-[86rem]">
          <div data-careers-reveal className="max-w-[34rem]">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-[#8b1118]">Enterprise Culture</p>
            <h2 className="mt-4 font-display text-[24px] font-semibold leading-[1.04] tracking-[-0.04em] md:text-[30px] lg:text-[36px]">
              Why Ractysh
            </h2>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {whyCards.map(({ title, text, Icon }) => (
              <motion.article
                key={title}
                data-careers-reveal
                whileHover={{ y: -4 }}
                transition={{ duration: 0.34, ease }}
                className="group relative min-h-[15.5rem] rounded-[24px] border border-[#e1d5bf] bg-white/82 p-6 shadow-[0_22px_64px_rgba(75,52,24,0.07)] backdrop-blur-sm"
              >
                <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-[#d6b45f]/80 to-transparent" />
                <span className="flex h-11 w-11 items-center justify-center rounded-[15px] border border-[#d6b45f]/35 bg-[#fff7e5] text-[#9a7428] shadow-[0_12px_28px_rgba(96,74,35,0.08)] transition duration-300 group-hover:shadow-[0_0_26px_rgba(214,180,95,0.22)]">
                  <Icon className="h-5 w-5" strokeWidth={1.8} />
                </span>
                <h3 className="mt-8 font-display text-[18px] font-semibold tracking-[-0.03em] md:text-[22px]">{title}</h3>
                <p className="mt-3 text-[15px] leading-[1.7] text-[#625747]">{text}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section id="open-roles" className="px-5 py-12 md:px-8 md:py-16 lg:py-20">
        <div className="mx-auto max-w-[86rem]">
          <div data-careers-reveal className="flex flex-col gap-4 border-t border-[#d8c9aa] pt-10 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-[#8b1118]">Hiring</p>
              <h2 className="mt-4 font-display text-[24px] font-semibold leading-[1.04] tracking-[-0.04em] md:text-[30px] lg:text-[36px]">
                Open Opportunities
              </h2>
            </div>
            <p className="max-w-md text-[15px] leading-[1.7] text-[#625747]">
              Focused roles across product interfaces, design systems, operations and architectural visualization.
            </p>
          </div>

          <div className="mt-8 grid gap-3">
            {openRoles.map((role) => (
              <button
                key={role.title}
                type="button"
                data-careers-reveal
                onClick={() => openApplicationModal(role.title)}
                className="group flex cursor-pointer flex-col gap-4 rounded-[22px] border border-[#e0d2b8] bg-white/72 px-5 py-5 text-left shadow-[0_16px_44px_rgba(75,52,24,0.045)] transition duration-300 hover:translate-x-1 hover:border-[#d6b45f]/62 hover:bg-[#fffaf0] hover:shadow-[0_22px_58px_rgba(75,52,24,0.08),0_0_30px_rgba(214,180,95,0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d6b45f]/38 sm:flex-row sm:items-center sm:justify-between sm:px-7"
              >
                <span>
                  <span className="block font-display text-[18px] font-semibold tracking-[-0.03em] text-[#181512] md:text-[22px]">
                    {role.title}
                  </span>
                  <span className="mt-2 block text-sm font-medium text-[#7b7064]">{role.meta}</span>
                </span>
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#8b1118] transition duration-300 group-hover:translate-x-1">
                  Apply Now
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section
        id="life-at-ractysh"
        ref={lifeSectionRef}
        className="relative isolate scroll-mt-28 overflow-hidden px-5 py-12 md:px-8 md:py-10 lg:min-h-screen lg:py-0"
      >
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[#f7f0e2]" data-life-backdrop aria-hidden />
        <div
          data-life-grid
          className="pointer-events-none absolute inset-[-8%] -z-10 opacity-[0.14] will-change-transform [background-image:linear-gradient(rgba(139,17,24,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(80,60,34,0.09)_1px,transparent_1px)] [background-size:84px_84px]"
          aria-hidden
        />
        <div
          data-life-glow
          className="pointer-events-none absolute left-[42%] top-[16%] -z-10 h-[24rem] w-[24rem] rounded-full bg-[radial-gradient(circle,rgba(214,180,95,0.22),rgba(214,180,95,0.07)_42%,transparent_70%)] opacity-70 will-change-transform"
          aria-hidden
        />
        <div className="pointer-events-none absolute bottom-[10%] left-[6%] -z-10 h-[16rem] w-[16rem] rounded-full bg-[radial-gradient(circle,rgba(139,17,24,0.07),transparent_68%)]" aria-hidden />

        <div ref={lifePinRef} className="mx-auto flex min-h-[100svh] max-w-[86rem] items-start py-0 md:items-center md:py-10 lg:py-24">
          <div data-careers-reveal className="grid w-full items-center gap-4 md:gap-7 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
            <div className="relative flex flex-col justify-center lg:min-h-[42rem]">
              <div className="flex items-start justify-between gap-6">
                <div>
                  <p className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-[#8b1118]">
                    Life at Ractysh
                  </p>
                  <p className="mt-2 max-w-[24rem] text-[13px] leading-5 text-[#776b5b] md:mt-3 md:text-[14px] md:leading-6">
                    A calm operating culture moving through precision, intelligence, collaboration and modern craft.
                  </p>
                </div>

                <div className="hidden items-center gap-3 md:flex" aria-hidden>
                  <span className="font-display text-[18px] font-semibold text-[#8b1118]">
                    {String(activeLifeIndex + 1).padStart(2, "0")}
                  </span>
                  <span className="relative h-20 w-px overflow-visible rounded-full bg-[#d6b45f]/26">
                    <span
                      data-life-progress-fill
                      className="absolute left-0 top-0 h-full w-px origin-top scale-y-0 rounded-full bg-[#8b1118] shadow-[0_0_18px_rgba(214,180,95,0.42)]"
                    />
                    <span
                      data-life-progress-glow
                      className="absolute left-1/2 top-0 h-4 w-4 -translate-x-1/2 rounded-full bg-[#d6b45f]/20 blur-md"
                    />
                  </span>
                  <span className="font-display text-[18px] font-semibold text-[#b4a078]">
                    {String(lifeExperiences.length).padStart(2, "0")}
                  </span>
                </div>
              </div>

              <div className="relative mt-4 min-h-[12.5rem] md:mt-5 md:min-h-[21rem] lg:min-h-[23rem]">
                {lifeExperiences.map((experience, index) => (
                  <article
                    key={experience.title}
                    data-life-copy-panel
                    aria-hidden={activeLifeIndex !== index}
                    style={
                      shouldReduceMotion
                        ? {
                            opacity: activeLifeIndex === index ? 1 : 0,
                            visibility: activeLifeIndex === index ? "visible" : "hidden",
                            transform: "none"
                          }
                        : undefined
                    }
                    className="absolute inset-x-0 top-0 pl-0 opacity-0 will-change-[opacity,transform,filter] md:pl-3"
                  >
                    <p
                      data-life-copy-item
                      className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-[#9a7428]"
                    >
                      {experience.eyebrow}
                    </p>
                    <h2
                      data-life-copy-item
                      className="mt-4 max-w-[42rem] font-display text-[clamp(2rem,7vw,3rem)] font-semibold leading-[0.98] tracking-normal text-[#181512] md:mt-5 md:text-[52px] lg:text-[64px]"
                    >
                      {experience.title}
                    </h2>
                    <p
                      data-life-copy-item
                      className="mt-4 max-w-[35rem] text-[15px] leading-[1.65] text-[#625747] md:mt-6 md:text-[17px] md:leading-[1.8]"
                    >
                      {experience.body}
                    </p>
                    <div data-life-copy-item className="mt-6 hidden flex-wrap gap-2 sm:flex">
                      {experience.modules.map((module) => (
                        <span
                          key={module}
                          className="rounded-full border border-[#d6b45f]/28 bg-[#fff8e8]/66 px-3 py-1.5 text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-[#806224]"
                        >
                          {module}
                        </span>
                      ))}
                    </div>
                  </article>
                ))}
              </div>

              <div className="relative mt-7 hidden md:block" role="tablist" aria-label="Life at Ractysh culture themes">
                <motion.span
                  aria-hidden
                  animate={{ y: activeLifeIndex * 60 }}
                  transition={{ duration: shouldReduceMotion ? 0 : 0.82, ease }}
                  className="absolute left-0 top-0 h-12 w-full rounded-[16px] border border-[#d6b45f]/28 bg-[#fff8e8]/72 shadow-[0_18px_42px_rgba(89,62,28,0.07)]"
                />
                <div className="relative flex flex-col gap-3">
                  {lifeExperiences.map((experience, index) => {
                    const isActive = index === activeLifeIndex;

                    return (
                      <button
                        key={experience.title}
                        type="button"
                        data-life-menu-button
                        role="tab"
                        aria-selected={isActive}
                        onClick={() => scrollToLifeExperience(index)}
                        className={cn(
                          "group grid h-12 grid-cols-[2rem_1fr] items-center gap-3 rounded-[16px] px-2 text-left transition duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d6b45f]/35",
                          isActive ? "text-[#181512]" : "text-[#7b7064] hover:text-[#2f261f]"
                        )}
                      >
                        <span className="relative flex h-10 w-2 items-center justify-center">
                          <span className="absolute h-10 w-px bg-[#d6b45f]/24" />
                          <span
                            data-life-menu-line
                            className="absolute h-10 w-px origin-top bg-[#8b1118] shadow-[0_0_18px_rgba(214,180,95,0.42)]"
                          />
                          <span
                            data-life-menu-dot
                            className={cn(
                              "relative h-2 w-2 rounded-full border transition duration-500",
                              isActive
                                ? "border-[#8b1118] bg-[#8b1118] shadow-[0_0_18px_rgba(214,180,95,0.52)]"
                                : "border-[#d6b45f]/46 bg-[#fff8e8]"
                            )}
                          />
                        </span>
                        <span className="truncate text-[13px] font-semibold uppercase tracking-[0.16em]">
                          {experience.title}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="relative mx-auto h-[clamp(320px,44svh,380px)] w-full min-h-0 md:h-auto md:min-h-[34rem] lg:min-h-[42rem]">
              <div className="pointer-events-none absolute -right-6 top-10 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(214,180,95,0.16),transparent_68%)]" aria-hidden />
              <LifeStoryVisual activeIndex={activeLifeIndex} />
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-12 md:px-8 md:py-16 lg:py-20">
        <div className="mx-auto max-w-[86rem]">
          <div
            ref={processJourneyRef}
            data-careers-reveal
            className="hiring-journey relative isolate overflow-hidden rounded-[30px] border border-[#ddcfb6] px-5 py-12 shadow-[0_28px_90px_rgba(88,58,22,0.09)] md:px-8 lg:px-10 lg:py-14"
          >
            <div className="hiring-journey-grid absolute inset-0" aria-hidden />
            <div className="hiring-journey-glow absolute inset-0" data-hiring-depth="soft" aria-hidden />
            <div className="hiring-journey-flow-bg absolute inset-0" data-hiring-depth="near" aria-hidden />
            <div className="hiring-journey-particles absolute inset-0" aria-hidden>
              {Array.from({ length: 9 }).map((_, index) => (
                <span
                  key={index}
                  className="hiring-journey-particle"
                  style={
                    {
                      "--particle-left": `${12 + ((index * 11) % 78)}%`,
                      "--particle-top": `${16 + ((index * 17) % 68)}%`,
                      "--particle-delay": `${index * -0.55}s`
                    } as React.CSSProperties
                  }
                />
              ))}
            </div>

            <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-[42rem]">
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-[#8b1118]">
                  Application Process
                </p>
                <h2 className="mt-4 font-display text-[25px] font-semibold leading-[1.04] tracking-[-0.04em] text-[#181512] md:text-[32px] lg:text-[40px]">
                  A cinematic hiring journey into the Ractysh ecosystem.
                </h2>
              </div>

              <div className="hiring-active-panel w-full max-w-[24rem] rounded-[18px] border border-[#d6b45f]/28 bg-[#fffaf0]/70 p-4 shadow-[0_18px_48px_rgba(80,52,24,0.07)]">
                <p className="text-[0.62rem] font-bold uppercase tracking-[0.2em] text-[#9a7428]">
                  Active workflow stage
                </p>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={processSteps[activeProcessStep].title}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.55, ease }}
                    className="mt-3"
                  >
                    <p className="font-display text-[20px] font-semibold tracking-[-0.03em] text-[#181512]">
                      {processSteps[activeProcessStep].title}
                    </p>
                    <p className="mt-1 text-[13px] leading-6 text-[#6f6252]">
                      {processSteps[activeProcessStep].description}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            <div className="hiring-workflow relative z-10 mt-12 md:mt-14">
              <div className="hiring-flow-line hidden md:block" aria-hidden>
                <span className="hiring-flow-track" />
                <span ref={processLineRef} className="hiring-flow-scroll-fill" />
                <span
                  className="hiring-flow-active-fill"
                  style={{ transform: `scaleX(${(activeProcessStep + 1) / processSteps.length})` }}
                />
                <span className="hiring-flow-energy" />
              </div>
              <div className="hiring-flow-line-mobile md:hidden" aria-hidden>
                <span className="hiring-flow-track" />
                <span
                  className="hiring-flow-active-fill"
                  style={{ transform: `scaleY(${(activeProcessStep + 1) / processSteps.length})` }}
                />
                <span className="hiring-flow-energy" />
              </div>

              <div className="grid gap-4 md:grid-cols-5 md:gap-5">
                {processSteps.map((step, index) => {
                  const state =
                    index === activeProcessStep ? "active" : index < activeProcessStep ? "complete" : "upcoming";

                  return (
                    <motion.article
                      key={step.title}
                      className={cn("hiring-step-card group", {
                        "is-active": state === "active",
                        "is-complete": state === "complete",
                        "is-upcoming": state === "upcoming"
                      })}
                      animate={{
                        opacity: state === "active" ? 1 : state === "complete" ? 0.82 : 0.56,
                        scale: state === "active" ? 1 : state === "complete" ? 0.98 : 0.94,
                        y: state === "active" ? 0 : state === "complete" ? 4 : 10
                      }}
                      whileHover={{ y: -7, scale: 1 }}
                      transition={{ duration: 0.8, ease }}
                    >
                      <span className="hiring-step-reflection" aria-hidden />
                      <div className="flex items-start gap-4 md:block">
                        <span className="hiring-step-orb">
                          <span>{String(index + 1).padStart(2, "0")}</span>
                        </span>
                        <div className="min-w-0 md:mt-7">
                          <p className="text-[0.62rem] font-bold uppercase tracking-[0.2em] text-[#9a7428]">
                            Stage {String(index + 1).padStart(2, "0")}
                          </p>
                          <h3 className="mt-2 font-display text-[18px] font-semibold tracking-[-0.03em] text-[#181512] md:text-[20px]">
                            {step.title}
                          </h3>
                          <p className="mt-2 text-[13px] leading-6 text-[#6f6252]">{step.description}</p>
                        </div>
                      </div>
                    </motion.article>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative isolate px-5 py-12 md:px-8 md:py-16 lg:py-20">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_44%,rgba(214,180,95,0.24),transparent_36%)]" />
        <div data-careers-reveal className="mx-auto max-w-[38rem] text-center">
          <h2 className="font-display text-[24px] font-semibold leading-[1.04] tracking-[-0.04em] md:text-[30px] lg:text-[36px]">
            Shape the next generation of enterprise systems.
          </h2>
          <div className="mt-8">
            <ApplyLink onClick={() => openApplicationModal("General Application")}>Apply Today</ApplyLink>
          </div>
        </div>
      </section>

      <CareerApplicationModal
        isOpen={Boolean(applicationRole)}
        roleTitle={applicationRole ?? "General Application"}
        onClose={closeApplicationModal}
      />
    </div>
  );
}
