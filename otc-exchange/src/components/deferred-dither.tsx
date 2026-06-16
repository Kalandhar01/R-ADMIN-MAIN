"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import type { DitherProps } from "@/components/Dither";

const Dither = dynamic(() => import("@/components/Dither"), {
  loading: () => null,
  ssr: false,
});

type IdleWindow = Window &
  typeof globalThis & {
    requestIdleCallback?: (
      callback: IdleRequestCallback,
      options?: IdleRequestOptions,
    ) => number;
    cancelIdleCallback?: (handle: number) => void;
  };

type DeferredDitherProps = DitherProps & {
  pauseWhenPastHero?: boolean;
};

export default function DeferredDither({
  pauseWhenPastHero = false,
  ...props
}: DeferredDitherProps) {
  const [ready, setReady] = useState(false);
  const [isNearHero, setIsNearHero] = useState(true);

  useEffect(() => {
    const browserWindow = window as IdleWindow;

    if (typeof browserWindow.requestIdleCallback === "function") {
      const idleId = browserWindow.requestIdleCallback(() => setReady(true), {
        timeout: 1200,
      });

      return () => browserWindow.cancelIdleCallback?.(idleId);
    }

    const timeoutId = browserWindow.setTimeout(() => setReady(true), 800);
    return () => browserWindow.clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    if (!pauseWhenPastHero) return;

    let frameId = 0;

    const updateHeroProximity = () => {
      frameId = 0;
      setIsNearHero(window.scrollY < window.innerHeight + 360);
    };

    const scheduleUpdate = () => {
      if (frameId) return;
      frameId = window.requestAnimationFrame(updateHeroProximity);
    };

    updateHeroProximity();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    return () => {
      if (frameId) window.cancelAnimationFrame(frameId);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, [pauseWhenPastHero]);

  const isActive = !pauseWhenPastHero || isNearHero;

  return ready && isActive ? <Dither {...props} active={isActive} /> : null;
}
