"use client";

import { useEffect, useRef, type MouseEvent } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Activity,
  Building2,
  Clock3,
  DraftingCompass,
  Globe2,
  Layers3,
  LockKeyhole,
  ServerCog,
  ShieldCheck,
  type LucideIcon
} from "lucide-react";
import { useLenis } from "@/components/providers/SmoothScrollProvider";

gsap.registerPlugin(ScrollTrigger);

interface AchievementMilestone {
  year: string;
  title: string;
  description: string;
  signal: string;
  Icon: LucideIcon;
}

const securityFeatures = [
  {
    title: "Secure",
    description:
      "Enterprise-grade protection for trade operations, construction planning and business workflows.",
    Icon: LockKeyhole
  },
  {
    title: "Resilient",
    description: "Architected for scalable enterprise systems, reliable project execution and uninterrupted operational continuity.",
    Icon: ServerCog
  },
  {
    title: "Always Available",
    description: "Built with highly available systems and enterprise-level redundancy for modern business ecosystems.",
    Icon: Clock3
  }
];

const achievementMilestones: AchievementMilestone[] = [
  {
    year: "2021",
    title: "Enterprise Foundation",
    description: "Established the operating base for structured governance, private client control and ecosystem readiness.",
    signal: "Foundation live",
    Icon: ShieldCheck
  },
  {
    year: "2022",
    title: "Design Intelligence Expansion",
    description: "Expanded architecture, interiors and visualization workflows into an integrated design intelligence layer.",
    signal: "Design layer",
    Icon: DraftingCompass
  },
  {
    year: "2023",
    title: "Construction Execution Layer",
    description: "Connected project coordination, construction control and delivery governance into a resilient execution rail.",
    signal: "Build control",
    Icon: Building2
  },
  {
    year: "2024",
    title: "Real Estate and Export-Import Operations",
    description: "Advanced asset positioning, trade coordination and monitored shipment pathways for secure enterprise movement.",
    signal: "Trade rail",
    Icon: Globe2
  },
  {
    year: "2025",
    title: "Five-Pillar Enterprise Ecosystem",
    description: "Unified Architecture, Construction, Real Estate, Export & Import and OTC Exchange into one operational growth system.",
    signal: "Unified OS",
    Icon: Layers3
  }
];

export function SecuritySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const lenis = useLenis();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const timelineX = useSpring(mouseX, { stiffness: 78, damping: 30, mass: 0.8 });
  const timelineY = useSpring(mouseY, { stiffness: 78, damping: 30, mass: 0.8 });
  const timelineRotateX = useTransform(timelineY, (value) => value * -0.045);
  const timelineRotateY = useTransform(timelineX, (value) => value * 0.055);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const context = gsap.context(() => {
      const heading = gsap.utils.toArray<HTMLElement>("[data-security-heading]", section);
      const cards = gsap.utils.toArray<HTMLElement>("[data-security-card]", section);
      const ambient = gsap.utils.toArray<HTMLElement>("[data-security-ambient]", section);
      const achievementItems = gsap.utils.toArray<HTMLElement>("[data-achievement-item]", section);
      const achievementCards = gsap.utils.toArray<HTMLElement>("[data-achievement-card]", section);
      const achievementDepth = gsap.utils.toArray<HTMLElement>("[data-achievement-depth]", section);
      const achievementNodes = gsap.utils.toArray<HTMLElement>("[data-achievement-node]", section);
      const achievementNodeFills = gsap.utils.toArray<HTMLElement>("[data-achievement-node-fill]", section);
      const achievementNodePulses = gsap.utils.toArray<HTMLElement>("[data-achievement-node-pulse]", section);
      const achievementYears = gsap.utils.toArray<HTMLElement>("[data-achievement-year]", section);
      const achievementGlows = gsap.utils.toArray<HTMLElement>("[data-achievement-card-glow]", section);
      const achievementLine = section.querySelector<HTMLElement>("[data-achievement-line-fill]");
      let activePulse: gsap.core.Tween | null = null;

      const activateAchievement = (activeIndex: number) => {
        activePulse?.kill();
        activePulse = null;

        gsap.to(achievementCards, {
          opacity: (index) => (index === activeIndex ? 1 : index < activeIndex ? 0.9 : 0.72),
          scale: (index) => (index === activeIndex ? 1.018 : 0.98),
          y: (index) => (index === activeIndex ? -2 : 0),
          duration: 0.72,
          ease: "power3.out"
        });

        gsap.to(achievementNodes, {
          opacity: (index) => (index <= activeIndex ? 1 : 0.5),
          scale: (index) => (index === activeIndex ? 1.18 : index < activeIndex ? 1 : 0.9),
          duration: 0.65,
          ease: "power3.out"
        });

        gsap.to(achievementNodeFills, {
          opacity: (index) => (index <= activeIndex ? 1 : 0),
          scale: (index) => (index === activeIndex ? 1 : 0.78),
          duration: 0.65,
          ease: "power3.out"
        });

        gsap.to(achievementYears, {
          opacity: (index) => (index <= activeIndex ? 1 : 0.72),
          scale: (index) => (index === activeIndex ? 1.08 : 1),
          duration: 0.65,
          ease: "power3.out"
        });

        gsap.to(achievementGlows, {
          opacity: (index) => (index === activeIndex ? 1 : 0),
          scale: (index) => (index === activeIndex ? 1 : 0.96),
          duration: 0.78,
          ease: "power3.out"
        });

        gsap.set(achievementNodePulses, { opacity: 0, scale: 0.8 });
        const pulse = achievementNodePulses[activeIndex];
        if (pulse) {
          activePulse = gsap.fromTo(
            pulse,
            { opacity: 0.25, scale: 0.82 },
            { opacity: 0, scale: 2.3, duration: 2.1, repeat: -1, ease: "power2.out" }
          );
        }
      };

      if (shouldReduceMotion) {
        gsap.set([...heading, ...cards, ...achievementCards], { opacity: 1, y: 0, scale: 1 });
        gsap.set([...achievementNodes, ...achievementNodeFills, ...achievementYears], { opacity: 1, scale: 1 });
        gsap.set(achievementGlows, { opacity: 0.2, scale: 1 });
        gsap.set(achievementLine, { scaleY: 1 });
        return;
      }

      gsap.set(heading, { opacity: 0, y: 40, force3D: true });
      gsap.set(cards, { opacity: 1, y: 0, force3D: true });
      gsap.set(ambient, { opacity: 0.9, force3D: true });
      gsap.set(achievementCards, {
        opacity: 0,
        y: 60,
        scale: 0.98,
        transformOrigin: "50% 70%",
        force3D: true
      });
      gsap.set(achievementDepth, { y: 0, transformOrigin: "50% 50%", force3D: true });
      gsap.set(achievementNodes, { opacity: 0.5, scale: 0.9, transformOrigin: "50% 50%", force3D: true });
      gsap.set(achievementNodeFills, { opacity: 0, scale: 0.78, transformOrigin: "50% 50%", force3D: true });
      gsap.set(achievementYears, { opacity: 0.54, scale: 1, transformOrigin: "0% 50%", force3D: true });
      gsap.set(achievementGlows, { opacity: 0, scale: 0.96, transformOrigin: "50% 50%", force3D: true });
      gsap.set(achievementLine, { scaleY: 0, transformOrigin: "top center", force3D: true });

      gsap
        .timeline({
          scrollTrigger: {
            trigger: section,
            start: "top 72%",
            once: true
          }
        })
        .to(heading, {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.1,
          ease: "power4.out"
        })
        .to(
          achievementCards,
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1,
            stagger: 0.12,
            ease: "power4.out"
          },
          "-=0.58"
        )
        .call(() => activateAchievement(0));

      if (achievementLine) {
        gsap.to(achievementLine, {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: section.querySelector("[data-achievement-track]") || section,
            start: "top 70%",
            end: "bottom 60%",
            scrub: 1.15
          }
        });
      }

      achievementItems.forEach((item, index) => {
        ScrollTrigger.create({
          trigger: item,
          start: "top 62%",
          end: "bottom 54%",
          onEnter: () => activateAchievement(index),
          onEnterBack: () => activateAchievement(index)
        });
      });

      achievementDepth.forEach((layer, index) => {
        gsap.to(layer, {
          y: index % 2 === 0 ? -14 : -8,
          ease: "none",
          scrollTrigger: {
            trigger: layer,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.2
          }
        });
      });

      ambient.forEach((layer, index) => {
        gsap.to(layer, {
          yPercent: index % 2 === 0 ? -7 : 5,
          xPercent: index % 2 === 0 ? 2 : -2,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.1
          }
        });
      });

    }, section);

    const refreshId = requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      cancelAnimationFrame(refreshId);
      context.revert();
    };
  }, [shouldReduceMotion, lenis]);

  const handleMouseMove = (event: MouseEvent<HTMLElement>) => {
    if (shouldReduceMotion) return;

    const section = sectionRef.current;
    if (!section) return;

    const rect = section.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    mouseX.set(x * 10);
    mouseY.set(y * 8);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <section
      ref={sectionRef}
      id="security"
      className="relative isolate overflow-hidden bg-[linear-gradient(180deg,rgba(248,246,241,0)_0%,rgba(255,252,247,0.72)_44%,rgba(245,242,235,0)_100%)] px-5 py-[72px] text-[#1f1b16] md:px-8 md:py-[88px]"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div
        data-security-ambient
        className="pointer-events-none absolute inset-0 opacity-[0.2] [background-image:linear-gradient(rgba(92,73,36,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(92,73,36,0.1)_1px,transparent_1px)] [background-size:58px_58px]"
      />
      <div
        data-security-ambient
        className="pointer-events-none absolute left-1/2 top-10 h-[34rem] w-[72rem] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.16)_0%,rgba(255,252,247,0.22)_42%,transparent_72%)]"
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-[linear-gradient(180deg,rgba(248,246,241,0.82),transparent)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-[linear-gradient(180deg,transparent,rgba(248,246,241,0.78))]" />

      <div className="relative z-10 mx-auto max-w-[1180px]">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(390px,0.72fr)] lg:items-start lg:gap-12">
          <div className="lg:sticky lg:top-28">
            <div>
              <p
                data-security-heading
                className="text-[0.76rem] font-semibold uppercase tracking-[0.22em] text-[#9a7429]"
              >
                Enterprise Security & Reliability
              </p>
              <h2
                data-security-heading
                className="mt-5 max-w-[760px] font-display text-[clamp(34px,4vw,56px)] font-[650] leading-[0.98] tracking-[0] text-[#201b15]"
              >
                Enterprise Security Built for the Ractysh Ecosystem
              </h2>
              <p
                data-security-heading
                className="mt-6 max-w-[560px] text-[0.96rem] leading-7 text-[#625c53]"
              >
                Controlled access, resilient execution layers and monitored availability sit directly behind the ecosystem,
                so enterprise operations feel precise, visible and dependable.
              </p>
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-3 lg:grid-cols-1">
              {securityFeatures.map((feature, index) => (
                <article
                  key={feature.title}
                  data-security-card
                  className="group relative min-h-[230px] overflow-hidden rounded-[14px] border border-[rgba(212,175,55,0.14)] bg-[rgba(255,255,255,0.72)] p-6 text-[#211914] shadow-[0_22px_58px_rgba(62,47,25,0.075),inset_0_1px_0_rgba(255,255,255,0.78)] transition-transform duration-[350ms] ease-out will-change-[opacity,transform] hover:-translate-y-1.5 md:p-7 lg:min-h-[178px]"
                >
                  <div className="pointer-events-none absolute inset-0 opacity-0 shadow-[0_34px_84px_rgba(75,54,22,0.14),0_0_42px_rgba(212,175,55,0.16),inset_0_1px_0_rgba(255,255,255,0.92)] transition-opacity duration-[350ms] ease-out group-hover:opacity-100" />
                  <div className="pointer-events-none absolute inset-0 opacity-0 bg-[radial-gradient(circle_at_80%_0%,rgba(212,175,55,0.16),transparent_38%)] transition-opacity duration-[350ms] ease-out group-hover:opacity-100" />
                  <div className="absolute inset-x-6 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(212,175,55,0.54),transparent)] opacity-60" />
                  <div className="pointer-events-none absolute right-0 top-0 h-20 w-28 border-b border-l border-[#d4af37]/10" />

                  <div className="relative z-10 flex items-start justify-between gap-5">
                    <div className="flex h-11 w-11 items-center justify-center rounded-[9px] border border-[#d4af37]/18 bg-[#fffaf0] text-[#9c7429] shadow-[0_12px_26px_rgba(74,54,23,0.06)] transition-transform duration-[350ms] ease-out group-hover:translate-x-1 group-hover:-rotate-2">
                      <feature.Icon className="h-5 w-5" strokeWidth={1.8} />
                    </div>
                    <span className="text-[0.72rem] font-semibold text-[#9b8f78]">0{index + 1}</span>
                  </div>

                  <h3 className="relative z-10 mt-8 font-display text-[1.45rem] font-semibold leading-none tracking-[0] text-[#211914] lg:mt-6">
                    {feature.title}
                  </h3>
                  <p className="relative z-10 mt-4 max-w-[20rem] text-[0.9rem] leading-6 text-[#665e54]">
                    {feature.description}
                  </p>

                  <div className="relative z-10 mt-7 flex items-center gap-2 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[#9a7429]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#c6a45b] shadow-[0_0_14px_rgba(198,164,91,0.32)]" />
                    Operational layer
                  </div>
                </article>
              ))}
            </div>
          </div>

          <motion.aside
            data-achievement-track
            className="security-achievement-panel security-achievement-gpu relative overflow-hidden rounded-[22px] border p-5 text-[#fff8ec] md:p-6 lg:min-h-[760px]"
            style={{
              x: timelineX,
              y: timelineY,
              rotateX: timelineRotateX,
              rotateY: timelineRotateY,
              transformPerspective: 1200,
              transformStyle: "preserve-3d"
            }}
          >
            <div className="security-achievement-grid pointer-events-none absolute inset-0 opacity-35" />
            <div className="security-achievement-ambient pointer-events-none absolute -right-20 top-4 h-72 w-72 rounded-full bg-[radial-gradient(circle_at_center,rgba(214,180,95,0.24),rgba(246,241,232,0.08)_42%,transparent_70%)]" />
            <div className="security-achievement-ambient pointer-events-none absolute -left-24 bottom-0 h-80 w-80 rounded-full bg-[radial-gradient(circle_at_center,rgba(139,17,24,0.12),rgba(214,180,95,0.08)_44%,transparent_72%)]" />
            <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(214,180,95,0.72),rgba(255,248,236,0.44),transparent)]" />

            <div className="relative z-10">
              <div className="flex items-start justify-between gap-5">
                <div>
                  <p className="inline-flex items-center gap-2 text-[0.66rem] font-semibold uppercase tracking-[0.2em] text-[#d8bd79]">
                    <span className="security-achievement-pulse relative h-1.5 w-1.5 rounded-full bg-[#d6b45f]" />
                    Ecosystem achievements
                  </p>
                  <h3 className="mt-4 max-w-[24rem] font-display text-[26px] font-semibold leading-[1.04] tracking-[0] text-[#fff4dd] md:text-[32px]">
                    Operational Growth Timeline
                  </h3>
                </div>
                <div className="security-achievement-header-icon flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] border text-[#f1d98d]">
                  <Activity className="h-5 w-5" strokeWidth={1.8} />
                </div>
              </div>

              <div className="relative mt-8">
                <div className="security-achievement-line pointer-events-none absolute bottom-4 left-[1.15rem] top-4 w-px overflow-hidden">
                  <span
                    data-achievement-line-fill
                    className="security-achievement-line-fill absolute inset-x-0 top-0 h-full origin-top"
                  />
                  <span className="security-achievement-line-flow absolute inset-x-[-2px] top-0 h-14 bg-[linear-gradient(180deg,transparent,rgba(255,246,216,0.8),transparent)]" />
                </div>

                <div className="space-y-6">
                  {achievementMilestones.map((milestone) => (
                    <div
                      key={milestone.year}
                      data-achievement-item
                      className="relative grid grid-cols-[2.3rem_minmax(0,1fr)] gap-4"
                    >
                      <div className="pt-3">
                        <div
                          data-achievement-node
                          className="security-achievement-node security-achievement-gpu relative flex h-9 w-9 items-center justify-center rounded-full border text-[0.62rem] font-semibold"
                        >
                          <span
                            data-achievement-node-pulse
                            className="pointer-events-none absolute inset-0 rounded-full bg-[#d6b45f]"
                          />
                          <span
                            data-achievement-node-fill
                            className="pointer-events-none absolute inset-0 rounded-full bg-[#d6b45f] shadow-[0_0_0_8px_rgba(214,180,95,0.1),0_0_30px_rgba(214,180,95,0.34)]"
                          />
                          <span className="relative z-10 text-[#fff7e8]">
                            {milestone.year.slice(2)}
                          </span>
                        </div>
                      </div>

                      <div data-achievement-depth className="security-achievement-gpu">
                        <article
                          data-achievement-card
                          className="security-achievement-card security-achievement-gpu group relative overflow-hidden rounded-[16px] border p-5 md:p-6"
                        >
                          <div
                            data-achievement-card-glow
                            className="security-achievement-card-glow pointer-events-none absolute inset-0 opacity-0"
                          />
                          <div className="security-achievement-scan pointer-events-none absolute inset-y-0 left-[-45%] w-[38%] bg-[linear-gradient(90deg,transparent,rgba(255,248,236,0.12),transparent)] opacity-0" />
                          <div className="relative z-10 flex items-start justify-between gap-5">
                            <div>
                              <p
                                data-achievement-year
                                className="security-achievement-year-text inline-block text-[1.72rem] font-medium leading-none tracking-[0]"
                              >
                                {milestone.year}
                              </p>
                              <h4 className="security-achievement-card-title mt-3 font-display text-[1.12rem] font-semibold leading-tight tracking-[0]">
                                {milestone.title}
                              </h4>
                            </div>
                            <span className="security-achievement-card-icon security-achievement-gpu flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] border text-[#f1d98d] transition-transform duration-[350ms] ease-out group-hover:translate-x-1 group-hover:-rotate-2">
                              <milestone.Icon className="h-[18px] w-[18px]" strokeWidth={1.8} />
                            </span>
                          </div>
                          <p className="security-achievement-card-description relative z-10 mt-4 text-[0.91rem] leading-[1.72]">
                            {milestone.description}
                          </p>
                          <div className="security-achievement-card-footer relative z-10 mt-5 flex items-center justify-between gap-4 border-t pt-4">
                            <span className="security-achievement-signal text-[0.62rem] font-semibold uppercase tracking-[0.18em]">
                              {milestone.signal}
                            </span>
                            <span className="h-1.5 w-8 rounded-full bg-[linear-gradient(90deg,rgba(214,180,95,0.16),rgba(241,217,141,0.82))]" />
                          </div>
                        </article>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.aside>
        </div>
      </div>
    </section>
  );
}
