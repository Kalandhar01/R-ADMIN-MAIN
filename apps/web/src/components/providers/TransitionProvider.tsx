"use client";

import {
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { BrandLogo } from "@/components/BrandLogo";
import { PageTransition } from "@/components/providers/PageTransition";
import { useLenis } from "@/components/providers/SmoothScrollProvider";

const routePushDelay = 520;
const loaderMinimumDuration = 1450;
const anchorDuration = 1.2;
const premiumEase = [0.22, 1, 0.36, 1] as const;
const easeOutExpo = (time: number) => (time === 1 ? 1 : 1 - Math.pow(2, -10 * time));
const loadingStatuses = [
  "Synchronizing infrastructure",
  "Loading executive systems",
  "Connecting operational layers",
  "Preparing enterprise ecosystem",
  "Routing architecture modules"
];
const minimalParticles = [
  { left: "31%", top: "37%", delay: "-0.4s" },
  { left: "65%", top: "36%", delay: "-1.1s" },
  { left: "39%", top: "61%", delay: "-1.7s" },
  { left: "68%", top: "58%", delay: "-0.9s" },
  { left: "51%", top: "31%", delay: "-1.4s" },
  { left: "28%", top: "52%", delay: "-2.1s" },
  { left: "73%", top: "47%", delay: "-2.6s" },
  { left: "47%", top: "69%", delay: "-3.1s" },
  { left: "56%", top: "65%", delay: "-2.4s" }
];

interface TransitionProviderProps {
  children: ReactNode;
}

function isModifiedEvent(event: MouseEvent) {
  return event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0;
}

function getScrollTarget(hash: string) {
  if (!hash || hash === "#") {
    return 0;
  }

  const id = decodeURIComponent(hash.slice(1));
  return document.getElementById(id) ?? 0;
}

function getEventElement(target: EventTarget | null) {
  if (target instanceof Element) {
    return target;
  }

  if (target instanceof Node) {
    return target.parentElement;
  }

  return null;
}

function RouteLoadingOverlay({ visible }: { visible: boolean }) {
  const reduceMotion = useReducedMotion();
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const [statusIndex, setStatusIndex] = useState(0);

  useEffect(() => {
    if (!visible) return;

    setStatusIndex(0);

    if (reduceMotion) return;

    const statusTimer = window.setInterval(() => {
      setStatusIndex((current) => (current + 1) % loadingStatuses.length);
    }, 2200);

    return () => window.clearInterval(statusTimer);
  }, [visible, reduceMotion]);

  useEffect(() => {
    if (!visible || reduceMotion || !overlayRef.current) return;

    let cancelled = false;
    let ctx: { revert: () => void } | null = null;

    void import("gsap").then(({ gsap }) => {
      if (cancelled || !overlayRef.current) return;

      ctx = gsap.context(() => {
        gsap.fromTo(
          "[data-route-loader-content]",
          { scale: 1 },
          { scale: 1.012, duration: 8, repeat: -1, yoyo: true, ease: "sine.inOut" }
        );

        gsap.fromTo(
          "[data-route-loader-title]",
          { opacity: 0.82 },
          { opacity: 1, duration: 1.9, repeat: -1, yoyo: true, ease: "sine.inOut" }
        );

        gsap.to("[data-route-loader-depth='far']", {
          x: 10,
          y: -8,
          opacity: 0.42,
          duration: 9,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut"
        });

        gsap.to("[data-route-loader-depth='mid']", {
          x: -6,
          y: 7,
          opacity: 0.72,
          duration: 7,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut"
        });

        gsap.fromTo(
          "[data-route-loader-particle]",
          { y: 5, opacity: 0.14 },
          {
            y: -5,
            opacity: 0.48,
            duration: 2.2,
            repeat: -1,
            yoyo: true,
            stagger: 0.18,
            ease: "sine.inOut"
          }
        );

        gsap.to("[data-route-loader-light]", {
          xPercent: 24,
          yPercent: -18,
          opacity: 0.74,
          duration: 12,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut"
        });

        gsap.to("[data-route-loader-node]", {
          scale: 1.32,
          opacity: 0.96,
          duration: 0.9,
          repeat: -1,
          yoyo: true,
          stagger: 0.18,
          ease: "power3.out"
        });
      }, overlayRef);
    });

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, [visible, reduceMotion]);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          ref={overlayRef}
          className="route-loader fixed inset-0 z-[220] overflow-hidden text-[#fff8ec]"
          role="status"
          aria-live="polite"
          aria-label="Loading the next Ractysh page"
          initial={reduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.992 }}
          animate={
            reduceMotion
              ? { opacity: 1 }
              : { opacity: 1, scale: 1, transition: { duration: 0.46, ease: premiumEase } }
          }
          exit={
            reduceMotion
              ? { opacity: 0 }
              : { opacity: 0, scale: 1.03, transition: { duration: 0.9, ease: premiumEase } }
          }
          style={{
            backfaceVisibility: "hidden",
            transform: "translateZ(0)",
            willChange: "opacity, transform"
          }}
        >
          <div className="route-loader-motion-bg" aria-hidden="true">
            <span className="route-loader-grain" />
            <span className="route-loader-cinematic-streak route-loader-cinematic-streak-a" data-route-loader-light />
            <span className="route-loader-cinematic-streak route-loader-cinematic-streak-b" data-route-loader-light />
            <span className="route-loader-sync-pulse" />
            <span className="route-loader-gradient-drift" data-route-loader-depth="mid" />
            <span className="route-loader-soft-grid route-loader-grid-far" data-route-loader-depth="far" />
            <span className="route-loader-soft-grid route-loader-grid-mid" data-route-loader-depth="mid" />
            <span className="route-loader-scan-soft" />
            <span className="route-loader-ambient-soft" data-route-loader-depth="mid" />
            {minimalParticles.map((particle) => (
              <span
                key={`${particle.left}-${particle.top}`}
                data-route-loader-particle
                className="route-loader-particle-soft"
                style={{ left: particle.left, top: particle.top, animationDelay: particle.delay }}
              />
            ))}
          </div>
          <div className="flex min-h-[100dvh] items-center justify-center px-6 py-12">
            <motion.div
              data-route-loader-content
              className="route-loader-content text-center"
              initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 8 }}
              animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 4 }}
              transition={{ duration: reduceMotion ? 0 : 0.4, ease: premiumEase }}
              style={{
                backfaceVisibility: "hidden",
                transform: "translateZ(0)",
                willChange: "opacity, transform"
              }}
            >
              <motion.div
                data-route-loader-logo
                initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 6, scale: 0.96 }}
                animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
                exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -4, scale: 0.98 }}
                transition={{ duration: reduceMotion ? 0 : 0.62, ease: premiumEase }}
                className="route-loader-logo"
              >
                <BrandLogo size="loader" priority />
              </motion.div>
              <p data-route-loader-title className="route-loader-title">
                RACTYSH ECOSYSTEM
              </p>
              <div className="route-loader-status-slot">
                <motion.p
                  key={loadingStatuses[statusIndex]}
                  className="route-loader-status"
                  animate={
                    reduceMotion
                      ? { opacity: 1, y: 0 }
                      : {
                          opacity: [0, 1, 1, 0],
                          y: [10, 0, 0, -10]
                        }
                  }
                  transition={{
                    duration: reduceMotion ? 0 : 2.2,
                    times: [0, 0.18, 0.82, 1],
                    ease: "easeInOut"
                  }}
                >
                  {loadingStatuses[statusIndex]}
                </motion.p>
              </div>
              <div className="route-loader-line" aria-hidden="true">
                <svg className="route-loader-signal-svg" viewBox="0 0 240 34" preserveAspectRatio="none">
                  <path className="route-loader-signal-path" d="M2 17 C54 17 58 8 96 8 C132 8 132 26 170 26 C194 26 206 17 238 17" pathLength={100} />
                  <path className="route-loader-signal-pulse" d="M2 17 C54 17 58 8 96 8 C132 8 132 26 170 26 C194 26 206 17 238 17" pathLength={100} />
                </svg>
                <span className="route-loader-line-sweep" />
                <span className="route-loader-line-scan" />
                <span className="route-loader-line-particle route-loader-line-particle-a" />
                <span className="route-loader-line-particle route-loader-line-particle-b" />
                <i data-route-loader-node className="route-loader-line-node route-loader-line-node-a" />
                <i data-route-loader-node className="route-loader-line-node route-loader-line-node-b" />
                <i data-route-loader-node className="route-loader-line-node route-loader-line-node-c" />
              </div>
              <div className="route-loader-sync-dots" aria-hidden="true">
                {[0, 1, 2, 3].map((dot) => (
                  <span key={dot} className="route-loader-sync-dot" style={{ animationDelay: `${dot * 0.16}s` }} />
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export function TransitionProvider({ children }: TransitionProviderProps) {
  const router = useRouter();
  const pathname = usePathname() || "";
  const searchParams = useSearchParams();
  const lenis = useLenis();
  const [isExiting, setIsExiting] = useState(false);
  const [isLoadingRoute, setIsLoadingRoute] = useState(false);
  const pendingHashRef = useRef<string | null>(null);
  const transitionTimerRef = useRef<number | null>(null);
  const loaderReleaseTimerRef = useRef<number | null>(null);
  const loaderStartedAtRef = useRef(0);
  const loaderActiveRef = useRef(false);
  const previousRouteRef = useRef<string>("");

  const routeKey = useMemo(() => {
    const query = searchParams === null ? "" : searchParams.toString();
    return `${pathname}${query ? `?${query}` : ""}`;
  }, [pathname, searchParams]);

  const scrollToTarget = useCallback(
    (hash: string | null, duration = anchorDuration) => {
      const target = hash ? getScrollTarget(hash) : 0;

      if (lenis) {
        lenis.scrollTo(target, {
          duration,
          easing: easeOutExpo,
          offset: 0
        });
        return;
      }

      if (typeof target === "number") {
        window.scrollTo({ top: target, behavior: "smooth" });
      } else {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    },
    [lenis]
  );

  useEffect(() => {
    const previousRoute = previousRouteRef.current;
    previousRouteRef.current = routeKey;

    if (!previousRoute) return;

    if (transitionTimerRef.current) {
      window.clearTimeout(transitionTimerRef.current);
      transitionTimerRef.current = null;
    }

    setIsExiting(false);

    if (loaderActiveRef.current) {
      if (loaderReleaseTimerRef.current) {
        window.clearTimeout(loaderReleaseTimerRef.current);
      }

      const elapsed = loaderStartedAtRef.current ? window.performance.now() - loaderStartedAtRef.current : loaderMinimumDuration;
      const remaining = Math.max(260, loaderMinimumDuration - elapsed);

      loaderReleaseTimerRef.current = window.setTimeout(() => {
        loaderActiveRef.current = false;
        loaderStartedAtRef.current = 0;
        setIsLoadingRoute(false);
      }, remaining);
    }

    window.requestAnimationFrame(() => {
      const targetHash = pendingHashRef.current;
      pendingHashRef.current = null;
      scrollToTarget(targetHash, targetHash ? 1.2 : 0.95);
    });
  }, [routeKey, scrollToTarget]);

  useEffect(() => {
    return () => {
      if (transitionTimerRef.current) {
        window.clearTimeout(transitionTimerRef.current);
      }

      if (loaderReleaseTimerRef.current) {
        window.clearTimeout(loaderReleaseTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (event.defaultPrevented || isModifiedEvent(event)) return;

      const target = getEventElement(event.target);
      if (!target) return;

      const anchor = target.closest<HTMLAnchorElement>("a[href]");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("mailto:") || href.startsWith("tel:")) return;
      if (anchor.target && anchor.target !== "_self") return;
      if (anchor.hasAttribute("download") || anchor.dataset.noTransition === "true") return;

      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin) return;

      const currentPath = window.location.pathname;
      const currentSearch = window.location.search;
      const samePath = url.pathname === currentPath && url.search === currentSearch;
      const destination = `${url.pathname}${url.search}${url.hash}`;

      if (samePath) {
        event.preventDefault();
        window.history.pushState(null, "", `${url.pathname}${url.search}${url.hash}`);
        scrollToTarget(url.hash || null, anchorDuration);
        return;
      }

      event.preventDefault();

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        pendingHashRef.current = url.hash || null;
        router.push(destination, { scroll: false });
        return;
      }

      pendingHashRef.current = url.hash || null;
      loaderActiveRef.current = true;
      loaderStartedAtRef.current = window.performance.now();
      setIsExiting(true);
      setIsLoadingRoute(true);

      if (transitionTimerRef.current) {
        window.clearTimeout(transitionTimerRef.current);
      }

      if (loaderReleaseTimerRef.current) {
        window.clearTimeout(loaderReleaseTimerRef.current);
      }

      transitionTimerRef.current = window.setTimeout(() => {
        router.push(destination, { scroll: false });
      }, routePushDelay);
    };

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [router, scrollToTarget]);

  const handlePointerDownCapture = (event: ReactMouseEvent<HTMLDivElement>) => {
    const target = getEventElement(event.target);
    if (!target) return;

    const interactive = target.closest<HTMLElement>("a[href], button");
    if (!interactive || interactive.dataset.noPressFeedback === "true") return;

    interactive.animate(
      [
        { transform: "translateZ(0) scale(1)" },
        { transform: "translateZ(0) scale(0.985)" },
        { transform: "translateZ(0) scale(1)" }
      ],
      {
        duration: 260,
        easing: "cubic-bezier(0.22, 1, 0.36, 1)"
      }
    );
  };

  return (
    <div onPointerDownCapture={handlePointerDownCapture}>
      <PageTransition exiting={isExiting}>{children}</PageTransition>
      <RouteLoadingOverlay visible={isLoadingRoute} />
    </div>
  );
}
