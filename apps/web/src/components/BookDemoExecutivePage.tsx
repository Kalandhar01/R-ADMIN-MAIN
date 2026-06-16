"use client";

import type { FormEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, CalendarCheck, CheckCircle2, Network, Send } from "lucide-react";
import Link from "next/link";
import { useLenis } from "@/components/providers/SmoothScrollProvider";
import { PremiumSelect } from "@/components/ui/PremiumSelect";

gsap.registerPlugin(ScrollTrigger);

const ease = [0.22, 1, 0.36, 1] as const;

const flowSteps = ["Request", "Review", "Executive Coordination", "Private Discussion"];
const discussionTopicOptions = [
  "Architecture Division",
  "Construction Division",
  "Real Estate Division",
  "Export & Import Division",
  "OTC Exchange Division"
].map((topic) => ({ value: topic, label: topic }));

export function BookDemoExecutivePage() {
  const rootRef = useRef<HTMLElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reduceMotion = useReducedMotion();
  const lenis = useLenis();
  const [isReady, setIsReady] = useState(false);
  const [submitState, setSubmitState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [submitError, setSubmitError] = useState("");
  const [discussionTopic, setDiscussionTopic] = useState(discussionTopicOptions[0].value);

  useEffect(() => {
    setIsReady(true);
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const context = gsap.context(() => {
      const revealItems = gsap.utils.toArray<HTMLElement>("[data-demo-reveal]", root);

      if (reduceMotion) {
        gsap.set(revealItems, { opacity: 1, y: 0 });
        return;
      }

      gsap.fromTo(
        revealItems,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.06,
          ease: "power4.out",
          scrollTrigger: {
            trigger: root,
            start: "top 86%"
          }
        }
      );

      gsap.to("[data-demo-glow]", {
        xPercent: 5,
        yPercent: -4,
        opacity: 0.8,
        duration: 14,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    }, root);

    const refreshId = requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      cancelAnimationFrame(refreshId);
      context.revert();
    };
  }, [lenis, reduceMotion]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    setSubmitState("loading");
    setSubmitError("");

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    try {
      const response = await fetch("/api/book-demo", {
        method: "POST",
        body: new FormData(form)
      });
      const result = (await response.json().catch(() => null)) as { message?: string } | null;

      if (!response.ok) {
        throw new Error(result?.message || "Unable to route demo request. Please try again.");
      }

      setSubmitState("success");
      form.reset();
      timeoutRef.current = setTimeout(() => setSubmitState("idle"), 5200);
    } catch (error) {
      setSubmitState("error");
      setSubmitError(error instanceof Error ? error.message : "Unable to route demo request. Please try again.");
    }
  };

  return (
    <main ref={rootRef} className="relative isolate overflow-hidden bg-[#F8F6F1] text-[#181512]">
      <BookDemoAtmosphere />

      <section className="relative z-10 flex min-h-[92svh] items-center px-5 pb-16 pt-28 sm:px-6 md:px-8 lg:pt-32">
        <div className="mx-auto flex w-full max-w-[980px] flex-col items-center text-center">
          <motion.div
            data-demo-reveal
            animate={reduceMotion ? undefined : { y: [0, -7, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="book-demo-ring relative mb-8 flex h-[8.5rem] w-[8.5rem] items-center justify-center sm:h-[10rem] sm:w-[10rem]"
            aria-hidden="true"
          >
            <span className="absolute inset-2 rounded-full border border-[#d6b45f]/28" />
            <span className="absolute inset-7 rounded-full border border-[#181512]/10" />
            <span className="book-demo-ring-line absolute left-1/2 top-1/2 h-px w-[78%] -translate-x-1/2 -translate-y-1/2 bg-[linear-gradient(90deg,transparent,rgba(154,116,40,0.6),transparent)]" />
            <span className="relative flex h-14 w-14 items-center justify-center rounded-full border border-[#d6b45f]/30 bg-[#fffdf8]/70 text-[#9A7428] shadow-[0_18px_48px_rgba(98,78,34,0.12)]">
              <CalendarCheck className="h-6 w-6" strokeWidth={1.75} />
            </span>
          </motion.div>

          <p data-demo-reveal className="text-[0.72rem] font-semibold uppercase tracking-[0.3em] text-[#9A7428]">
            Private Consultation
          </p>

          <h1
            data-demo-reveal
            className="mt-5 max-w-[820px] font-display text-[clamp(3.2rem,7vw,6.7rem)] font-[650] leading-[0.9] tracking-[-0.055em] text-[#181512]"
          >
            Book a private{" "}
            <span className="block text-[#74675b]">enterprise discussion.</span>
          </h1>

          <p
            data-demo-reveal
            className="mt-6 max-w-[620px] text-[1rem] font-medium leading-7 text-[#665f55] md:text-[1.08rem]"
          >
            Connect with the Ractysh ecosystem for Architecture, Construction, Real Estate, Export-Import and OTC Exchange
            planning.
          </p>

          <div data-demo-reveal className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="#booking-form"
              className="group inline-flex min-h-[3.05rem] items-center justify-center gap-2.5 rounded-[0.65rem] border border-[#181512]/10 bg-[#090807] px-5 text-[0.9rem] font-semibold text-[#fff8ec] shadow-[0_18px_48px_rgba(24,21,18,0.18)] transition-[box-shadow,transform] duration-300 hover:-translate-y-1 hover:shadow-[0_22px_58px_rgba(24,21,18,0.24),0_0_34px_rgba(214,180,95,0.16)]"
            >
              Schedule Demo
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link
              href="/business"
              className="group inline-flex min-h-[3.05rem] items-center justify-center gap-2.5 rounded-[0.65rem] border border-[#d6b45f]/30 bg-[#fffdf8]/68 px-5 text-[0.9rem] font-semibold text-[#181512] shadow-[0_16px_44px_rgba(98,78,34,0.08),inset_0_1px_0_rgba(255,255,255,0.88)] transition-[box-shadow,background-color,transform] duration-300 hover:-translate-y-1 hover:bg-white/80 hover:shadow-[0_22px_56px_rgba(98,78,34,0.12)]"
            >
              Explore Ecosystem
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      <section id="booking-form" className="relative z-10 px-5 py-14 sm:px-6 md:px-8 lg:py-20">
        <div className="mx-auto grid max-w-[1120px] gap-8 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:items-start">
          <div data-demo-reveal className="max-w-[32rem]">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.26em] text-[#9A7428]">Booking Desk</p>
            <h2 className="mt-5 font-display text-[clamp(2.4rem,4.8vw,4.9rem)] font-[650] leading-[0.92] tracking-[-0.052em] text-[#181512]">
              A calm intake for focused executive review.
            </h2>
            <p className="mt-6 text-[1rem] leading-7 text-[#665f55]">
              Share only the essentials. The Ractysh team will review the request and coordinate the right discussion path.
            </p>
          </div>

          <motion.form
            data-demo-reveal
            onSubmit={handleSubmit}
            className="relative overflow-hidden rounded-[1.45rem] border border-[#d8c99d]/58 bg-[#fffdf8]/72 p-5 shadow-[0_30px_90px_rgba(82,61,32,0.11),inset_0_1px_0_rgba(255,255,255,0.9)] md:p-6"
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_86%_10%,rgba(214,180,95,0.13),transparent_24rem)]" />
            <div className="relative z-10 grid gap-4 md:grid-cols-2">
              <Field label="Name" name="name" placeholder="Your name" required />
              <Field label="Email" name="email" type="email" placeholder="you@company.com" required />
              <Field label="Company" name="company" placeholder="Company or organization" />
              <label className="block">
                <span className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[#9A7428]">
                  Discussion Topic
                </span>
                <input type="hidden" name="discussionTopic" value={discussionTopic} />
                <PremiumSelect
                  id="discussionTopic"
                  className="premium-select-standalone mt-2"
                  value={discussionTopic}
                  placeholder="Select discussion topic"
                  options={discussionTopicOptions}
                  onChange={setDiscussionTopic}
                />
              </label>

              <div className="mt-2 flex flex-col gap-4 md:col-span-2 sm:flex-row sm:items-center">
                <button
                  type="submit"
                  disabled={!isReady || submitState === "loading"}
                  aria-busy={submitState === "loading"}
                  className="group relative inline-flex min-h-[3.05rem] items-center justify-center gap-2.5 overflow-hidden rounded-[0.65rem] border border-[#181512]/10 bg-[#090807] px-5 text-[0.9rem] font-semibold text-[#fff8ec] shadow-[0_18px_48px_rgba(24,21,18,0.16)] transition-[box-shadow,transform,opacity] duration-300 hover:-translate-y-1 hover:shadow-[0_22px_58px_rgba(24,21,18,0.22),0_0_34px_rgba(214,180,95,0.16)] disabled:cursor-wait disabled:opacity-80"
                >
                  <span
                    className={`absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(214,180,95,0.22),transparent_62%)] transition-opacity duration-300 ${
                      submitState === "loading" ? "opacity-100" : "opacity-0"
                    }`}
                  />
                  <span className="relative">
                    {submitState === "loading" ? "Requesting" : "Request Executive Call"}
                  </span>
                  {submitState === "loading" ? (
                    <span className="relative h-4 w-4 rounded-full border border-[#fff8ec]/30 border-t-[#fff8ec] animate-spin" />
                  ) : (
                    <Send className="relative h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                  )}
                </button>

                {submitState === "success" ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.48, ease }}
                    className="flex items-center gap-3 rounded-full border border-[#d6b45f]/30 bg-[#fffdf8]/80 px-4 py-2.5 text-[0.86rem] font-semibold text-[#4f463e] shadow-[0_16px_44px_rgba(98,78,34,0.08)]"
                  >
                    <span className="book-demo-success flex h-7 w-7 items-center justify-center rounded-full bg-[#181512] text-[#fff8ec]">
                      <CheckCircle2 className="h-4 w-4" strokeWidth={2} />
                    </span>
                    Your consultation request has been received.
                  </motion.div>
                ) : null}
                {submitState === "error" ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.42, ease }}
                    className="rounded-full border border-red-200 bg-red-50 px-4 py-2.5 text-[0.84rem] font-semibold text-red-700"
                  >
                    {submitError}
                  </motion.div>
                ) : null}
              </div>
            </div>
          </motion.form>
        </div>
      </section>

      <section className="relative z-10 px-5 py-12 sm:px-6 md:px-8 lg:py-16">
        <div data-demo-reveal className="mx-auto max-w-[1120px] rounded-[1.25rem] border border-[#d8c99d]/52 bg-[#fffdf8]/62 p-5 shadow-[0_24px_70px_rgba(82,61,32,0.08),inset_0_1px_0_rgba(255,255,255,0.86)] md:p-6">
          <div className="book-demo-flow-line relative grid gap-4 md:grid-cols-4">
            {flowSteps.map((step, index) => (
              <div key={step} className="relative">
                <span className="book-demo-flow-node flex h-9 w-9 items-center justify-center rounded-full bg-[#181512] text-[0.75rem] font-semibold text-[#fff8ec]">
                  0{index + 1}
                </span>
                <h3 className="mt-5 font-display text-[1rem] font-medium tracking-tight text-[#181512]">{step}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 px-5 pb-24 pt-10 sm:px-6 md:px-8 lg:pb-28">
        <div data-demo-reveal className="mx-auto max-w-[820px] text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-[0.9rem] border border-[#d6b45f]/24 bg-[#fffdf8]/70 text-[#9A7428] shadow-[0_16px_40px_rgba(98,78,34,0.09)]">
            <Network className="h-5 w-5" strokeWidth={1.8} />
          </div>
          <h2 className="mt-6 font-display text-[clamp(2.45rem,5vw,5.4rem)] font-[650] leading-[0.92] tracking-[-0.052em] text-[#181512]">
            Structured conversations begin here.
          </h2>
        </div>
      </section>
    </main>
  );
}

function BookDemoAtmosphere() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#FFFDFC_0%,#F8F6F1_48%,#F5F2EB_100%)]" />
      <div
        data-demo-glow
        className="absolute left-1/2 top-[18rem] h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(214,180,95,0.18),rgba(255,253,252,0.38)_42%,transparent_72%)] opacity-70"
      />
      <div className="book-demo-grid absolute -inset-20 opacity-[0.44]" />
      <div className="book-demo-grain absolute inset-0 opacity-[0.18]" />
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
  required
}: {
  label: string;
  name: string;
  type?: string;
  placeholder: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[#9A7428]">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="mt-2 h-12 w-full rounded-[0.75rem] border border-[#d8c99d]/72 bg-[#fffaf0]/76 px-4 text-[0.94rem] font-medium text-[#201714] outline-none transition-[border-color,box-shadow,background-color,transform] duration-300 placeholder:text-[#9a8d7f] focus:-translate-y-0.5 focus:border-[#d6b45f] focus:bg-white focus:shadow-[0_0_0_4px_rgba(214,180,95,0.12),0_14px_34px_rgba(98,78,34,0.08)]"
      />
    </label>
  );
}
