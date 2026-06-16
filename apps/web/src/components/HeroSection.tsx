"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Division, HeroContent } from "@/lib/types";
import { BackgroundPattern } from "@/components/BackgroundPattern";
import { DashboardPreview } from "@/components/DashboardPreview";
import { FloatingCards } from "@/components/FloatingCards";
import { HeroHeading } from "@/components/HeroHeading";

gsap.registerPlugin(ScrollTrigger);

interface HeroSectionProps {
  hero: HeroContent;
  divisions: Division[];
}

export function HeroSection({ hero, divisions }: HeroSectionProps) {
  const rootRef = useRef<HTMLElement>(null);
  const dashboardEntranceCompleteRef = useRef(false);
  const dashboardFloatAllowedRef = useRef(false);
  const dashboardFloatTimerRef = useRef<number | null>(null);
  const heroTypingCompleteRef = useRef(false);
  const [heroCopyReady, setHeroCopyReady] = useState(true);
  const [dashboardFloatReady, setDashboardFloatReady] = useState(false);

  const clearDashboardFloatTimer = useCallback(() => {
    if (dashboardFloatTimerRef.current !== null) {
      window.clearTimeout(dashboardFloatTimerRef.current);
      dashboardFloatTimerRef.current = null;
    }
  }, []);

  const scheduleDashboardFloat = useCallback(() => {
    if (
      !dashboardFloatAllowedRef.current ||
      !dashboardEntranceCompleteRef.current ||
      !heroTypingCompleteRef.current ||
      dashboardFloatTimerRef.current !== null
    ) {
      return;
    }

    dashboardFloatTimerRef.current = window.setTimeout(() => {
      setDashboardFloatReady(true);
      dashboardFloatTimerRef.current = null;
    }, 500);
  }, []);

  const handleHeroTypingComplete = useCallback(() => {
    heroTypingCompleteRef.current = true;
    scheduleDashboardFloat();
  }, [scheduleDashboardFloat]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    setHeroCopyReady(true);
    setDashboardFloatReady(false);
    clearDashboardFloatTimer();
    dashboardEntranceCompleteRef.current = false;
    dashboardFloatAllowedRef.current = false;
    heroTypingCompleteRef.current = false;
    let isActive = true;

    const context = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>("[data-floating-stack-card]");
      const slotCards = gsap.utils.toArray<HTMLElement>("[data-dashboard-slot-card]");
      const placeholders = gsap.utils.toArray<HTMLElement>("[data-dashboard-placeholder]");
      const [leftCard, middleCard, primaryCard] = cards;
      const isMobile = window.matchMedia("(max-width: 767px)").matches;
      const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      dashboardFloatAllowedRef.current = isDesktop && !reduceMotion;

      if (isMobile) {
        const mobileControlCards = gsap.utils.toArray<HTMLElement>("[data-mobile-control-card]");

        gsap.set(cards, { autoAlpha: 0 });
        gsap.set(placeholders, { opacity: 0 });
        gsap.set(slotCards, { opacity: 1, y: 0 });
        gsap.set("[data-main-dashboard]", { opacity: 0, y: 18, scale: 0.992, transformOrigin: "50% 62%" });
        gsap.set(mobileControlCards, { opacity: 0, y: 8 });

        gsap
          .timeline({
            delay: 0.18,
            defaults: { ease: "power3.out" },
            onComplete: () => {
              if (isActive) {
                dashboardEntranceCompleteRef.current = true;
                scheduleDashboardFloat();
              }
            }
          })
          .to("[data-main-dashboard]", {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.72
          })
          .to(
            mobileControlCards,
            {
              opacity: 1,
              y: 0,
              duration: 0.42,
              stagger: 0.055
            },
            "-=0.38"
          );

        return;
      }

      gsap.set("[data-main-dashboard]", { opacity: 0, y: 78, scale: 0.98, transformOrigin: "50% 70%" });
      gsap.set(slotCards, { opacity: 0, y: 10 });
      gsap.set(placeholders, { opacity: 1 });
      gsap.set(cards, {
        opacity: 0,
        xPercent: -50,
        left: "50%",
        top: "0rem",
        y: 40,
        scale: 0.92,
        rotate: 0,
        transformOrigin: "50% 55%",
        force3D: true
      });

      gsap.set(primaryCard, { zIndex: 30 });
      gsap.set(middleCard, { zIndex: 20 });
      gsap.set(leftCard, { zIndex: 10 });

      const timeline = gsap.timeline({
        delay: 0.15,
        defaults: { ease: "power4.out" },
        onComplete: () => {
          if (isActive) {
            dashboardEntranceCompleteRef.current = true;
            setHeroCopyReady(true);
            scheduleDashboardFloat();
          }
        }
      });

      timeline
        // STEP 1: the privacy program card appears before the message lands.
        .to(primaryCard, {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.82,
          ease: "power4.out"
        })
        // Preserve the original dashboard cadence while the hero copy stays hidden.
        .to({}, { duration: 0.98 })
        // STEP 2: the other two programs join the stack.
        .to(
          middleCard,
          {
            opacity: 0.94,
            scale: 0.97,
            x: -30,
            y: 20,
            rotate: -4,
            duration: 0.82,
            ease: "power4.out"
          },
          "-=0.14"
        )
        .fromTo(
          leftCard,
          {
            x: -190,
            y: 36,
            rotate: -10,
            scale: 0.94,
            opacity: 0
          },
          {
            x: -86,
            y: 28,
            rotate: -8,
            scale: 0.95,
            opacity: 0.92,
            duration: 0.9,
            ease: "power4.out"
          },
          "-=0.38"
        )
        // STEP 3: the stack spreads horizontally and rotations settle.
        .to(
          primaryCard,
          {
            x: 226,
            y: 28,
            rotate: 0.3,
            scale: 0.96,
            opacity: 1,
            duration: 1.08,
            ease: "power4.inOut"
          },
          "+=0.04"
        )
        .to(
          middleCard,
          {
            x: 8,
            y: 46,
            rotate: -1.2,
            scale: 0.94,
            opacity: 0.96,
            duration: 1.08,
            ease: "power4.inOut"
          },
          "<"
        )
        .to(
          leftCard,
          {
            x: -210,
            y: 64,
            rotate: -3.8,
            scale: 0.92,
            opacity: 0.93,
            duration: 1.08,
            ease: "power4.inOut"
          },
          "<"
        )
        // STEP 4: the dashboard rises and absorbs the cards visually.
        .to(
          "[data-main-dashboard]",
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1.18,
            ease: "power4.out"
          },
          "-=0.28"
        )
        .to(
          primaryCard,
          { x: 283, y: 103, rotate: 0, scale: 0.72, height: "21.45rem", opacity: 1, duration: 0.82, ease: "power3.inOut" },
          "-=0.7"
        )
        .to(
          middleCard,
          { x: 28, y: 105, rotate: 0, scale: 0.72, height: "21.45rem", opacity: 1, duration: 0.82, ease: "power3.inOut" },
          "<"
        )
        .to(
          leftCard,
          { x: -227, y: 102, rotate: 0, scale: 0.72, height: "21.45rem", opacity: 1, duration: 0.82, ease: "power3.inOut" },
          "<"
        )
        .to(cards, { opacity: 0, duration: 0.24, ease: "power2.out" }, "+=0.02")
        .to(placeholders, { opacity: 0, duration: 0.18, ease: "power2.out" }, "<")
        .to(slotCards, { opacity: 1, y: 0, duration: 0.34, stagger: 0.05, ease: "power2.out" }, "-=0.02");

      const setCardStageX = gsap.quickTo("[data-card-stage]", "x", { duration: 1.1, ease: "power3.out" });
      const setCardStageY = gsap.quickTo("[data-card-stage]", "y", { duration: 1.1, ease: "power3.out" });
      const setCardStageRotateY = gsap.quickTo("[data-card-stage]", "rotateY", { duration: 1.1, ease: "power3.out" });
      const setCardStageRotateX = gsap.quickTo("[data-card-stage]", "rotateX", { duration: 1.1, ease: "power3.out" });
      const setDashboardX = gsap.quickTo("[data-main-dashboard]", "x", { duration: 1.2, ease: "power3.out" });

      const onPointerMove = (event: PointerEvent) => {
        const rect = root.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;

        setCardStageX(x * 14);
        setCardStageY(y * 8);
        setCardStageRotateY(x * 2.6);
        setCardStageRotateX(-y * 2);
        setDashboardX(x * 7);
      };

      root.addEventListener("pointermove", onPointerMove);
      return () => root.removeEventListener("pointermove", onPointerMove);
    }, root);

    return () => {
      isActive = false;
      clearDashboardFloatTimer();
      context.revert();
    };
  }, [clearDashboardFloatTimer, scheduleDashboardFloat]);

  return (
    <section
      ref={rootRef}
      id="hero"
      className="relative min-h-[max(57rem,calc(100svh+5rem))] overflow-hidden px-5 pb-16 pt-28 md:min-h-[max(64rem,calc(100svh+5rem))] md:px-8 md:pt-[8.25rem]"
    >
      <BackgroundPattern />
      <div className="relative z-10 mx-auto max-w-[80rem]">
        <HeroHeading hero={hero} isReady={heroCopyReady} onTypingComplete={handleHeroTypingComplete} />
        <FloatingCards divisions={divisions} />
        <DashboardPreview divisions={divisions} enableDesktopFloat={dashboardFloatReady} />
      </div>
    </section>
  );
}
