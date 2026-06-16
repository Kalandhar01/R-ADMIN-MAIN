"use client";

import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, CalendarCheck } from "lucide-react";
import Link from "next/link";
import { CompanyContactPanel } from "@/components/CompanyContactPanel";
import { useLenis } from "@/components/providers/SmoothScrollProvider";
import type { PremiumServicePageData } from "@/data/servicePages";

gsap.registerPlugin(ScrollTrigger);

const ease = [0.22, 1, 0.36, 1] as const;

const serviceIcons = [
  "M12 3L2 12h3v8h6v-6h2v6h6v-8h3L12 3z",
  "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"
];

export function ServiceDetailPage({ service }: { service: PremiumServicePageData }) {
  const rootRef = useRef<HTMLElement>(null);
  const lenis = useLenis();
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const context = gsap.context(() => {
      const shouldReduce = Boolean(reduceMotion) || window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (shouldReduce) {
        gsap.set("[data-sd-reveal]", { clearProps: "all" });
        gsap.set("[data-sd-mask]", { clearProps: "all" });
        return;
      }

      gsap.utils.toArray<HTMLElement>("[data-sd-reveal]").forEach((item) => {
        gsap.fromTo(
          item,
          { opacity: 0, y: 48 },
          {
            opacity: 1,
            y: 0,
            duration: 0.95,
            ease: "power4.out",
            scrollTrigger: { trigger: item, start: "top 84%" }
          }
        );
      });

      gsap.utils.toArray<HTMLElement>("[data-sd-mask]").forEach((item) => {
        gsap.fromTo(
          item,
          { clipPath: "inset(0 0 100% 0)", scale: 1.04 },
          {
            clipPath: "inset(0 0 0% 0)",
            scale: 1,
            duration: 1.2,
            ease: "power4.out",
            scrollTrigger: { trigger: item, start: "top 80%" }
          }
        );
      });
    }, root);

    return () => context.revert();
  }, [lenis, reduceMotion]);

  return (
    <article ref={rootRef} className="overflow-hidden bg-[#fffefa] text-[#15110d]">
      <section className="relative isolate flex min-h-[85svh] items-center overflow-hidden px-5 pb-14 pt-28 md:px-8 lg:pt-32">
        <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_16%,rgba(184,138,68,0.065),transparent_30rem),radial-gradient(circle_at_82%_18%,rgba(139,14,20,0.016),transparent_28rem),linear-gradient(180deg,#fffefa,#fff9f1)]" />
          <div className="absolute inset-[-10%] opacity-[0.024] [background-image:linear-gradient(rgba(76,58,31,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(76,58,31,0.085)_1px,transparent_1px)] [background-size:64px_64px]" />
        </div>

        <div className="relative z-10 mx-auto grid w-full max-w-[1480px] gap-10 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1fr)] lg:items-center">
          <div className="max-w-[42rem]">
            <motion.p
              initial={{ opacity: 0, y: 36 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease }}
              className="text-xs font-semibold uppercase tracking-[0.28em] text-[#8B0E14]"
            >
              RACTYSH {service.eyebrow.toUpperCase()}
            </motion.p>

            <h1 className="mt-6 overflow-hidden font-display text-5xl font-semibold leading-[0.88] tracking-normal text-[#111111] sm:text-6xl lg:text-7xl xl:text-8xl">
              {service.titleLines.map((line, i) => (
                <span
                  key={line}
                  data-sd-reveal
                  className={`block ${i === service.titleLines.length - 1 ? "text-[#8B0E14] [text-shadow:0_18px_52px_rgba(139,14,20,0.16)]" : ""}`}
                >
                  {line}
                </span>
              ))}
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 42 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.05, delay: 0.34, ease }}
              className="mt-7 max-w-[34rem] text-base font-medium leading-8 text-[#5f554a] md:text-lg"
            >
              {service.summary}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 42 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.05, delay: 0.48, ease }}
              className="mt-9 flex flex-col gap-3 sm:flex-row"
            >
              <Link
                href="/book-consultation"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[8px] border border-[#8B0E14] bg-[#8B0E14] px-5 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-[#fff8ec] shadow-[0_18px_44px_rgba(139,14,20,0.2)] transition hover:-translate-y-0.5 hover:bg-[#741016]"
              >
                Start Your Project
                <CalendarCheck className="h-4 w-4" />
              </Link>
              <Link
                href="#capabilities"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[8px] border border-[#d8bf82] bg-white/62 px-5 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-[#17120f] transition hover:-translate-y-0.5 hover:border-[#8B0E14]"
              >
                View Capabilities
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>

            <div data-sd-reveal className="mt-12 hidden max-w-[34rem] grid-cols-3 border-y border-[#d7bd7a]/44 py-5 md:grid">
              {service.metrics.map((metric) => (
                <div key={metric.label} className="border-r border-[#d7bd7a]/34 last:border-r-0 last:pl-5 [&:not(:first-child)]:pl-5">
                  <p className="text-[0.63rem] font-semibold uppercase leading-none tracking-[0.18em] text-[#8b1118]/70">{metric.label}</p>
                  <p className="mt-3 font-display text-[1.35rem] font-semibold leading-none tracking-[0] text-[#221611]">{metric.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div
            data-sd-mask
            className="relative flex min-h-[26rem] items-center justify-center overflow-hidden rounded-[28px] border border-[#d8bf82]/62 bg-[#fffdf8] shadow-[0_46px_128px_rgba(72,50,25,0.16)] lg:min-h-[32rem]"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(184,138,68,0.08),transparent_20rem)]" />
            <div className="absolute inset-0 opacity-[0.032] [background-image:linear-gradient(rgba(76,58,31,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(76,58,31,0.1)_1px,transparent_1px)] [background-size:32px_32px]" />
            <svg className="h-32 w-32 text-[#d8bf82]/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              {serviceIcons.map((d, i) => (
                <path key={i} d={d} strokeLinecap="round" strokeLinejoin="round" />
              ))}
            </svg>
            <div className="absolute bottom-6 left-6 rounded-[8px] border border-[#d8b765]/36 bg-[#12090a]/52 px-4 py-3 text-[#fff8ec] shadow-[0_18px_48px_rgba(0,0,0,0.22)] backdrop-blur-xl">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#d8b765]">{service.eyebrow} Studio</span>
            </div>
          </div>
        </div>
      </section>

      <section id="capabilities" className="relative overflow-hidden bg-[#fffdf8] px-5 py-20 md:px-8 lg:py-28">
        <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(184,138,68,0.05),transparent_28rem),linear-gradient(180deg,#fffefa,#fff8ee)]" />
        </div>

        <div className="mx-auto max-w-[1480px]">
          <div data-sd-reveal className="mb-12 grid gap-6 lg:grid-cols-[minmax(0,0.48fr)_minmax(0,0.52fr)] lg:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#8B0E14]">
                Design Capabilities
              </p>
              <h2 className="mt-5 max-w-[43rem] font-display text-4xl font-black leading-[0.98] tracking-normal text-[#15110d] md:text-5xl xl:text-6xl">
                Capabilities. Workflow. Delivery.
              </h2>
            </div>
            <p className="max-w-[35rem] text-base font-medium leading-8 text-[#665b50] md:text-lg">
              {service.capabilities.length} core capabilities designed around premium project delivery.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {service.capabilities.map((cap, index) => (
              <motion.article
                key={cap.title}
                data-sd-reveal
                whileHover={{ y: -6 }}
                transition={{ duration: 0.5, ease }}
                className="group rounded-[8px] border border-[#d8bf82] bg-[#fffaf0] p-6 shadow-[0_8px_34px_rgba(54,34,16,0.08)] transition-shadow hover:shadow-[0_22px_64px_rgba(54,34,16,0.14)] md:p-8"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#d8b765]/30 bg-[#8B0E14]/8 text-[#8B0E14] text-lg font-display font-bold">
                  {String(index + 1).padStart(2, "0")}
                </div>
                <h3 className="mt-6 font-display text-2xl font-semibold leading-none tracking-normal text-[#15110d] md:text-3xl">
                  {cap.title}
                </h3>
                <p className="mt-4 text-base font-medium leading-7 text-[#62564c]">
                  {cap.body}
                </p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#fffefa] px-5 py-20 md:px-8 lg:py-28">
        <div className="mx-auto max-w-[1480px]">
          <div data-sd-reveal className="mb-14 grid gap-8 lg:grid-cols-[minmax(0,0.45fr)_minmax(0,0.55fr)] lg:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#8B0E14]">
                Design Process
              </p>
              <h2 className="mt-5 font-display text-5xl font-black leading-[0.95] tracking-normal text-[#15110d] md:text-7xl">
                From brief to delivery.
              </h2>
            </div>
            <p className="max-w-[34rem] text-base font-medium leading-8 text-[#665b50] md:text-lg">
              A structured workflow that keeps clarity, coordination and quality aligned from start to finish.
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-[1.35rem] top-0 h-full w-px bg-[#d8bf82]/40 md:left-[1.85rem]" aria-hidden />
            <div className="flex flex-col gap-12">
              {service.workflow.map((step) => (
                <div key={step.title} data-sd-reveal className="relative pl-14 md:pl-16">
                  <div className="absolute left-0 top-1 flex h-10 w-10 items-center justify-center rounded-full border border-[#d8b765]/30 bg-[#fffaf0] text-xs font-semibold text-[#8B0E14] md:h-12 md:w-12">
                    {step.label}
                  </div>
                  <div>
                    <h3 className="font-display text-2xl font-semibold leading-none tracking-normal text-[#15110d] md:text-3xl">
                      {step.title}
                    </h3>
                    <p className="mt-3 max-w-[38rem] text-base font-medium leading-7 text-[#62564c]">
                      {step.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden px-5 py-20 md:px-8 lg:py-28">
        <div data-sd-mask className="relative mx-auto min-h-[34rem] max-w-[1480px] overflow-hidden rounded-[8px] border border-[#d8b765]/28 bg-[#13090b] px-6 py-10 text-[#fff8ec] shadow-[0_44px_140px_rgba(52,29,15,0.24)] md:px-10 md:py-14 lg:px-14">
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(13,8,8,0.92),rgba(13,8,8,0.52)_52%,rgba(13,8,8,0.78)),radial-gradient(circle_at_76%_24%,rgba(216,183,101,0.2),transparent_30rem)]" />
          <div className="relative z-10 flex min-h-[26rem] max-w-[48rem] flex-col justify-end">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#d8b765]">
              {service.eyebrow} Consultation
            </p>
            <h2 className="mt-5 font-display text-5xl font-black leading-[0.92] tracking-normal text-[#fff8ec] md:text-7xl">
              {service.ctaTitle}
            </h2>
            <p className="mt-6 max-w-[34rem] text-base font-medium leading-8 text-[#fff8ec]/72 md:text-lg">
              {service.ctaBody}
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/book-consultation"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[8px] border border-[#8B0E14] bg-[#8B0E14] px-5 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-[#fff8ec] shadow-[0_18px_44px_rgba(139,14,20,0.2)] transition hover:-translate-y-0.5 hover:bg-[#741016]"
              >
                Book Consultation
                <CalendarCheck className="h-4 w-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[8px] border border-[#d8b765] bg-[#fffaf0] px-5 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-[#17120f] transition hover:-translate-y-0.5 hover:bg-white"
              >
                Contact Service Desk
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <CompanyContactPanel mode="consultation" tone="dark" compact className="mt-6 max-w-4xl" />
          </div>
        </div>
      </section>
    </article>
  );
}
