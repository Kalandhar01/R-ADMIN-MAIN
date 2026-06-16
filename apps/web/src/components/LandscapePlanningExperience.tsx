"use client";

import type { PointerEvent as ReactPointerEvent } from "react";
import { useEffect, useRef } from "react";
import { motion, type MotionValue, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { gsap } from "gsap";
import { ArrowRight, Leaf, Map, SunMedium, Trees } from "lucide-react";
import Link from "next/link";
import { CompanyContactPanel } from "@/components/CompanyContactPanel";
import { useLenis } from "@/components/providers/SmoothScrollProvider";
import { ServiceRequestCTA } from "@/components/ServiceRequestCTA";

const ease = [0.22, 1, 0.36, 1] as const;

const heroImage =
  "https://images.unsplash.com/photo-1761637822930-fb1c1a3df94d?auto=format&fit=crop&w=1600&q=88";

const philosophyItems = [
  {
    title: "Spatial Balance",
    body: "Outdoor rooms, pathways, planting and architecture are composed with quiet hierarchy and human rhythm.",
    image: "https://images.unsplash.com/photo-1761637823407-ef47925c2714?auto=format&fit=crop&w=1200&q=86"
  },
  {
    title: "Natural Integration",
    body: "Terrain, views, shade and seasonal behavior shape landscape systems that feel native to the site.",
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=86"
  },
  {
    title: "Outdoor Experience",
    body: "Arrival sequences, seating pockets, water moments and planting layers create a refined journey through space.",
    image: "https://images.unsplash.com/photo-1766603636774-5f328e0da870?auto=format&fit=crop&w=1200&q=86"
  },
  {
    title: "Environmental Harmony",
    body: "Material, maintenance and climate logic are balanced into calm, practical and long-lasting outdoor systems.",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=86"
  }
];

const showcaseImage =
  "https://images.unsplash.com/photo-1761637823407-ef47925c2714?auto=format&fit=crop&w=1800&q=88";

export function LandscapePlanningExperience() {
  const rootRef = useRef<HTMLElement>(null);
  const lenis = useLenis();
  const shouldReduceMotion = useReducedMotion();
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const smoothX = useSpring(pointerX, { damping: 36, stiffness: 110, mass: 0.8 });
  const smoothY = useSpring(pointerY, { damping: 36, stiffness: 110, mass: 0.8 });
  const heroImageX = useTransform(smoothX, [-0.5, 0.5], [-8, 8]);
  const heroImageY = useTransform(smoothY, [-0.5, 0.5], [-6, 6]);
  const foregroundX = useTransform(smoothX, [-0.5, 0.5], [10, -10]);
  const foregroundY = useTransform(smoothY, [-0.5, 0.5], [8, -8]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    let disposed = false;
    let context: gsap.Context | undefined;
    let refreshId: number | undefined;

    void import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
      if (disposed) return;

      gsap.registerPlugin(ScrollTrigger);

      context = gsap.context(() => {
      if (shouldReduceMotion) {
        gsap.set("[data-landscape-reveal]", { opacity: 1, y: 0, filter: "blur(0px)" });
        return;
      }

      gsap.utils.toArray<HTMLElement>("[data-landscape-reveal]").forEach((item, index) => {
        gsap.fromTo(
          item,
          { opacity: 0, y: 50, filter: "blur(6px)" },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 1,
            delay: Math.min(index * 0.04, 0.18),
            ease: "power4.out",
            scrollTrigger: {
              trigger: item,
              start: "top 86%",
              once: true
            }
          }
        );
      });

      gsap.to("[data-landscape-back]", {
        y: -18,
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "bottom top",
          scrub: 1.2,
          invalidateOnRefresh: true
        }
      });

      gsap.to("[data-landscape-middle]", {
        y: -34,
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "bottom top",
          scrub: 1.1,
          invalidateOnRefresh: true
        }
      });

      gsap.to("[data-landscape-front]", {
        y: -48,
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "bottom top",
          scrub: 1,
          invalidateOnRefresh: true
        }
      });

      gsap.utils.toArray<HTMLElement>("[data-landscape-image]").forEach((image) => {
        gsap.fromTo(
          image,
          { scale: 1 },
          {
            scale: 1.04,
            ease: "none",
            scrollTrigger: {
              trigger: image,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.2,
              invalidateOnRefresh: true
            }
          }
        );
      });
    }, root);

      refreshId = requestAnimationFrame(() => ScrollTrigger.refresh());
    });

    return () => {
      disposed = true;
      if (refreshId) cancelAnimationFrame(refreshId);
      context?.revert();
    };
  }, [lenis, shouldReduceMotion]);

  const handlePointerMove = (event: ReactPointerEvent<HTMLElement>) => {
    if (shouldReduceMotion) return;

    const rect = event.currentTarget.getBoundingClientRect();
    pointerX.set((event.clientX - rect.left) / rect.width - 0.5);
    pointerY.set((event.clientY - rect.top) / rect.height - 0.5);
  };

  return (
    <article
      ref={rootRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={() => {
        pointerX.set(0);
        pointerY.set(0);
      }}
      className="relative isolate z-0 overflow-hidden bg-[#F8F6F1] text-[#201c17]"
    >
      <div
        data-landscape-back
        className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_72%_18%,rgba(214,180,95,0.14),transparent_30rem),radial-gradient(circle_at_18%_78%,rgba(109,132,91,0.12),transparent_34rem),linear-gradient(180deg,#F8F6F1_0%,#F3F0E8_52%,#EDE7DA_100%)] will-change-transform"
        aria-hidden
      />
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.08] [background-image:radial-gradient(circle,rgba(32,28,23,0.42)_1px,transparent_1px)] [background-size:18px_18px]"
        aria-hidden
      />

      <HeroSection
        heroImageX={heroImageX}
        heroImageY={heroImageY}
        foregroundX={foregroundX}
        foregroundY={foregroundY}
        shouldReduceMotion={Boolean(shouldReduceMotion)}
      />
      <PhilosophySection />
      <ShowcaseSection />
      <LandscapeCTA />
    </article>
  );
}

function HeroSection({
  heroImageX,
  heroImageY,
  foregroundX,
  foregroundY,
  shouldReduceMotion
}: {
  heroImageX: MotionValue<number>;
  heroImageY: MotionValue<number>;
  foregroundX: MotionValue<number>;
  foregroundY: MotionValue<number>;
  shouldReduceMotion: boolean;
}) {
  return (
    <section className="relative z-10 flex min-h-[100svh] items-center px-5 pb-16 pt-28 sm:px-6 md:px-8 lg:pt-32">
      <div className="mx-auto grid w-full max-w-[1240px] gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center xl:gap-20">
        <div className="max-w-[42rem]">
          <motion.p
            initial={{ opacity: 0, y: 50, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1, ease }}
            className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-[#6f7f54]"
          >
            Landscape Systems
          </motion.p>
          <h1 className="mt-6 font-display text-[clamp(2.9rem,5.4vw,5.9rem)] font-semibold leading-[0.94] tracking-[-0.045em] text-[#191611]">
            {["Designing landscapes", "that breathe with", "modern architecture."].map((line, index) => (
              <motion.span
                key={line}
                initial={{ opacity: 0, y: 50, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 1, delay: 0.1 + index * 0.12, ease }}
                className="block"
              >
                {line}
              </motion.span>
            ))}
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 50, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1, delay: 0.5, ease }}
            className="mt-7 max-w-[36rem] text-[1rem] leading-7 text-[#5e574d] md:text-[1.08rem]"
          >
            Premium outdoor planning, environmental balance and spatial landscape systems designed for elegant
            residential and commercial ecosystems.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 50, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1, delay: 0.64, ease }}
            className="mt-9 flex flex-col gap-3 sm:flex-row"
          >
            <Link
              href="#landscape-philosophy"
              className="group inline-flex min-h-[3rem] items-center justify-center gap-2 rounded-[0.62rem] bg-[#171411] px-5 text-[0.92rem] font-semibold text-[#fffaf0] shadow-[0_16px_38px_rgba(42,35,25,0.16)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_48px_rgba(42,35,25,0.2)]"
            >
              Explore Landscape
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link
              href="#landscape-showcase"
              className="group inline-flex min-h-[3rem] items-center justify-center gap-2 rounded-[0.62rem] border border-[#d7cdb8] bg-[#fffaf0]/58 px-5 text-[0.92rem] font-semibold text-[#201c17] shadow-[0_14px_34px_rgba(90,77,55,0.08)] transition duration-300 hover:-translate-y-1 hover:border-[#c4b183] hover:bg-[#fffdf7]"
            >
              View Concepts
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>

        <motion.div
          data-landscape-middle
          initial={{ opacity: 0, y: 54, scale: 0.985 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.1, delay: 0.22, ease }}
          className="relative min-h-[32rem] overflow-hidden rounded-[1.6rem] border border-[#e0d5be] bg-[#efe8da] shadow-[0_34px_100px_rgba(73,66,48,0.14)] will-change-transform sm:min-h-[40rem]"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_18%,rgba(255,251,239,0.74),transparent_28rem),linear-gradient(180deg,rgba(248,246,241,0.08),rgba(44,55,33,0.28))]" />
          <motion.img
            src={heroImage}
            alt="Modern architectural landscape garden with natural greenery"
            decoding="async"
            loading="eager"
            className="absolute inset-0 h-full w-full object-cover opacity-[0.9] will-change-transform"
            style={shouldReduceMotion ? undefined : { x: heroImageX, y: heroImageY, scale: 1.035 }}
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(248,246,241,0.1),transparent_34%,rgba(24,28,18,0.48)),linear-gradient(90deg,rgba(248,246,241,0.5),transparent_42%)]" />
          <div
            data-landscape-front
            className="absolute inset-x-0 bottom-0 h-[42%] bg-[linear-gradient(0deg,rgba(18,30,16,0.48),transparent_72%)] will-change-transform"
          />
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-[34%] opacity-50 will-change-transform"
            style={shouldReduceMotion ? undefined : { x: foregroundX, y: foregroundY }}
            aria-hidden
          >
            <span className="absolute bottom-[-18%] left-[6%] h-[16rem] w-[5rem] rounded-t-full bg-[#22311e]/34" />
            <span className="absolute bottom-[-22%] left-[22%] h-[12rem] w-[3.5rem] rounded-t-full bg-[#2e4326]/26" />
            <span className="absolute bottom-[-20%] right-[12%] h-[14rem] w-[4.5rem] rounded-t-full bg-[#26391f]/32" />
          </motion.div>
          <div className="absolute bottom-6 left-6 right-6 flex flex-col gap-3 rounded-[1rem] border border-white/24 bg-[#f8f6f1]/72 p-4 text-[#201c17] shadow-[0_18px_48px_rgba(35,35,24,0.12)] sm:left-auto sm:w-[21rem]">
            <p className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-[#6f7f54]">
              Site Atmosphere
            </p>
            <div className="flex items-center justify-between gap-4">
              <span className="font-display text-[1.45rem] font-semibold tracking-[-0.03em]">Terrain, shade, flow.</span>
              <Leaf className="h-5 w-5 shrink-0 text-[#6f7f54]" strokeWidth={1.7} />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function PhilosophySection() {
  return (
    <section id="landscape-philosophy" className="relative z-10 px-5 py-20 sm:px-6 md:px-8 lg:py-28">
      <div className="mx-auto max-w-[1240px]">
        <div data-landscape-reveal className="max-w-[48rem]">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-[#6f7f54]">
            Landscape Philosophy
          </p>
          <h2 className="mt-5 font-display text-[clamp(2.3rem,4.5vw,4.8rem)] font-semibold leading-[0.98] tracking-[-0.045em]">
            Quiet outdoor systems shaped around architecture, climate and human calm.
          </h2>
        </div>

        <div className="mt-14 grid gap-16 lg:mt-20 lg:gap-24">
          {philosophyItems.map((item, index) => (
            <article
              key={item.title}
              className="grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-14"
              data-landscape-reveal
            >
              <div className={index % 2 ? "lg:order-2" : undefined}>
                <div className="relative aspect-[4/3] overflow-hidden rounded-[1.25rem] border border-[#dfd5c2] bg-[#EDE7DA] shadow-[0_24px_70px_rgba(73,66,48,0.11)]">
                  <img
                    data-landscape-image
                    src={item.image}
                    alt={`${item.title} landscape planning reference`}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover will-change-transform"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(248,246,241,0.04),rgba(32,42,24,0.22))]" />
                </div>
              </div>
              <div className="max-w-[33rem]">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[#9b8b63]">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-4 font-display text-[clamp(2rem,3vw,3.4rem)] font-semibold leading-[1] tracking-[-0.04em]">
                  {item.title}
                </h3>
                <p className="mt-5 text-[1rem] leading-7 text-[#625b51] md:text-[1.06rem]">{item.body}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ShowcaseSection() {
  return (
    <section id="landscape-showcase" className="relative z-10 px-5 py-16 sm:px-6 md:px-8 lg:py-24">
      <div data-landscape-reveal className="mx-auto max-w-[1240px]">
        <div className="relative min-h-[70vh] overflow-hidden rounded-[1.6rem] border border-[#dfd5c2] bg-[#EDE7DA] shadow-[0_34px_100px_rgba(73,66,48,0.14)]">
          <img
            data-landscape-image
            src={showcaseImage}
            alt="Cinematic landscape with water, greenery and natural light"
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover will-change-transform"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(20,24,15,0.58),rgba(20,24,15,0.18)_44%,rgba(248,246,241,0.08)),linear-gradient(0deg,rgba(18,22,14,0.42),transparent_52%)]" />
          <div className="absolute left-5 top-5 rounded-full border border-white/42 bg-[#f8f6f1]/88 px-4 py-2 text-[0.64rem] font-semibold uppercase tracking-[0.2em] text-[#3f4e2d] shadow-[0_14px_34px_rgba(35,35,24,0.1)] md:left-8 md:top-8">
            Premium Outdoor System
          </div>
          <div className="absolute bottom-6 left-5 right-5 max-w-[42rem] text-[#fffaf0] md:bottom-9 md:left-8">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-[#ddd0a9]">
              Cinematic Landscape Integration
            </p>
            <h2 className="mt-4 font-display text-[clamp(2.4rem,4.4vw,5rem)] font-semibold leading-[0.95] tracking-[-0.045em]">
              A quiet composition of light, movement and living texture.
            </h2>
          </div>
          <div className="absolute bottom-6 right-5 hidden w-[18rem] rounded-[1rem] border border-white/42 bg-[#f8f6f1]/92 p-4 text-[#201c17] shadow-[0_16px_44px_rgba(35,35,24,0.14)] lg:block">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e8dec7] text-[#6f7f54]">
                <Trees className="h-5 w-5" strokeWidth={1.7} />
              </span>
              <div>
                <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-[#6f7f54]">Site Logic</p>
                <p className="mt-1 text-sm font-semibold">Shade, path, water and pause.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function LandscapeCTA() {
  return (
    <section className="relative z-10 px-5 py-20 sm:px-6 md:px-8 lg:py-28">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_50%_0%,rgba(214,180,95,0.14),transparent_34rem)]" />
      <div data-landscape-reveal className="mx-auto max-w-[820px] text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-[#d6c7a8] bg-[#fffaf0]/64 text-[#6f7f54] shadow-[0_14px_34px_rgba(73,66,48,0.08)]">
          <SunMedium className="h-5 w-5" strokeWidth={1.7} />
        </div>
        <h2 className="mt-7 font-display text-[clamp(2.4rem,4.4vw,5rem)] font-semibold leading-[0.96] tracking-[-0.045em]">
          Shape environments that feel timeless.
        </h2>
        <p className="mx-auto mt-6 max-w-[34rem] text-[1rem] leading-7 text-[#625b51]">
          Bring architectural clarity, environmental sensitivity and premium outdoor experience into one composed
          landscape plan.
        </p>
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/book-consultation"
            className="group inline-flex min-h-[3rem] items-center justify-center gap-2 rounded-[0.62rem] bg-[#171411] px-5 text-[0.92rem] font-semibold text-[#fffaf0] shadow-[0_16px_38px_rgba(42,35,25,0.16)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_48px_rgba(42,35,25,0.2)]"
          >
            Start Landscape Planning
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
          <ServiceRequestCTA className="items-center" showLabel={false} />
          <Link
            href="/contact"
            className="group inline-flex min-h-[3rem] items-center justify-center gap-2 rounded-[0.62rem] border border-[#d7cdb8] bg-[#fffaf0]/58 px-5 text-[0.92rem] font-semibold text-[#201c17] shadow-[0_14px_34px_rgba(90,77,55,0.08)] transition duration-300 hover:-translate-y-1 hover:border-[#c4b183] hover:bg-[#fffdf7]"
          >
            Contact Studio
            <Map className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
        <CompanyContactPanel mode="consultation" tone="transparent" compact className="mx-auto mt-6 max-w-4xl" />
      </div>
    </section>
  );
}
