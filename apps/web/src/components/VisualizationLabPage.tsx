"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";
import { ServiceRequestCTA } from "@/components/ServiceRequestCTA";

gsap.registerPlugin(ScrollTrigger);

const ease = [0.22, 1, 0.36, 1] as const;

const visualAssets = {
  hero: {
    src: "/visualization/hero-studio.webp",
    width: 1586,
    height: 992,
    alt: "Light-filled glass architectural visualization studio with layered model presentation"
  },
  systems: {
    src: "/visualization/systems-model.webp",
    width: 1320,
    height: 990,
    alt: "Ivory architectural model with floating glass presentation layers"
  },
  interior: {
    src: "/visualization/gallery-interior.webp",
    width: 1060,
    height: 1325,
    alt: "Luxury double-height interior visualization with sculptural staircase"
  },
  exterior: {
    src: "/visualization/gallery-exterior.webp",
    width: 1320,
    height: 880,
    alt: "Premium villa exterior visualization with reflective pool at warm daylight"
  },
  lobby: {
    src: "/visualization/gallery-lobby.webp",
    width: 1320,
    height: 826,
    alt: "Enterprise lobby visualization with ivory stone and champagne lighting"
  },
  standards: {
    src: "/visualization/presentation-standards.webp",
    width: 1800,
    height: 772,
    alt: "Wide cinematic visualization environment with glass architecture and courtyard light"
  }
};

const systemPoints = [
  {
    title: "Architectural rendering",
    body: "Exterior, interior and concept imagery shaped with proportion, materiality and atmosphere before documentation hardens."
  },
  {
    title: "Cinematic interiors",
    body: "Interior scenes are composed through camera language, tactile surfaces and soft daylight instead of decorative noise."
  },
  {
    title: "Spatial visualization",
    body: "Layered models, glass planes and rendered sections clarify scale, movement, frontage and arrival sequences."
  },
  {
    title: "Lighting realism",
    body: "Natural, ambient and accent light are tested as a visual system so every view carries believable depth."
  },
  {
    title: "Immersive environments",
    body: "Presentation-ready scenes help architecture, interiors and enterprise spaces feel complete before they are built."
  }
];

const galleryItems = [
  {
    title: "Private interior realism",
    label: "Luxury interiors",
    body: "Soft furniture, sculptural circulation and natural light calibrated for refined residential storytelling.",
    image: visualAssets.interior,
    className: "lg:col-span-6"
  },
  {
    title: "Exterior environment studies",
    label: "Architectural exteriors",
    body: "Premium exterior atmospheres with terraces, reflective water and material restraint.",
    image: visualAssets.exterior,
    className: "lg:col-span-6"
  },
  {
    title: "Enterprise presentation spaces",
    label: "Cinematic environments",
    body: "Lobby-scale render systems for enterprise arrival moments, briefing decks and investor presentations.",
    image: visualAssets.lobby,
    className: "lg:col-span-6"
  },
  {
    title: "Glass-layer spatial depth",
    label: "Visualization layers",
    body: "Transparent architectural planes and warm model details create a high-end render presentation language.",
    image: visualAssets.hero,
    className: "lg:col-span-6"
  }
];

const workflowSteps = [
  {
    title: "Concept",
    body: "Spatial intent, mood references and presentation goals are aligned into a precise visual direction."
  },
  {
    title: "Modeling",
    body: "Architecture, interiors, objects and environmental context are built into clean presentation geometry."
  },
  {
    title: "Lighting",
    body: "Daylight, ambient warmth and focal accents are tuned for realism, atmosphere and hierarchy."
  },
  {
    title: "Rendering",
    body: "Materials, cameras and post-production are refined into cinematic stills and spatial sequences."
  },
  {
    title: "Presentation",
    body: "Final views are packaged for decision rooms, client reviews, boards and enterprise storytelling."
  }
];

const containerClass = "mx-auto w-full max-w-[1440px] px-[clamp(1.25rem,3vw,4rem)]";
const sectionClass = "relative py-[clamp(5rem,8vw,9rem)]";
const eyebrowClass = "font-manrope text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-[#9b7a30]";
const darkEyebrowClass = "font-manrope text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-[#f0d28a]";
const bodyClass = "font-manrope text-[1rem] leading-[1.8] text-[#665a4b] sm:text-[1.06rem]";

function headingClass(className = "") {
  return `font-display font-semibold leading-[0.95] tracking-[-0.03em] ${className}`;
}

function HeroShowcase({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <motion.div
      initial={reducedMotion ? false : { opacity: 0, y: 42 }}
      animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.72, delay: 0.14, ease }}
      className="relative mx-auto w-full max-w-[46rem] lg:max-w-none"
    >
      <div className="relative aspect-[1.28] overflow-hidden rounded-[8px] border border-[#d6b45f]/28 bg-[#fbf7ef] shadow-[0_26px_80px_rgba(85,65,38,0.14),0_10px_28px_rgba(85,65,38,0.08)]">
        <Image
          src={visualAssets.hero.src}
          alt={visualAssets.hero.alt}
          fill
          priority
          sizes="(max-width: 1024px) 92vw, 48vw"
          quality={82}
          className="object-cover transition-transform duration-700 ease-out hover:scale-[1.015]"
        />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(255,253,248,0.24),transparent_34%,rgba(58,45,30,0.06)),linear-gradient(180deg,rgba(255,255,255,0.2),transparent_42%,rgba(62,47,29,0.12))]" />
        <div className="pointer-events-none absolute inset-x-8 bottom-8 hidden h-px bg-[linear-gradient(90deg,transparent,rgba(214,180,95,0.65),transparent)] sm:block" />
      </div>

      <figure className="absolute -bottom-8 -left-4 hidden w-[42%] overflow-hidden rounded-[8px] border border-white/70 bg-[#fffaf2] p-2 shadow-[0_20px_56px_rgba(72,55,32,0.16)] sm:block">
        <div className="relative aspect-[1.34] overflow-hidden rounded-[6px]">
          <Image
            src={visualAssets.systems.src}
            alt={visualAssets.systems.alt}
            fill
            sizes="22vw"
            quality={75}
            className="object-cover"
          />
        </div>
      </figure>

      <div className="absolute -right-3 top-8 hidden w-[34%] rounded-[8px] border border-[#d6b45f]/32 bg-white/72 p-4 text-[#241d16] shadow-[0_14px_44px_rgba(72,55,32,0.12)] md:block">
        <p className="font-manrope text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[#9b7a30]">Render depth</p>
        <p className={headingClass("mt-8 text-[1.9rem]")}>Light, glass and scale.</p>
      </div>

      <div className="pointer-events-none absolute -right-5 bottom-16 hidden h-[38%] w-[16%] border border-[#d6b45f]/26 bg-white/16 lg:block" />
      <div className="pointer-events-none absolute right-10 top-0 hidden h-[28%] w-[22%] border border-white/58 bg-white/18 lg:block" />
    </motion.div>
  );
}

function GalleryCard({ item, index }: { item: (typeof galleryItems)[number]; index: number }) {
  return (
    <article
      data-viz-reveal
      className={`group relative aspect-[4/5] overflow-hidden rounded-[8px] border border-[#d8c69e]/34 bg-[#fffaf2] shadow-[0_18px_56px_rgba(92,69,38,0.09)] sm:aspect-[16/11] ${item.className}`}
    >
      <Image
        src={item.image.src}
        alt={item.image.alt}
        fill
        sizes="(max-width: 768px) 92vw, (max-width: 1200px) 48vw, 38vw"
        quality={index === 0 ? 82 : 80}
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.018]"
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_42%,rgba(35,27,18,0.68))]" />
      <div className="absolute inset-x-0 bottom-0 p-5 text-[#fffaf2] sm:p-7">
        <p className="font-manrope text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-[#f1d489]">{item.label}</p>
        <h3 className={headingClass("mt-3 max-w-[24rem] text-[2.1rem] sm:text-[2.55rem]")}>
          {item.title}
        </h3>
        <p className="mt-4 max-w-[26rem] font-manrope text-[0.94rem] leading-[1.8] text-white/78">{item.body}</p>
      </div>
    </article>
  );
}

export function VisualizationLabPage() {
  const rootRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const reducedMotion = Boolean(reduceMotion);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const context = gsap.context(() => {
      const revealItems = gsap.utils.toArray<HTMLElement>("[data-viz-reveal]");

      if (reducedMotion) {
        gsap.set(revealItems, { opacity: 1, y: 0 });
        return;
      }

      gsap.set(revealItems, { opacity: 0, y: 28, force3D: true });

      revealItems.forEach((item, index) => {
        gsap.to(item, {
          opacity: 1,
          y: 0,
          duration: 0.72,
          delay: Math.min(index * 0.025, 0.1),
          ease: "power3.out",
          scrollTrigger: {
            trigger: item,
            start: "top 88%",
            once: true
          }
        });
      });
    }, root);

    const refreshId = requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      cancelAnimationFrame(refreshId);
      context.revert();
    };
  }, [reducedMotion]);

  return (
    <article
      ref={rootRef}
      className="font-manrope relative isolate overflow-hidden bg-[#f8f3ea] text-[#211a14]"
    >
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(180deg,#fffdf8_0%,#f9f3ea_44%,#efe1cf_100%)]" />
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-[0.28] [background-image:linear-gradient(90deg,rgba(70,55,35,0.07)_1px,transparent_1px),linear-gradient(rgba(70,55,35,0.045)_1px,transparent_1px)] [background-size:86px_86px]" />
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-[0.16] [background-image:radial-gradient(rgba(84,68,46,0.2)_0.6px,transparent_0.7px)] [background-size:18px_18px]" />

      <section className="relative flex min-h-[100svh] items-center py-[clamp(7rem,10vw,10rem)]">
        <div className={`${containerClass} grid gap-12 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:items-center xl:gap-16`}>
          <div className="relative z-10">
            <motion.p
              initial={reducedMotion ? false : { opacity: 0, y: 32 }}
              animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.62, ease }}
              className={eyebrowClass}
            >
              Luxury Visualization Studio
            </motion.p>
            <h1 className={headingClass("mt-6 max-w-[45rem] text-[3.1rem] sm:text-[4.35rem] lg:text-[5.65rem] xl:text-[6.5rem]")}>
              {["3D visualization", "crafted through", "light, realism", "and space."].map((line, index) => (
                <motion.span
                  key={line}
                  initial={reducedMotion ? false : { opacity: 0, y: 42 }}
                  animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
                  transition={{ duration: 0.72, delay: 0.05 + index * 0.055, ease }}
                  className={index === 3 ? "block text-[#8d7b62]" : "block"}
                >
                  {line}
                </motion.span>
              ))}
            </h1>
            <motion.p
              initial={reducedMotion ? false : { opacity: 0, y: 34 }}
              animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.68, delay: 0.26, ease }}
              className={`${bodyClass} mt-7 max-w-[37rem] text-[#5c5145]`}
            >
              Premium visualization systems designed for architecture, interiors and enterprise environments.
            </motion.p>
            <motion.div
              initial={reducedMotion ? false : { opacity: 0, y: 34 }}
              animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.68, delay: 0.34, ease }}
              className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap"
            >
              <Link
                href="#visualization-systems"
                className="group inline-flex min-h-12 items-center justify-center gap-2 whitespace-nowrap rounded-[8px] border border-[#d6b45f]/45 bg-[#211a14] px-5 font-manrope text-[0.92rem] font-semibold text-[#fffaf2] shadow-[0_16px_38px_rgba(74,55,31,0.14)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#2b2118]"
              >
                Explore systems
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link
                href="/book-consultation"
                className="group inline-flex min-h-12 items-center justify-center gap-2 whitespace-nowrap rounded-[8px] border border-[#b99a55]/34 bg-white/68 px-5 font-manrope text-[0.92rem] font-semibold text-[#211a14] shadow-[0_12px_30px_rgba(74,55,31,0.07),inset_0_1px_0_rgba(255,255,255,0.8)] transition duration-300 hover:-translate-y-0.5 hover:border-[#b99a55]/58 hover:bg-white/84"
              >
                Book a visualization brief
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <ServiceRequestCTA
                showLabel={false}
                buttonClassName="min-h-12 rounded-[8px] border-[#b99a55]/42 bg-[#fffdf8]/54 px-5 font-manrope text-[0.92rem] font-semibold text-[#211a14] shadow-[0_12px_30px_rgba(74,55,31,0.07),inset_0_1px_0_rgba(255,255,255,0.8)] hover:border-[#b99a55]/68 hover:bg-white/84 hover:shadow-[0_16px_38px_rgba(74,55,31,0.11),0_0_22px_rgba(214,180,95,0.12),inset_0_1px_0_rgba(255,255,255,0.86)]"
              />
            </motion.div>
          </div>

          <HeroShowcase reducedMotion={reducedMotion} />
        </div>
      </section>

      <section id="visualization-systems" className={sectionClass}>
        <div className={`${containerClass} grid gap-12 lg:grid-cols-[minmax(0,0.94fr)_minmax(0,1.06fr)] lg:items-center xl:gap-16`}>
          <div data-viz-reveal>
            <p className={eyebrowClass}>Visualization Systems</p>
            <h2 className={headingClass("mt-5 max-w-[38rem] text-[2.55rem] sm:text-[3.7rem] lg:text-[4.75rem]")}>
              Visual language for architecture before it becomes real.
            </h2>
            <p className={`${bodyClass} mt-6 max-w-[35rem]`}>
              A refined visualization system brings rendering, interiors, spatial depth and lighting realism into one calm presentation standard.
            </p>

            <div className="mt-10 divide-y divide-[#d6b45f]/24 border-y border-[#d6b45f]/28">
              {systemPoints.map((point) => (
                <div key={point.title} data-viz-reveal className="grid gap-3 py-5 sm:grid-cols-[13rem_1fr]">
                  <h3 className={headingClass("text-[1.35rem] leading-[1.02] text-[#241d16]")}>{point.title}</h3>
                  <p className="font-manrope text-[0.95rem] leading-[1.8] text-[#6d6255]">{point.body}</p>
                </div>
              ))}
            </div>
          </div>

          <figure data-viz-reveal className="relative overflow-hidden rounded-[8px] border border-[#d6b45f]/32 bg-[#fffaf2] shadow-[0_22px_70px_rgba(85,65,38,0.12)]">
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                data-viz-image
                src={visualAssets.systems.src}
                alt={visualAssets.systems.alt}
                fill
                sizes="(max-width: 1024px) 92vw, 48vw"
                quality={82}
                className="object-cover"
              />
            </div>
          </figure>
        </div>
      </section>

      <section className={sectionClass}>
        <div className={containerClass}>
          <div data-viz-reveal className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className={eyebrowClass}>Rendered Environments</p>
              <h2 className={headingClass("mt-5 max-w-[42rem] text-[2.65rem] sm:text-[3.85rem] lg:text-[5rem]")}>
                Cinematic scenes with architectural restraint.
              </h2>
            </div>
            <p className={`${bodyClass} max-w-[28rem]`}>
              Luxury interiors, premium exteriors and enterprise environments are composed with editorial spacing, soft zoom and immersive depth.
            </p>
          </div>

          <div className="mt-12 grid gap-5 lg:grid-cols-12">
            {galleryItems.map((item, index) => (
              <GalleryCard key={item.title} item={item} index={index} />
            ))}
          </div>
        </div>
      </section>

      <section className={sectionClass}>
        <div className={containerClass}>
          <div className="border-y border-[#d6b45f]/26 py-14">
            <div data-viz-reveal className="max-w-[42rem]">
              <p className={eyebrowClass}>Visualization Workflow</p>
              <h2 className={headingClass("mt-5 text-[2.45rem] sm:text-[3.55rem] lg:text-[4.5rem]")}>
                Concept to presentation, refined through light.
              </h2>
            </div>

            <div className="relative mt-12">
              <span className="absolute left-[10%] right-[10%] top-5 hidden h-px bg-[linear-gradient(90deg,transparent,rgba(182,143,68,0.76),transparent)] md:block" aria-hidden="true" />
              <ol className="grid gap-4 md:grid-cols-5 md:gap-0">
                {workflowSteps.map((step, index) => (
                  <li key={step.title} data-viz-reveal className="relative rounded-[8px] border border-[#d6b45f]/24 bg-[#fffaf2]/58 p-5 shadow-[0_16px_46px_rgba(88,66,38,0.07)] md:border-0 md:bg-transparent md:shadow-none">
                    <span className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full border border-[#b99a55]/48 bg-[#fffaf2] font-manrope text-[0.86rem] font-semibold text-[#8a6a2c] shadow-[0_10px_26px_rgba(90,65,32,0.12)]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h3 className={headingClass("mt-7 text-[1.7rem] text-[#241d16]")}>{step.title}</h3>
                    <p className="mt-4 font-manrope text-[0.92rem] leading-[1.8] text-[#6d6255]">{step.body}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      <section className="relative pb-[clamp(5rem,8vw,9rem)] pt-[clamp(2rem,4vw,4rem)]">
        <div className={containerClass}>
          <div data-viz-reveal className="overflow-hidden rounded-[8px] border border-[#d6b45f]/30 bg-[#231a12] shadow-[0_28px_86px_rgba(64,48,28,0.16)]">
            <div className="relative min-h-[34rem] md:min-h-[42rem]">
              <Image
                data-viz-image
                src={visualAssets.standards.src}
                alt={visualAssets.standards.alt}
                fill
                sizes="(max-width: 768px) 92vw, 1260px"
                quality={82}
                className="object-cover"
              />
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(20,15,10,0.78)_0%,rgba(30,22,14,0.44)_38%,rgba(30,22,14,0.04)_72%),linear-gradient(180deg,rgba(255,255,255,0.04),rgba(18,13,8,0.16))]" />
              <div className="relative z-10 flex min-h-[34rem] items-center px-6 py-12 md:min-h-[42rem] md:px-12 lg:px-16">
                <div>
                  <p className={darkEyebrowClass}>Immersive Presentation Standards</p>
                  <h2 className={headingClass("mt-6 max-w-[33rem] text-[3rem] text-[#fff8ec] sm:text-[4.1rem] lg:text-[5.2rem]")}>
                    Designed for
                    <span className="block">modern spatial</span>
                    <span className="block">storytelling.</span>
                  </h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </article>
  );
}
