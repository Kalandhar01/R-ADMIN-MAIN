"use client";

import { useEffect, useId, useState, type FormEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { subscribeToRactyshNewsletter } from "@/lib/newsletterSubscribe";

const validEmailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const motionEase = [0.22, 1, 0.36, 1] as const;

type SubscribeState = "idle" | "loading" | "success";

function rememberFooterSubscription(email: string) {
  try {
    window.localStorage.setItem("ractysh_subscribed", "true");
    window.localStorage.setItem("ractysh_footer_subscription_email", email);
  } catch {
    // The API owns persistence.
  }
}

export function FooterNewsletterSubscribe() {
  const shouldReduceMotion = useReducedMotion();
  const [email, setEmail] = useState("");
  const [state, setState] = useState<SubscribeState>("idle");
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);
  const errorId = useId();

  useEffect(() => {
    if (!showToast) return undefined;

    const timeoutId = window.setTimeout(() => setShowToast(false), 4200);
    return () => window.clearTimeout(timeoutId);
  }, [showToast]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();
    if (!validEmailPattern.test(normalizedEmail)) {
      setError("Enter a valid email address.");
      setState("idle");
      return;
    }

    setError("");
    setShowToast(false);
    setState("loading");

    try {
      await Promise.all([
        subscribeToRactyshNewsletter(normalizedEmail, "footer_newsletter"),
        new Promise((resolve) => window.setTimeout(resolve, shouldReduceMotion ? 0 : 260))
      ]);
      rememberFooterSubscription(normalizedEmail);
      setEmail("");
      setState("success");
      setShowToast(true);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unable to confirm subscription.");
      setState("idle");
    }
  }

  return (
    <>
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.34, ease: motionEase }}
        className="mx-auto w-full max-w-[520px] rounded-[12px] border border-[#d6b45f]/28 bg-[#0B0B0B] p-5 text-left text-[#fff8ec] shadow-[0_18px_50px_rgba(0,0,0,0.28)]"
      >
        <div className="text-center sm:text-left">
          <p className="font-display text-[1.28rem] font-semibold leading-tight tracking-[0] text-[#fff8ec]">
            Stay Connected
          </p>
          <p className="mt-2 text-[0.88rem] font-medium leading-6 tracking-[0] text-[#f4e6cc]/70">
            Receive enterprise intelligence, project insights and strategic updates from the Ractysh ecosystem.
          </p>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          {state === "success" ? (
            <motion.div
              key="newsletter-success"
              initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={shouldReduceMotion ? undefined : { opacity: 0, y: -8 }}
              transition={{ duration: 0.28, ease: motionEase }}
              className="mt-5 rounded-[10px] border border-[#d6b45f]/30 bg-[#111111] px-4 py-4 text-center"
              role="status"
              aria-live="polite"
            >
              <motion.span
                initial={shouldReduceMotion ? false : { scale: 0.72, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.24, ease: motionEase }}
                className="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-[#d6b45f] text-[#0B0B0B]"
                aria-hidden="true"
              >
                <Check className="h-4 w-4" strokeWidth={2.8} />
              </motion.span>
              <p className="mt-3 text-[0.94rem] font-semibold text-[#fff8ec]">Welcome aboard.</p>
              <p className="mt-1 text-[0.84rem] font-medium leading-5 text-[#f4e6cc]/72">
                You&apos;re now connected to the Ractysh Enterprise Network.
              </p>
            </motion.div>
          ) : (
            <motion.form
              key="newsletter-form"
              onSubmit={handleSubmit}
              initial={shouldReduceMotion ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={shouldReduceMotion ? undefined : { opacity: 0, y: -6 }}
              transition={{ duration: 0.22, ease: motionEase }}
              className="mt-5"
              noValidate
            >
              <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
                <label className="block min-w-0">
                  <span className="sr-only">Email Address</span>
                  <input
                    required
                    disabled={state === "loading"}
                    value={email}
                    onChange={(event) => {
                      setEmail(event.target.value);
                      if (error) setError("");
                    }}
                    type="email"
                    name="email"
                    aria-invalid={Boolean(error)}
                    aria-describedby={error ? errorId : undefined}
                    placeholder="Email Address"
                    className="h-12 w-full min-w-0 rounded-[8px] border border-[#d6b45f]/22 bg-[#151515] px-4 text-[0.92rem] font-medium tracking-[0] text-[#fff8ec] outline-none transition-[border-color,box-shadow,background-color] duration-300 placeholder:text-[#f4e6cc]/34 focus:border-[#d6b45f]/82 focus:bg-[#171717] focus:shadow-[0_0_0_3px_rgba(214,180,95,0.16)] disabled:cursor-not-allowed disabled:opacity-70"
                  />
                </label>

                <motion.button
                  type="submit"
                  disabled={state === "loading"}
                  whileHover={state === "loading" || shouldReduceMotion ? undefined : { y: -2 }}
                  whileTap={shouldReduceMotion ? undefined : { scale: 0.985 }}
                  transition={{ duration: 0.22, ease: motionEase }}
                  className="group inline-flex h-12 items-center justify-center gap-2 rounded-[8px] border border-[#d6b45f]/34 bg-[#8b1118] px-5 text-[0.9rem] font-semibold tracking-[0] text-[#fff8ec] shadow-[0_12px_26px_rgba(0,0,0,0.28),0_0_18px_rgba(214,180,95,0.10)] transition-[background-color,border-color,box-shadow] duration-300 hover:border-[#d6b45f]/70 hover:bg-[#741018] hover:shadow-[0_16px_34px_rgba(0,0,0,0.36),0_0_28px_rgba(214,180,95,0.16)] disabled:cursor-default sm:min-w-[9.5rem]"
                >
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={state}
                      initial={shouldReduceMotion ? false : { opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={shouldReduceMotion ? undefined : { opacity: 0, y: -5 }}
                      transition={{ duration: 0.2, ease: motionEase }}
                      className="inline-flex items-center gap-2"
                    >
                      {state === "loading" ? (
                        <>
                          Subscribing
                          <span className="h-3.5 w-3.5 rounded-full border border-[#d6b45f]/38 border-t-[#d6b45f] motion-safe:animate-spin" />
                        </>
                      ) : (
                        <>
                          Subscribe
                          <ArrowRight className="h-4 w-4 text-[#d6b45f] transition-transform duration-300 group-hover:translate-x-1" strokeWidth={2.4} />
                        </>
                      )}
                    </motion.span>
                  </AnimatePresence>
                </motion.button>
              </div>

              <AnimatePresence>
                {error ? (
                  <motion.p
                    id={errorId}
                    initial={shouldReduceMotion ? false : { opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={shouldReduceMotion ? undefined : { opacity: 0, y: -4 }}
                    transition={{ duration: 0.2, ease: motionEase }}
                    className="mt-2 text-[0.76rem] font-semibold text-[#d6b45f]"
                  >
                    {error}
                  </motion.p>
                ) : null}
              </AnimatePresence>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {showToast ? (
          <motion.div
            key="newsletter-success-toast"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? undefined : { opacity: 0, y: 10 }}
            transition={{ duration: 0.28, ease: motionEase }}
            className="fixed bottom-5 left-4 right-4 z-50 mx-auto flex max-w-[22rem] items-start gap-3 rounded-[10px] border border-[#d6b45f]/34 bg-[#0B0B0B] px-4 py-3 text-left text-[#fff8ec] shadow-[0_18px_54px_rgba(0,0,0,0.46),0_0_26px_rgba(214,180,95,0.12)] sm:left-auto sm:right-6 sm:mx-0"
            role="status"
            aria-live="polite"
          >
            <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#d6b45f] text-[#0B0B0B]" aria-hidden="true">
              <Check className="h-4 w-4" strokeWidth={2.8} />
            </span>
            <span className="min-w-0">
              <span className="block text-[0.88rem] font-semibold leading-5">Welcome aboard.</span>
              <span className="mt-0.5 block text-[0.78rem] font-medium leading-5 text-[#f4e6cc]/72">
                You&apos;re now connected to the Ractysh Enterprise Network.
              </span>
            </span>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
