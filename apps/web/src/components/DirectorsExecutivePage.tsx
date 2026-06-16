"use client";

import type { PointerEvent as ReactPointerEvent } from "react";
import { useEffect, useMemo, useRef } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { DirectorProfile, FounderProfile } from "@/lib/types";

gsap.registerPlugin(ScrollTrigger);

const ease = [0.22, 1, 0.36, 1] as const;

const timeline = ["Foundation", "Expansion", "Ecosystem Growth", "Enterprise Scaling"];

interface DirectorsExecutivePageProps {
  founder: FounderProfile;
  directors: DirectorProfile[];
}

interface LeadershipProfile {
  name: string;
  role: string;
  line: string;
  image: string;
}

function executiveLine(statement: string, fallback: string) {
  const clean = statement.trim();
  if (!clean) return fallback;
  const firstSentence = clean.split(".")[0]?.trim();
  return `${firstSentence || fallback}.`;
}

export function DirectorsExecutivePage({ founder, directors }: DirectorsExecutivePageProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const smoothX = useSpring(pointerX, { damping: 34, stiffness: 120, mass: 0.85 });
  const smoothY = useSpring(pointerY, { damping: 34, stiffness: 120, mass: 0.85 });
  const portraitX = useTransform(smoothX, [-0.5, 0.5], [-10, 10]);
  const portraitRotateX = useTransform(smoothY, [-0.5, 0.5], [1.6, -1.6]);
  const portraitRotateY = useTransform(smoothX, [-0.5, 0.5], [-2.4, 2.4]);
  const heroImage = founder.heroImage || founder.image || directors[0]?.image || "/HeaderBG.webp";

  const profiles = useMemo<LeadershipProfile[]>(() => {
    const founderProfile: LeadershipProfile = {
      name: founder.name || "Kalandhar Naina Mohamed",
      role: founder.role || "Founder & Executive Director",
      line: "Operational ecosystems with premium execution intelligence.",
      image: founder.image || heroImage
    };

    return [
      founderProfile,
      ...directors.map((director) => ({
        name: director.name,
        role: director.position,
        line: executiveLine(
          director.leadershipStatement,
          "Enterprise leadership shaped around clarity, trust and disciplined execution."
        ),
        image: director.image
      }))
    ];
  }, [directors, founder.image, founder.name, founder.role, heroImage]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || reduceMotion) return;

    const context = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-directors-reveal]").forEach((element) => {
        gsap.fromTo(
          element,
          { opacity: 0, y: 50, filter: "blur(6px)", force3D: true },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 1,
            ease: "power4.out",
            immediateRender: false,
            scrollTrigger: {
              trigger: element,
              start: "top 82%"
            }
          }
        );
      });

      gsap.to("[data-directors-grid]", {
        y: -24,
        duration: 24,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });

      gsap.to("[data-directors-glow]", {
        xPercent: 10,
        yPercent: -8,
        duration: 16,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });

      if (portraitRef.current) {
        gsap.to(portraitRef.current, {
          yPercent: -8,
          ease: "none",
          scrollTrigger: {
            trigger: "[data-directors-hero]",
            start: "top top",
            end: "bottom top",
            scrub: 1.1
          }
        });
      }
    }, root);

    return () => context.revert();
  }, [reduceMotion]);

  const handlePointerMove = (event: ReactPointerEvent<HTMLElement>) => {
    if (reduceMotion) return;

    const rect = event.currentTarget.getBoundingClientRect();
    pointerX.set((event.clientX - rect.left) / rect.width - 0.5);
    pointerY.set((event.clientY - rect.top) / rect.height - 0.5);
  };

  const resetPointer = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  return (
    <div ref={rootRef} className="relative isolate overflow-hidden bg-[#F8F6F1] text-[#17120f]">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(180deg,#FFFDFC_0%,#F8F6F1_44%,#F5F2EB_100%)]" />
      <div
        data-directors-grid
        className="pointer-events-none absolute -inset-x-10 top-0 -z-10 h-[68rem] opacity-[0.18] will-change-transform [background-image:linear-gradient(rgba(89,72,45,0.14)_1px,transparent_1px),linear-gradient(90deg,rgba(89,72,45,0.1)_1px,transparent_1px)] [background-size:72px_72px] [mask-image:radial-gradient(ellipse_at_50%_18%,black,transparent_74%)]"
      />
      <div
        data-directors-glow
        className="pointer-events-none absolute right-[8%] top-20 -z-10 h-[32rem] w-[32rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(214,180,95,0.16),rgba(255,255,255,0.12)_38%,transparent_68%)] opacity-80 will-change-transform"
      />

      <section
        data-directors-hero
        onPointerMove={handlePointerMove}
        onPointerLeave={resetPointer}
        className="relative grid min-h-[100svh] px-5 pb-16 pt-28 md:px-8 md:pt-32 lg:pb-20"
      >
        <div className="mx-auto grid w-full max-w-[78rem] gap-14 lg:grid-cols-[minmax(0,0.88fr)_minmax(24rem,0.82fr)] lg:items-center">
          <motion.div
            initial={{ opacity: 0, y: 42, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, ease }}
            className="max-w-[43rem]"
          >
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[#8b1118]">
              Executive Leadership
            </p>
            <h1 className="mt-7 font-display text-[clamp(3.15rem,7vw,6.6rem)] font-semibold leading-[0.93] tracking-[-0.055em] text-[#17120f]">
              Built by vision,
              <span className="block text-[#70665c]">guided by execution.</span>
            </h1>
            <p className="mt-8 max-w-[34rem] text-[1rem] leading-7 text-[#62584e] md:text-[1.08rem]">
              Ractysh leadership combines infrastructure strategy, spatial intelligence and enterprise execution into
              one operational ecosystem.
            </p>
            <Link
              href="/book-consultation"
              className="group mt-10 inline-flex h-12 items-center justify-center gap-2 rounded-[7px] bg-[#14110f] px-5 text-[0.86rem] font-semibold text-[#fffaf0] shadow-[0_18px_46px_rgba(23,18,15,0.16)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_24px_62px_rgba(23,18,15,0.2),0_0_28px_rgba(214,180,95,0.12)]"
            >
              Book a Private Briefing
              <ArrowRight className="h-4 w-4 transition duration-300 group-hover:translate-x-0.5" />
            </Link>
          </motion.div>

          <div ref={portraitRef} className="relative mx-auto w-full max-w-[31rem] will-change-transform lg:mr-0">
            <motion.div
              initial={{ opacity: 0, y: 34, scale: 0.97 }}
              animate={
                reduceMotion
                  ? { opacity: 1, y: 0, scale: 1 }
                  : { opacity: 1, y: [0, -10, 0], scale: 1 }
              }
              transition={
                reduceMotion
                  ? { duration: 1, ease }
                  : {
                      opacity: { duration: 1, ease, delay: 0.16 },
                      scale: { duration: 1, ease, delay: 0.16 },
                      y: { duration: 8.5, repeat: Infinity, ease: "easeInOut" }
                    }
              }
              className="relative will-change-transform"
              style={
                reduceMotion
                  ? undefined
                  : { x: portraitX, rotateX: portraitRotateX, rotateY: portraitRotateY, perspective: 1400 }
              }
            >
              <div className="absolute -inset-5 rounded-[2rem] border border-[#d7c59a]/40 bg-white/22 shadow-[0_34px_100px_rgba(55,42,24,0.11)]" />
              <div className="relative overflow-hidden rounded-[1.55rem] border border-[#d6c69e]/70 bg-[#f7f2e8] p-3 shadow-[0_36px_90px_rgba(52,39,23,0.16),inset_0_1px_0_rgba(255,255,255,0.78)]">
                <div className="pointer-events-none absolute inset-3 z-10 rounded-[1.2rem] bg-[radial-gradient(circle_at_54%_16%,rgba(255,255,255,0.46),transparent_32%),linear-gradient(90deg,rgba(20,17,15,0.24),transparent_42%,rgba(214,180,95,0.1))]" />
                <img
                  src={heroImage}
                  alt={founder.name || "Ractysh executive leadership"}
                  className="aspect-[0.78] w-full rounded-[1.2rem] object-cover object-center grayscale contrast-[1.08] saturate-0"
                />
              </div>
              <div className="absolute -bottom-6 left-5 right-5 rounded-[1rem] border border-white/55 bg-[#fffaf0]/78 px-5 py-4 shadow-[0_20px_54px_rgba(48,36,21,0.13)]">
                <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-[#9a7428]">Executive Office</p>
                <p className="mt-1.5 font-display text-[1.25rem] font-semibold tracking-[-0.03em]">{founder.name}</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="relative px-5 py-20 md:px-8 md:py-24">
        <div className="mx-auto max-w-[78rem]">
          <div data-directors-reveal className="max-w-[32rem]">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-[#8b1118]">Leadership</p>
            <h2 className="mt-4 font-display text-[2rem] font-semibold leading-[1.02] tracking-[-0.045em] md:text-[2.7rem]">
              Enterprise presence, without excess.
            </h2>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {profiles.map((profile, index) => (
              <motion.article
                key={`${profile.name}-${profile.role}`}
                data-directors-reveal
                whileHover={reduceMotion ? undefined : { y: -4 }}
                transition={{ duration: 0.35, ease }}
                className="group relative min-h-[15.5rem] overflow-hidden rounded-[8px] border border-[#dfd2b7]/78 bg-[#fffdf8]/62 p-5 shadow-[0_18px_54px_rgba(55,42,24,0.06)]"
              >
                <div className="pointer-events-none absolute inset-x-5 top-0 h-px bg-gradient-to-r from-[#d6b45f]/40 via-transparent to-transparent" />
                <div className="flex items-center gap-3">
                  <img
                    src={profile.image || "/HeaderBG.webp"}
                    alt=""
                    className="h-11 w-11 rounded-full border border-[#d8c7a0] object-cover grayscale contrast-[1.05]"
                  />
                  <span className="text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-[#9a7428]">
                    0{index + 1}
                  </span>
                </div>
                <h3 className="mt-8 font-display text-[1.35rem] font-semibold leading-tight tracking-[-0.035em]">
                  {profile.name}
                </h3>
                <p className="mt-2 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[#8b1118]">
                  {profile.role}
                </p>
                <p className="mt-5 text-[0.92rem] leading-6 text-[#62584e]">{profile.line}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-16 md:px-8 md:py-20">
        <div className="mx-auto grid max-w-[78rem] gap-12 border-y border-[#ded1b8] py-14 md:grid-cols-[0.95fr_1fr] md:items-center">
          <blockquote data-directors-reveal className="font-display text-[clamp(2.25rem,5vw,5.4rem)] font-semibold leading-[0.98] tracking-[-0.055em] text-[#17120f]">
            &ldquo;Execution is the foundation of trust.&rdquo;
          </blockquote>
          <div data-directors-reveal className="grid gap-6 sm:grid-cols-2">
            {timeline.map((item, index) => (
              <div key={item} className="border-t border-[#d8c9aa] pt-5">
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-[#9a7428]">
                  0{index + 1}
                </p>
                <p className="mt-3 font-display text-[1.15rem] font-semibold tracking-[-0.03em] text-[#211914]">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 pb-28 pt-10 text-center md:px-8 md:pb-32">
        <div data-directors-reveal className="mx-auto max-w-[38rem]">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-[#8b1118]">Private Briefing</p>
          <h2 className="mt-5 font-display text-[2.25rem] font-semibold leading-[1.02] tracking-[-0.045em] md:text-[3.25rem]">
            Leadership designed for premium execution.
          </h2>
          <Link
            href="/contact"
            className="group mt-9 inline-flex h-12 items-center justify-center gap-2 rounded-[7px] bg-[#14110f] px-5 text-[0.86rem] font-semibold text-[#fffaf0] shadow-[0_18px_46px_rgba(23,18,15,0.14)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_24px_62px_rgba(23,18,15,0.2),0_0_28px_rgba(214,180,95,0.12)]"
          >
            Contact Leadership
            <ArrowRight className="h-4 w-4 transition duration-300 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
