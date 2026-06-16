"use client";

import { type FormEvent, useEffect, useId, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, X } from "lucide-react";
import {
  hasSeenSubscribePopupThisSession,
  hasStoredSubscription,
  rememberSubscribePopupShown,
  subscribeUser
} from "@/lib/newsletterSubscribe";

type SubscribeFormStatus = "idle" | "loading" | "success";
type FooterSubscribeState = "checking" | "visible" | "success" | "hidden";

interface SubscribeFormProps {
  variant: "popup" | "footer";
  source: string;
  placeholder: string;
  buttonLabel: string;
  autoFocus?: boolean;
  onSuccess?: () => void;
}

const subscribeEase = [0.16, 1, 0.3, 1] as const;
const validEmailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const subscribedEventName = "ractysh-real-estate-subscribed";

function RactyshSubscribeForm({
  variant,
  source,
  placeholder,
  buttonLabel,
  autoFocus = false,
  onSuccess
}: SubscribeFormProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<SubscribeFormStatus>("idle");
  const [error, setError] = useState("");
  const errorId = useId();
  const isPopup = variant === "popup";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();
    if (!validEmailPattern.test(normalizedEmail)) {
      setError("Please enter a valid email address.");
      setStatus("idle");
      return;
    }

    setError("");
    setStatus("loading");

    try {
      await subscribeUser(normalizedEmail, source);
      setEmail("");
      setStatus("success");
      onSuccess?.();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unable to confirm subscription.");
      setStatus("idle");
    }
  }

  if (!isPopup && status === "success") {
    return (
      <motion.div
        className="re-subscribe-footer-success"
        initial={{ opacity: 0, y: 18, scale: 0.96, filter: "blur(12px)" }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.62, ease: subscribeEase }}
        role="status"
        aria-live="polite"
      >
        <span aria-hidden="true">
          <Check size={20} strokeWidth={2.6} />
        </span>
        <div>
          <strong>Welcome To The Network</strong>
          <p>You are now subscribed to Ractysh Group Insights.</p>
        </div>
      </motion.div>
    );
  }

  return (
    <form className={`re-subscribe-form re-subscribe-form--${variant}`} onSubmit={handleSubmit} noValidate>
      <label>
        <span className="sr-only">Email address</span>
        <input
          type="email"
          name="email"
          value={email}
          required
          autoFocus={autoFocus}
          disabled={status === "loading"}
          placeholder={placeholder}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          onChange={(event) => {
            setEmail(event.target.value);
            if (error) setError("");
          }}
        />
      </label>
      <motion.button
        type="submit"
        disabled={status === "loading"}
        whileHover={status === "loading" ? undefined : { y: isPopup ? -2 : -3 }}
        whileTap={status === "loading" ? undefined : { scale: isPopup ? 0.97 : 0.98 }}
        transition={{ duration: isPopup ? 0.24 : 0.3, type: "spring", stiffness: 260, damping: 20 }}
      >
        <span>{status === "loading" ? "Subscribing..." : buttonLabel}</span>
        <ArrowRight size={16} strokeWidth={2.2} />
      </motion.button>
      <AnimatePresence>
        {error ? (
          <motion.p
            id={errorId}
            className="re-subscribe-error"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.25, ease: subscribeEase }}
          >
            {error}
          </motion.p>
        ) : null}
      </AnimatePresence>
    </form>
  );
}

export function RactyshGroupSubscribePopup() {
  const [visible, setVisible] = useState(false);
  const [success, setSuccess] = useState(false);

  const dismiss = () => {
    rememberSubscribePopupShown();
    setVisible(false);
  };

  useEffect(() => {
    if (hasStoredSubscription() || hasSeenSubscribePopupThisSession()) return;

    const timer = window.setTimeout(() => {
      if (hasStoredSubscription() || hasSeenSubscribePopupThisSession()) return;
      rememberSubscribePopupShown();
      setVisible(true);
    }, 12_000);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!visible) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") dismiss();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [visible]);

  useEffect(() => {
    if (!success) return;

    const timer = window.setTimeout(() => setVisible(false), 2_000);
    return () => window.clearTimeout(timer);
  }, [success]);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          className="re-subscribe-popup-overlay"
          initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
          animate={{ opacity: 1, backdropFilter: "blur(18px)" }}
          exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
          transition={{ duration: 0.45, ease: subscribeEase }}
          onMouseDown={dismiss}
        >
          <motion.aside
            className="re-subscribe-popup"
            role="dialog"
            aria-modal="true"
            aria-label="Ractysh Group subscription"
            initial={{ opacity: 0, scale: 0.92, y: 40, filter: "blur(20px)" }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.96, y: 20, filter: "blur(10px)" }}
            transition={{ duration: 0.8, ease: subscribeEase }}
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="re-subscribe-arch-grid" aria-hidden="true" />
            <button className="re-subscribe-popup-close" type="button" onClick={dismiss} aria-label="Close subscription popup">
              <X size={17} strokeWidth={2.1} />
            </button>

            <AnimatePresence mode="wait" initial={false}>
              {success ? (
                <motion.div
                  key="subscribe-popup-success"
                  className="re-subscribe-popup-success"
                  initial={{ opacity: 0, y: 18, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -12, scale: 0.98 }}
                  transition={{ duration: 0.55, ease: subscribeEase }}
                  role="status"
                  aria-live="polite"
                >
                  <motion.span
                    initial={{ scale: 0.72, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 240, damping: 16, delay: 0.08 }}
                    aria-hidden="true"
                  >
                    <Check size={28} strokeWidth={2.4} />
                  </motion.span>
                  <h2>Successfully Subscribed</h2>
                  <p>
                    Welcome to the Ractysh Group network. You'll receive investment opportunities,
                    project launches and private market updates.
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="subscribe-popup-form"
                  className="re-subscribe-popup-content"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.45, ease: subscribeEase }}
                >
                  <p className="re-subscribe-kicker">RACTYSH GROUP</p>
                  <h2>Stay Ahead Of Premium Opportunities</h2>
                  <p>
                    Receive curated investment opportunities, premium residences, commercial assets
                    and strategic market insights across South India.
                  </p>
                  <RactyshSubscribeForm
                    variant="popup"
                    source="ractysh-real-estate-subscription-popup"
                    placeholder="Email Address"
                    buttonLabel="Subscribe Now"
                    autoFocus
                    onSuccess={() => {
                      setSuccess(true);
                      window.dispatchEvent(new Event(subscribedEventName));
                    }}
                  />
                  <button className="re-subscribe-later" type="button" onClick={dismiss}>
                    Maybe Later
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.aside>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export function RactyshGroupFooterSubscribeCompact() {
  const [subscribeState, setSubscribeState] = useState<FooterSubscribeState>("checking");

  useEffect(() => {
    setSubscribeState(hasStoredSubscription() ? "hidden" : "visible");

    const handleSubscribed = () => setSubscribeState("hidden");
    window.addEventListener(subscribedEventName, handleSubscribed);

    return () => window.removeEventListener(subscribedEventName, handleSubscribed);
  }, []);

  useEffect(() => {
    if (subscribeState !== "success") return;

    const timer = window.setTimeout(() => setSubscribeState("hidden"), 2_200);
    return () => window.clearTimeout(timer);
  }, [subscribeState]);

  if (subscribeState === "checking" || subscribeState === "hidden") {
    return null;
  }

  return (
    <AnimatePresence mode="wait">
      {subscribeState === "success" ? (
        <motion.div
          key="footer-subscribe-success"
          className="re-footer-subscribe"
          initial={{ opacity: 0, y: 24, filter: "blur(14px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -18, filter: "blur(10px)" }}
          transition={{ duration: 0.45, ease: subscribeEase }}
          role="status"
          aria-live="polite"
        >
          <div className="re-subscribe-footer-success">
            <span aria-hidden="true">
              <Check size={20} strokeWidth={2.6} />
            </span>
            <div>
              <strong>Welcome To The Network</strong>
              <p>You are now subscribed to Ractysh Group Insights.</p>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="footer-subscribe-form"
          className="re-footer-subscribe"
          aria-labelledby="ractysh-footer-subscribe-heading"
          initial={{ opacity: 0, y: 40, filter: "blur(20px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -18, filter: "blur(10px)" }}
          viewport={{ once: true, amount: 0.4 }}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.8, ease: subscribeEase }}
        >
          <p className="re-subscribe-kicker">RACTYSH GROUP INSIGHTS</p>
          <h3 id="ractysh-footer-subscribe-heading">Join The Private Investor Network</h3>
          <p>Receive premium acquisition updates, investment opportunities and project insights.</p>
          <RactyshSubscribeForm
            variant="footer"
            source="ractysh-real-estate-footer-investor-network"
            placeholder="Email Address"
            buttonLabel="Subscribe"
            onSuccess={() => setSubscribeState("success")}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
