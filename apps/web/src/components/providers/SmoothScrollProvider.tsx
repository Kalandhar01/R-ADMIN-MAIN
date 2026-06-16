"use client";

import type Lenis from "lenis";
import { createContext, type ReactNode, useContext, useEffect, useMemo, useState } from "react";

interface SmoothScrollProviderProps {
  children: ReactNode;
}

const SmoothScrollContext = createContext<Lenis | null>(null);

export function useLenis() {
  return useContext(SmoothScrollContext);
}

export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  const [lenisInstance, setLenisInstance] = useState<Lenis | null>(null);

  useEffect(() => {
    const touchViewport = window.matchMedia("(hover: none), (pointer: coarse), (max-width: 767px)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const shouldUseNativeScroll = () => touchViewport.matches || reducedMotion.matches;
    let cancelled = false;
    let lenis: Lenis | null = null;
    let tickerUpdate: ((time: number) => void) | null = null;
    let scrollUpdate: (() => void) | null = null;
    let gsapInstance: typeof import("gsap").gsap | null = null;

    if (shouldUseNativeScroll()) {
      setLenisInstance(null);
      return undefined;
    }

    void Promise.all([import("lenis"), import("gsap"), import("gsap/ScrollTrigger")]).then(
      ([{ default: LenisConstructor }, { gsap }, { ScrollTrigger }]) => {
        if (cancelled || shouldUseNativeScroll()) return;

        gsap.registerPlugin(ScrollTrigger);
        gsapInstance = gsap;
        lenis = new LenisConstructor({
          duration: 0.95,
          easing: (time: number) => Math.min(1, 1.001 - Math.pow(2, -10 * time)),
          smoothWheel: true,
          wheelMultiplier: 0.9,
          touchMultiplier: 1
        });
        setLenisInstance(lenis);

        tickerUpdate = (time: number) => {
          lenis?.raf(time * 1000);
        };
        scrollUpdate = () => ScrollTrigger.update();

        lenis.on("scroll", scrollUpdate);
        gsap.ticker.add(tickerUpdate);
        gsap.ticker.lagSmoothing(500, 33);
        ScrollTrigger.config({ ignoreMobileResize: true });
        requestAnimationFrame(() => ScrollTrigger.refresh());
      }
    );

    return () => {
      cancelled = true;
      if (scrollUpdate) {
        lenis?.off("scroll", scrollUpdate);
      }
      if (tickerUpdate) {
        gsapInstance?.ticker.remove(tickerUpdate);
      }
      lenis?.destroy();
      setLenisInstance(null);
    };
  }, []);

  const value = useMemo(() => lenisInstance, [lenisInstance]);

  return <SmoothScrollContext.Provider value={value}>{children}</SmoothScrollContext.Provider>;
}
