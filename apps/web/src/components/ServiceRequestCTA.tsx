"use client";

import type { FormEvent } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Check, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { CompanyContactPanel } from "@/components/CompanyContactPanel";
import { cn } from "@/lib/utils";
import { getServiceRequestService, normalizeServiceRequestRoute } from "@/lib/serviceRequestRoutes";

const ease = [0.22, 1, 0.36, 1] as const;
const successMessage = "Your request has been securely delivered to the Ractysh enterprise desk.";
const modalInputClass =
  "mt-2.5 h-12 w-full rounded-[15px] border border-[#d8c596]/60 bg-[#fffaf0]/62 px-4 text-[0.95rem] font-medium text-[#17120f] shadow-[inset_0_1px_0_rgba(255,255,255,0.68),0_10px_24px_rgba(23,18,15,0.045)] outline-none backdrop-blur-[12px] transition duration-300 placeholder:text-[#6f665b]/45 focus:border-[#c9a85a]/85 focus:bg-[#fffdf7]/84 focus:shadow-[0_0_0_4px_rgba(214,180,95,0.14),0_16px_34px_rgba(23,18,15,0.08),inset_0_1px_0_rgba(255,255,255,0.82)] disabled:cursor-not-allowed disabled:opacity-60";
const modalLabelClass = "text-[0.7rem] font-bold uppercase tracking-[0.24em] text-[#51483e]/72";

type SubmitState = "idle" | "submitting" | "success" | "error";

interface ServiceRequestCTAProps {
  className?: string;
  buttonClassName?: string;
  buttonLabel?: string;
  label?: string;
  showLabel?: boolean;
}

export function ServiceRequestCTA({
  className,
  buttonClassName,
  buttonLabel = "Connect with this division",
  label = "Enterprise Desk",
  showLabel = true
}: ServiceRequestCTAProps) {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const route = useMemo(() => normalizeServiceRequestRoute(pathname), [pathname]);
  const service = useMemo(() => getServiceRequestService(route), [route]);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<SubmitState>("idle");
  const [error, setError] = useState("");
  const [portalReady, setPortalReady] = useState(false);

  const closeModal = useCallback(() => {
    if (status === "submitting") return;

    setOpen(false);

    window.setTimeout(() => {
      if (status !== "success") {
        setStatus("idle");
        setError("");
      }
    }, 240);
  }, [status]);

  useEffect(() => {
    setPortalReady(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && status !== "submitting") {
        closeModal();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeModal, open, status]);

  useEffect(() => {
    if (status !== "success") return;

    const closeTimer = window.setTimeout(() => {
      setOpen(false);
    }, 2600);

    const resetTimer = window.setTimeout(() => {
      setStatus("idle");
      setName("");
      setEmail("");
      setError("");
    }, 3000);

    return () => {
      window.clearTimeout(closeTimer);
      window.clearTimeout(resetTimer);
    };
  }, [status]);

  if (!service) return null;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!service) return;

    setStatus("submitting");
    setError("");

    try {
      const response = await fetch("/api/service-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          route,
          pageUrl: window.location.href
        })
      });
      const result = (await response.json().catch(() => ({}))) as {
        message?: string;
        request?: unknown;
        notification?: unknown;
        issues?: unknown;
      };

      if (!response.ok) {
        console.error("Service request submission failed:", {
          status: response.status,
          route,
          service,
          result
        });
        throw new Error(result.message || "Unable to deliver service request.");
      }

      setStatus("success");
    } catch (submitError) {
      console.error("Service request submission error:", submitError);
      setStatus("error");
      setError(submitError instanceof Error ? submitError.message : "Unable to deliver service request.");
    }
  }

  return (
    <>
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 12 }}
        whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.5, ease }}
        className={cn("inline-flex shrink-0 flex-col items-start gap-1.5", className)}
      >
        {showLabel ? (
          <span className="text-[0.62rem] font-semibold uppercase leading-none tracking-[0.18em] text-[#d6b45f]/80">
            {label}
          </span>
        ) : null}
        <button
          type="button"
          onClick={() => {
            setOpen(true);
            setStatus("idle");
            setError("");
          }}
          className={cn(
            "group inline-flex h-11 shrink-0 items-center justify-center gap-2.5 whitespace-nowrap rounded-[14px] border border-[#d6b45f]/42 bg-[#0f0e0c] px-5 text-[0.86rem] font-semibold text-[#fffaf0] shadow-[0_14px_34px_rgba(15,14,12,0.24),0_0_18px_rgba(214,180,95,0.12),inset_0_1px_0_rgba(255,255,255,0.08)] transition duration-300 hover:-translate-y-0.5 hover:border-[#d6b45f]/70 hover:shadow-[0_18px_44px_rgba(15,14,12,0.3),0_0_26px_rgba(214,180,95,0.24),inset_0_1px_0_rgba(255,255,255,0.12)] focus:outline-none focus:ring-2 focus:ring-[#c9a85a] focus:ring-offset-2 focus:ring-offset-transparent",
            buttonClassName
          )}
        >
          {buttonLabel}
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" strokeWidth={2.2} />
        </button>
      </motion.div>

      {portalReady
        ? createPortal(
            <AnimatePresence>
              {open ? (
                <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/[0.35] px-3 py-5 [font-family:var(--font-manrope)] backdrop-blur-[22px] backdrop-brightness-[0.78] backdrop-saturate-[0.82] sm:px-5 sm:py-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0.01 : 0.48, ease }}
            role="presentation"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                closeModal();
              }
            }}
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(214,180,95,0.12),transparent_34rem),radial-gradient(circle_at_18%_76%,rgba(255,250,239,0.08),transparent_28rem)]"
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="service-request-title"
              initial={reduceMotion ? false : { opacity: 0, y: 20, scale: 0.96 }}
              animate={reduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: 14, scale: 0.97 }}
              transition={{ duration: reduceMotion ? 0.01 : 0.62, ease }}
              className="relative w-full max-w-[560px] overflow-hidden rounded-[24px] border border-[#d8bd78]/55 bg-[linear-gradient(145deg,rgba(255,252,246,0.92),rgba(249,241,224,0.82)_54%,rgba(238,222,190,0.66))] p-5 text-[#17120f] shadow-[0_34px_110px_rgba(0,0,0,0.38),0_0_64px_rgba(214,180,95,0.16),inset_0_1px_0_rgba(255,255,255,0.76),inset_0_-1px_0_rgba(125,96,42,0.08)] outline outline-1 outline-white/35 backdrop-blur-[24px] will-change-transform sm:p-7"
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#f7d98a]/85 to-transparent"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -left-24 -top-28 h-56 w-56 rounded-full bg-[#f0d18a]/18 blur-3xl"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-32 right-0 h-64 w-64 rounded-full bg-[#17120f]/10 blur-3xl"
              />
              {reduceMotion ? null : (
                <motion.div
                  aria-hidden="true"
                  className="pointer-events-none absolute -top-24 bottom-[-20%] w-24 rotate-12 bg-gradient-to-r from-transparent via-white/22 to-transparent blur-sm"
                  initial={{ x: "-170%", opacity: 0 }}
                  animate={{ x: "720%", opacity: [0, 0.42, 0] }}
                  transition={{ duration: 5.8, repeat: Infinity, repeatDelay: 2.4, ease: "easeInOut" }}
                />
              )}

              <button
                type="button"
                onClick={closeModal}
                disabled={status === "submitting"}
                aria-label="Close service request"
                className="group absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-[#d8bd78]/50 bg-white/32 text-[#4f4438] shadow-[0_12px_28px_rgba(23,18,15,0.12),inset_0_1px_0_rgba(255,255,255,0.72)] backdrop-blur-[16px] transition duration-300 hover:-translate-y-0.5 hover:rotate-6 hover:border-[#d6b45f]/80 hover:bg-white/52 hover:text-[#17120f] hover:shadow-[0_16px_36px_rgba(23,18,15,0.16),0_0_24px_rgba(214,180,95,0.22),inset_0_1px_0_rgba(255,255,255,0.82)] focus:outline-none focus:ring-2 focus:ring-[#c9a85a]/45 disabled:cursor-not-allowed disabled:opacity-45"
              >
                <X className="h-4 w-4 transition-transform duration-300 group-hover:rotate-90" strokeWidth={1.9} />
              </button>

              <AnimatePresence mode="wait">
                {status === "success" ? (
                  <motion.div
                    key="success"
                    initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }}
                    animate={reduceMotion ? undefined : { opacity: 1, scale: 1 }}
                    exit={reduceMotion ? undefined : { opacity: 0, scale: 0.98 }}
                    transition={{ duration: reduceMotion ? 0.01 : 0.36, ease }}
                    className="relative py-8 text-center sm:py-9"
                  >
                    <motion.div
                      initial={reduceMotion ? false : { scale: 0.82, opacity: 0 }}
                      animate={reduceMotion ? undefined : { scale: 1, opacity: 1 }}
                      transition={{ duration: reduceMotion ? 0.01 : 0.42, ease }}
                      className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#d6b45f]/70 bg-[#12100e] text-[#fffaf0] shadow-[0_20px_52px_rgba(23,18,15,0.26),0_0_32px_rgba(214,180,95,0.24),inset_0_1px_0_rgba(255,255,255,0.12)]"
                    >
                      <Check className="h-7 w-7" strokeWidth={2.4} />
                    </motion.div>
                    <h3 className="mt-6 font-display text-[2rem] font-semibold leading-none text-[#17120f]">
                      Request delivered.
                    </h3>
                    <p className="mx-auto mt-3 max-w-[22rem] text-[0.95rem] leading-7 text-[#62564d]">{successMessage}</p>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    onSubmit={handleSubmit}
                    initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                    animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                    exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
                    transition={{ duration: reduceMotion ? 0.01 : 0.28, ease }}
                    className="relative space-y-5"
                  >
                    <div className="pr-10">
                      <p className="text-[0.66rem] font-extrabold uppercase leading-none tracking-[0.34em] text-[#a98234]">
                        ENTERPRISE DESK
                      </p>
                      <h2
                        id="service-request-title"
                        className="mt-3 max-w-[26rem] font-display text-[2.35rem] font-semibold leading-[0.94] tracking-normal text-[#17120f] sm:text-[2.65rem]"
                      >
                        Connect with this division.
                      </h2>
                      <div className="mt-5 inline-flex max-w-full flex-wrap items-center gap-x-2 gap-y-1 rounded-[18px] border border-[#d6b45f]/42 bg-[#fff7e7]/50 px-3.5 py-2 text-[0.68rem] font-bold uppercase text-[#7d642d] shadow-[0_10px_28px_rgba(214,180,95,0.12),inset_0_1px_0_rgba(255,255,255,0.74)] backdrop-blur-[14px] sm:rounded-full sm:text-[0.7rem]">
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#d6b45f] shadow-[0_0_14px_rgba(214,180,95,0.9)]" />
                        <span className="shrink-0 tracking-[0.2em] text-[#9a7428]">Detected service</span>
                        <span className="hidden h-3 w-px shrink-0 bg-[#d6b45f]/45 sm:block" />
                        <span className="basis-full pl-3.5 tracking-[0.16em] text-[#17120f] sm:basis-auto sm:pl-0">{service}</span>
                      </div>
                      <CompanyContactPanel mode="consultation" tone="transparent" compact className="mt-5" />
                    </div>

                    <label className="block">
                      <span className={modalLabelClass}>Name</span>
                      <input
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        disabled={status === "submitting"}
                        autoComplete="name"
                        autoFocus
                        required
                        className={modalInputClass}
                        placeholder="Your name"
                      />
                    </label>

                    <label className="block">
                      <span className={modalLabelClass}>Email</span>
                      <input
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        disabled={status === "submitting"}
                        autoComplete="email"
                        required
                        className={modalInputClass}
                        placeholder="you@example.com"
                      />
                    </label>

                    {error ? (
                      <motion.p
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-[14px] border border-[#8b1118]/20 bg-[#8b1118]/[0.07] px-3.5 py-2.5 text-sm font-semibold text-[#8b1118] shadow-[inset_0_1px_0_rgba(255,255,255,0.42)]"
                      >
                        {error}
                      </motion.p>
                    ) : null}

                    <div className="grid gap-3 pt-1 sm:grid-cols-[0.74fr_1.26fr]">
                      <button
                        type="button"
                        onClick={closeModal}
                        disabled={status === "submitting"}
                        className="inline-flex min-h-12 items-center justify-center rounded-[15px] border border-[#d8bd78]/42 bg-white/[0.16] px-5 text-[0.78rem] font-bold uppercase tracking-[0.22em] text-[#51483e]/78 shadow-[inset_0_1px_0_rgba(255,255,255,0.58)] backdrop-blur-[12px] transition duration-300 hover:-translate-y-0.5 hover:border-[#d6b45f]/70 hover:bg-white/[0.26] hover:text-[#17120f] hover:shadow-[0_14px_30px_rgba(23,18,15,0.09),0_0_18px_rgba(214,180,95,0.14),inset_0_1px_0_rgba(255,255,255,0.72)] focus:outline-none focus:ring-2 focus:ring-[#c9a85a]/40 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={status === "submitting"}
                        className="group inline-flex min-h-12 items-center justify-center gap-3 rounded-[15px] border border-[#d6b45f]/58 bg-[#11100e] px-5 text-[0.9rem] font-bold text-[#fffaf0] shadow-[0_18px_48px_rgba(15,14,12,0.26),0_0_24px_rgba(214,180,95,0.17),inset_0_1px_0_rgba(255,255,255,0.1)] transition duration-300 hover:-translate-y-1 hover:border-[#f0d18a]/75 hover:bg-[#090807] hover:shadow-[0_24px_58px_rgba(15,14,12,0.34),0_0_34px_rgba(214,180,95,0.26),inset_0_1px_0_rgba(255,255,255,0.13)] focus:outline-none focus:ring-2 focus:ring-[#c9a85a]/70 focus:ring-offset-2 focus:ring-offset-[#fffaf0] disabled:cursor-wait disabled:translate-y-0 disabled:opacity-70"
                      >
                        {status === "submitting" ? "Sending Request" : "Send Request"}
                        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={2.2} />
                      </button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
                ) : null}
            </AnimatePresence>,
            document.body
          )
        : null}
    </>
  );
}
