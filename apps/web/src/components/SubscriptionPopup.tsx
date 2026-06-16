"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { createPortal } from "react-dom";
import type { SubscribeInteractionStatus } from "@/components/EnterpriseBriefingSubscribe";
import type { SubscriptionPopupContent } from "@/lib/types";

interface SubscriptionPopupProps {
  popup?: SubscriptionPopupContent;
}

const popupDelayMs = 30_000;
const popupScrollThreshold = 0.6;
const autoCloseDelayMs = 24_000;
const popupSeenStorageKey = "ractysh-subscription-popup-seen";
const emailStorageKey = "ractysh-subscription-email";
const subscribedStorageKey = "ractysh_subscribed";
const popupLabel = "Ractysh Intelligence";
const popupTitle = "Stay Connected.";
const popupDescription =
  "Receive enterprise insights, project updates and strategic announcements from the Ractysh ecosystem.";
const popupEase = [0.16, 1, 0.3, 1] as const;

const EnterpriseBriefingSubscribe = dynamic(
  () => import("@/components/EnterpriseBriefingSubscribe").then((mod) => mod.EnterpriseBriefingSubscribe),
  { ssr: false }
);

function hasStoredSubscription() {
  try {
    return window.localStorage.getItem(subscribedStorageKey) === "true";
  } catch {
    return false;
  }
}

function hasSeenPopupThisVisitor() {
  try {
    return window.localStorage.getItem(popupSeenStorageKey) === "true";
  } catch {
    return false;
  }
}

function rememberPopupSeen() {
  try {
    window.localStorage.setItem(popupSeenStorageKey, "true");
  } catch {
    // Visitor-level persistence is optional for the visual interaction.
  }
}

function PopupSubscriptionSuccess() {
  return (
    <motion.div
      key="popup-subscription-success"
      initial={{ opacity: 0, y: 14, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.98 }}
      transition={{ duration: 0.4, ease: popupEase }}
      className="relative flex min-h-[9rem] flex-col items-start justify-center overflow-hidden px-1 py-2"
      role="status"
      aria-live="polite"
    >
      <motion.span
        initial={{ opacity: 0, scale: 0.82 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 0.36, ease: popupEase }}
        className="relative flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.08] bg-[#8b1118] text-white shadow-[0_0_0_6px_rgba(139,17,24,0.14),0_14px_32px_rgba(0,0,0,0.35)]"
      >
        <Check className="h-4 w-4" strokeWidth={2.6} />
      </motion.span>
      <p className="relative mt-4 text-[0.68rem] font-semibold uppercase tracking-normal text-white/46">
        {popupLabel}
      </p>
      <h2 className="relative mt-2 font-display text-[1.35rem] font-semibold leading-tight tracking-normal text-white">
        Subscription confirmed.
      </h2>
      <p className="relative mt-2 text-[0.8rem] leading-5 text-white/58">Enterprise updates will arrive in your inbox.</p>
    </motion.div>
  );
}

export function SubscriptionPopup({ popup }: SubscriptionPopupProps) {
  const pathname = usePathname();
  const [portalReady, setPortalReady] = useState(false);
  const [visible, setVisible] = useState(false);
  const [interacted, setInteracted] = useState(false);
  const [subscribeStatus, setSubscribeStatus] = useState<SubscribeInteractionStatus>("idle");
  const triggerLockedRef = useRef(false);

  const close = useCallback(() => {
    rememberPopupSeen();
    setVisible(false);
  }, []);

  useEffect(() => {
    setPortalReady(true);
  }, []);

  useEffect(() => {
    setInteracted(false);
    setSubscribeStatus("idle");
    triggerLockedRef.current = false;

    if (pathname !== "/") {
      setVisible(false);
      return;
    }

    if (popup && !popup.enabled) {
      setVisible(false);
      return;
    }
    if (hasStoredSubscription()) {
      setVisible(false);
      return;
    }
    if (hasSeenPopupThisVisitor()) return;

    const triggerPopup = () => {
      if (triggerLockedRef.current || hasStoredSubscription() || hasSeenPopupThisVisitor()) return;

      triggerLockedRef.current = true;
      rememberPopupSeen();
      setVisible(true);
    };

    const handleScroll = () => {
      const documentElement = document.documentElement;
      const scrollableHeight = documentElement.scrollHeight - window.innerHeight;
      if (scrollableHeight <= 0) return;

      const scrollProgress = window.scrollY / scrollableHeight;
      if (scrollProgress >= popupScrollThreshold) {
        triggerPopup();
      }
    };

    const timer = window.setTimeout(triggerPopup, popupDelayMs);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [pathname, popup]);

  useEffect(() => {
    if (!visible || interacted) return;

    const timer = window.setTimeout(() => setVisible(false), autoCloseDelayMs);
    return () => window.clearTimeout(timer);
  }, [interacted, visible]);

  useEffect(() => {
    if (subscribeStatus !== "success") return;

    const timer = window.setTimeout(() => close(), 4600);
    return () => window.clearTimeout(timer);
  }, [close, subscribeStatus]);

  const popupNode = (
    <AnimatePresence>
      {visible ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.2, ease: popupEase } }}
          transition={{ duration: 0.4, ease: popupEase }}
          className="fixed inset-x-[5vw] bottom-3 z-[9999] w-auto sm:inset-x-auto sm:bottom-6 sm:right-6 sm:w-[420px] sm:max-w-[calc(100vw-3rem)]"
          role="dialog"
          aria-live="polite"
          aria-label="Ractysh subscription"
          onMouseEnter={() => setInteracted(true)}
          onFocusCapture={() => setInteracted(true)}
        >
          <motion.div
            className={`relative max-h-[calc(100dvh-1.5rem)] overflow-hidden rounded-[8px] border border-white/[0.08] bg-[#111111] p-4 text-white shadow-[0_22px_74px_rgba(0,0,0,0.36),0_0_34px_rgba(139,17,24,0.12)] backdrop-blur-xl transition duration-300 sm:p-5 ${
              subscribeStatus === "success" ? "shadow-[0_24px_76px_rgba(0,0,0,0.38),0_0_42px_rgba(139,17,24,0.16)]" : ""
            }`}
          >
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.055),transparent_45%,rgba(139,17,24,0.12))]" />
            <AnimatePresence>
              {subscribeStatus === "success" ? (
                <motion.div
                  key="popup-success-glow"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.35, ease: popupEase }}
                  className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(139,17,24,0.18),transparent_54%)]"
                />
              ) : null}
            </AnimatePresence>
            <div className="pointer-events-none absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-[#8b1118]/80 to-transparent" />

            <div className="relative">
              <AnimatePresence mode="wait" initial={false}>
                {subscribeStatus === "success" ? (
                  <PopupSubscriptionSuccess />
                ) : (
                  <motion.div
                    key="popup-subscription-form"
                    initial={{ opacity: 1, y: 0 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 12 }}
                    transition={{ duration: 0.36, ease: popupEase }}
                  >
                    <button
                      type="button"
                      aria-label="Dismiss subscription popup"
                      onClick={close}
                      className="absolute right-0 top-0 flex h-7 w-7 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.03] text-white/42 transition duration-300 hover:border-[#8b1118]/70 hover:bg-[#8b1118]/18 hover:text-white"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>

                    <div className="pr-9">
                      <div className="mb-3 flex items-center gap-2">
                        <span className="h-px w-7 bg-[#8b1118]" aria-hidden="true" />
                        <p className="text-[0.68rem] font-semibold uppercase tracking-normal text-white/48">
                          {popupLabel}
                        </p>
                      </div>
                      <div>
                        <h2 className="font-display text-[1.55rem] font-semibold leading-[1.05] tracking-normal text-white">
                          {popupTitle}
                        </h2>
                      </div>
                    </div>

                    <p className="mt-2 max-w-[22rem] overflow-hidden text-[0.82rem] leading-[1.45] text-white/62 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2]">
                      {popupDescription}
                    </p>

                    <EnterpriseBriefingSubscribe
                      variant="popup"
                      storageKey={emailStorageKey}
                      onInteract={() => setInteracted(true)}
                      onStatusChange={setSubscribeStatus}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );

  return portalReady ? createPortal(popupNode, document.body) : null;
}
