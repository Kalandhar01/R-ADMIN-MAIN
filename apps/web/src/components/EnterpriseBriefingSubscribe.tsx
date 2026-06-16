"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { gsap } from "gsap";
import { ArrowRight, ArrowUpRight, Check, Mail } from "lucide-react";
import { subscribeToRactyshNewsletter } from "@/lib/newsletterSubscribe";

export type SubscribeInteractionStatus = "idle" | "loading" | "success";
export const subscribedStorageKey = "ractysh_subscribed";

interface EnterpriseBriefingSubscribeProps {
  variant?: "footer" | "popup";
  storageKey?: string;
  autoCloseMs?: number;
  source?: string;
  onInteract?: () => void;
  onStatusChange?: (status: SubscribeInteractionStatus) => void;
  onSuccessComplete?: () => void;
}

const subscribeEase = [0.16, 1, 0.3, 1] as const;
const validEmailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const successParticles = [
  { left: "11%", top: "28%", x: -18, y: -26, delay: 0 },
  { left: "24%", top: "68%", x: -10, y: -34, delay: 0.05 },
  { left: "41%", top: "18%", x: 8, y: -24, delay: 0.09 },
  { left: "58%", top: "72%", x: 16, y: -36, delay: 0.13 },
  { left: "74%", top: "25%", x: 20, y: -28, delay: 0.17 },
  { left: "88%", top: "58%", x: 10, y: -32, delay: 0.21 }
];

function rememberSubscription(email: string, emailStorageKey?: string) {
  try {
    window.localStorage.setItem(subscribedStorageKey, "true");
    if (emailStorageKey) {
      window.localStorage.setItem(emailStorageKey, email);
    }
  } catch {
    // Subscription state is still reflected in the current interaction.
  }
}

export function EnterpriseBriefingSubscribe({
  variant = "footer",
  storageKey,
  autoCloseMs,
  source,
  onInteract,
  onStatusChange,
  onSuccessComplete
}: EnterpriseBriefingSubscribeProps) {
  const shouldReduceMotion = useReducedMotion();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<SubscribeInteractionStatus>("idle");
  const [error, setError] = useState("");
  const [focused, setFocused] = useState(false);
  const errorId = useId();
  const loadingButtonRef = useRef<HTMLButtonElement | null>(null);
  const successRef = useRef<HTMLDivElement | null>(null);
  const isPopup = variant === "popup";

  const updateStatus = (nextStatus: SubscribeInteractionStatus) => {
    setStatus(nextStatus);
    onStatusChange?.(nextStatus);
  };

  useEffect(() => {
    if (status !== "loading" || shouldReduceMotion) return;

    const glow = loadingButtonRef.current?.querySelector<HTMLElement>("[data-subscribe-button-glow]");
    if (!glow) return;

    const tween = gsap.fromTo(
      glow,
      { opacity: 0, xPercent: -130 },
      { opacity: 0.78, xPercent: 150, duration: 1.15, repeat: -1, ease: "power2.inOut" }
    );

    return () => {
      tween.kill();
    };
  }, [shouldReduceMotion, status]);

  useEffect(() => {
    if (status !== "success" || shouldReduceMotion) return;

    const particles = gsap.utils.toArray<HTMLElement>("[data-success-particle]", successRef.current);
    const glow = successRef.current?.querySelector<HTMLElement>("[data-success-glow]");

    const timeline = gsap.timeline();
    if (glow) {
      timeline.fromTo(glow, { opacity: 0.18, scale: 0.96 }, { opacity: 0.72, scale: 1.04, duration: 1.2, ease: "power3.out" }, 0);
    }
    timeline.fromTo(
      particles,
      { opacity: 0, y: 10, scale: 0.72 },
      {
        opacity: (index) => (index % 2 === 0 ? 0.76 : 0.52),
        x: (index) => successParticles[index]?.x ?? 0,
        y: (index) => successParticles[index]?.y ?? -28,
        scale: 1,
        duration: 1.35,
        stagger: 0.045,
        ease: "power3.out"
      },
      0.08
    );
    timeline.to(particles, { opacity: 0, duration: 0.9, stagger: 0.035, ease: "power2.out" }, 0.92);

    return () => {
      timeline.kill();
    };
  }, [shouldReduceMotion, status]);

  useEffect(() => {
    if (status !== "success" || !autoCloseMs || !onSuccessComplete) return;

    const timer = window.setTimeout(onSuccessComplete, autoCloseMs);
    return () => window.clearTimeout(timer);
  }, [autoCloseMs, onSuccessComplete, status]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onInteract?.();

    const normalizedEmail = email.trim().toLowerCase();
    if (!validEmailPattern.test(normalizedEmail)) {
      setError("Enter a valid enterprise email.");
      updateStatus("idle");
      return;
    }

    setError("");
    updateStatus("loading");

    try {
      await Promise.all([
        subscribeToRactyshNewsletter(
          normalizedEmail,
          source || (isPopup ? "subscription-popup" : "footer-enterprise-briefing")
        ),
        new Promise((resolve) => window.setTimeout(resolve, shouldReduceMotion ? 0 : 720))
      ]);
      rememberSubscription(normalizedEmail, storageKey);
      setEmail("");
      updateStatus("success");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unable to confirm subscription.");
      updateStatus("idle");
    }
  }

  const inputShellClass = [
    "relative block",
    isPopup ? "" : "min-w-0"
  ].join(" ");
  const inputClass = [
    "h-11 w-full min-w-0 border text-[0.86rem] font-medium outline-none transition duration-300",
    isPopup ? "rounded-[6px] pl-10 pr-4" : "rounded-[7px] px-3.5",
    isPopup
      ? "bg-white/[0.035] text-white placeholder:text-white/34"
      : "bg-white/[0.04] text-[#fff8ec] placeholder:text-white/28",
    error
      ? isPopup
        ? "border-[#8b1118]/80 shadow-[0_0_0_3px_rgba(139,17,24,0.18),0_0_30px_rgba(139,17,24,0.16)]"
        : "border-[#e8c16f]/70 shadow-[0_0_0_3px_rgba(224,197,121,0.12),0_0_30px_rgba(224,197,121,0.16)]"
      : focused || email
        ? isPopup
          ? "border-[#8b1118]/75 bg-white/[0.055] shadow-[0_0_0_3px_rgba(139,17,24,0.15),0_0_28px_rgba(139,17,24,0.16)]"
          : "border-[#E0C579]/55 bg-white/[0.055] shadow-[0_0_0_3px_rgba(224,197,121,0.10),0_0_28px_rgba(224,197,121,0.12)]"
        : isPopup
          ? "border-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.045)]"
          : "border-white/[0.08]"
  ].join(" ");
  const buttonClass = [
    "relative inline-flex h-11 items-center justify-center gap-2 overflow-hidden whitespace-nowrap border text-[#17130d] shadow-[0_18px_46px_rgba(0,0,0,0.24)] transition duration-300 hover:-translate-y-0.5 disabled:cursor-default disabled:hover:translate-y-0",
    isPopup
      ? "rounded-[6px] border-[#8b1118]/70 bg-[#8b1118] px-4 text-[0.84rem] font-semibold normal-case tracking-normal text-white hover:border-[#b32932] hover:bg-[#a01822] hover:shadow-[0_20px_54px_rgba(0,0,0,0.3),0_0_34px_rgba(139,17,24,0.3)]"
      : "rounded-[7px] border-[#E0C579]/25 bg-[#f5ebd8] px-4 text-[0.78rem] font-bold uppercase tracking-[0.13em] hover:border-[#E0C579]/55 hover:bg-[#E0C579] hover:shadow-[0_20px_54px_rgba(0,0,0,0.28),0_0_34px_rgba(224,197,121,0.2)]",
    status === "loading"
      ? isPopup
        ? "border-[#b32932] bg-[#a01822] text-white shadow-[0_18px_52px_rgba(139,17,24,0.24),0_0_42px_rgba(139,17,24,0.24)]"
        : "border-[#E0C579]/60 bg-[#E0C579] text-[#17130d] shadow-[0_18px_52px_rgba(224,197,121,0.2),0_0_42px_rgba(224,197,121,0.22)]"
      : ""
  ].join(" ");

  return (
    <div className="relative">
      <AnimatePresence mode="wait" initial={false}>
        {status === "success" ? (
          <motion.div
            key="success"
            ref={successRef}
            initial={shouldReduceMotion ? false : { opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={shouldReduceMotion ? undefined : { opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.8, ease: subscribeEase }}
            className="relative overflow-hidden rounded-[12px] border border-[#E0C579]/24 bg-[#15110e]/72 p-4 text-[#fff8ec] shadow-[0_22px_70px_rgba(0,0,0,0.24),0_0_54px_rgba(224,197,121,0.12),inset_0_1px_0_rgba(255,255,255,0.07)]"
            role="status"
            aria-live="polite"
          >
            <div
              data-success-glow
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(224,197,121,0.20),transparent_12rem),linear-gradient(135deg,rgba(255,255,255,0.055),transparent_58%)]"
            />
            {successParticles.map((particle) => (
              <span
                key={`${particle.left}-${particle.top}`}
                data-success-particle
                className="pointer-events-none absolute h-1 w-1 rounded-full bg-[#E0C579] opacity-0 shadow-[0_0_14px_rgba(224,197,121,0.72)]"
                style={{ left: particle.left, top: particle.top }}
              />
            ))}
            <div className="relative flex items-start gap-3">
              <motion.span
                initial={shouldReduceMotion ? false : { scale: 0.82, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.55, ease: subscribeEase }}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#E0C579]/42 bg-[#E0C579] text-[#15110e] shadow-[0_0_0_7px_rgba(224,197,121,0.10),0_0_34px_rgba(224,197,121,0.34)]"
              >
                <Check className="h-5 w-5" strokeWidth={2.4} />
              </motion.span>
              <div>
                <p className="text-[0.64rem] font-semibold uppercase tracking-[0.22em] text-[#E0C579]">CONNECTED</p>
                <h4 className="mt-2 font-display text-[1.05rem] font-semibold leading-tight tracking-normal text-[#fff8ec]">
                  You are now connected to the Ractysh ecosystem.
                </h4>
                <p className="mt-2 text-[0.8rem] leading-5 text-white/56">
                  Premium operational updates will be delivered directly.
                </p>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            layout
            onSubmit={handleSubmit}
            initial={shouldReduceMotion ? false : { opacity: 0, y: 8, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: status === "loading" ? 0.992 : 1 }}
            exit={shouldReduceMotion ? undefined : { opacity: 0, y: -10, scale: 0.97 }}
            transition={{ duration: 0.45, ease: subscribeEase }}
            className={isPopup ? "mt-4 space-y-2.5" : "mt-5"}
            noValidate
          >
            <div className={isPopup ? "grid gap-2.5 sm:grid-cols-[minmax(0,1fr)_132px]" : "grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto]"}>
              <label className={inputShellClass}>
                {isPopup ? (
                  <Mail className="pointer-events-none absolute left-4 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-white/34" />
                ) : null}
                <input
                  required
                  disabled={status === "loading"}
                  value={email}
                  onChange={(event) => {
                    onInteract?.();
                    setEmail(event.target.value);
                    if (error) setError("");
                  }}
                  onFocus={() => {
                    onInteract?.();
                    setFocused(true);
                  }}
                  onBlur={() => setFocused(false)}
                  type="email"
                  name="email"
                  aria-label="Email address for enterprise briefing"
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? errorId : undefined}
                  placeholder={isPopup ? "Email Address" : "Enter email"}
                  className={inputClass}
                />
              </label>
              <motion.button
                ref={loadingButtonRef}
                type="submit"
                disabled={status === "loading"}
                whileHover={status === "loading" || shouldReduceMotion ? undefined : { y: -2 }}
                whileTap={shouldReduceMotion ? undefined : { scale: 0.965 }}
                animate={status === "loading" ? { scale: 0.985 } : { scale: 1 }}
                transition={{ duration: 0.28, ease: subscribeEase }}
                className={buttonClass}
              >
                {status !== "loading" ? (
                  <motion.span
                    aria-hidden="true"
                    animate={shouldReduceMotion ? undefined : { opacity: [0.08, 0.28, 0.08], scale: [1, 1.04, 1] }}
                    transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
                    className={`pointer-events-none absolute inset-0 border ${
                      isPopup
                        ? "rounded-[6px] border-white/[0.08] bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.12),transparent)]"
                        : "rounded-[7px] border-[#E0C579]/28 bg-[radial-gradient(circle_at_50%_50%,rgba(224,197,121,0.22),transparent_62%)]"
                    }`}
                  />
                ) : null}
                <span
                  data-subscribe-button-glow
                  className="pointer-events-none absolute inset-y-0 left-0 w-1/3 -skew-x-12 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.44),transparent)] opacity-0"
                />
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={status}
                    initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={shouldReduceMotion ? undefined : { opacity: 0, y: -8 }}
                    transition={{ duration: 0.25, ease: subscribeEase }}
                    className="relative z-10"
                  >
                    {status === "loading" ? "Subscribing..." : "Subscribe"}
                  </motion.span>
                </AnimatePresence>
                {isPopup ? (
                  <ArrowRight className="relative z-10 h-3.5 w-3.5" strokeWidth={2.4} />
                ) : (
                  <ArrowUpRight className="relative z-10 h-3.5 w-3.5" strokeWidth={2.4} />
                )}
              </motion.button>
            </div>

            <AnimatePresence>
              {error ? (
                <motion.p
                  id={errorId}
                  initial={shouldReduceMotion ? false : { opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={shouldReduceMotion ? undefined : { opacity: 0, y: -4 }}
                  transition={{ duration: 0.3, ease: subscribeEase }}
                  className={isPopup ? "mt-2 text-[0.76rem] font-medium text-[#ffb4b8]" : "mt-2 text-[0.76rem] font-medium text-[#f0d58a]"}
                >
                  {error}
                </motion.p>
              ) : null}
            </AnimatePresence>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
