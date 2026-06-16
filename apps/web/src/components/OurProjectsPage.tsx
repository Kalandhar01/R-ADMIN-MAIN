"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

const ease = [0.22, 1, 0.36, 1] as const;
const glitchSliceCount = 6;
const imageDwellSeconds = 5.2;
const imageTransitionSeconds = 1.55;

const filters = ["All", "Architecture", "Construction", "Real Estate", "Export & Import", "OTC Exchange"] as const;
type ProjectFilter = (typeof filters)[number];

interface ProjectImageFrame {
  src: string;
  position?: string;
}

interface ProjectCard {
  title: string;
  location: string;
  category: Exclude<ProjectFilter, "All">;
  images: readonly [ProjectImageFrame, ProjectImageFrame, ProjectImageFrame];
}

const projects: ProjectCard[] = [
  {
    title: "Commercial Complex",
    location: "Dubai, UAE",
    category: "Construction",
    images: [
      { src: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=2400&q=95", position: "50% 50%" },
      { src: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=2400&q=95", position: "50% 46%" },
      { src: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2400&q=95", position: "50% 50%" }
    ]
  },
  {
    title: "Luxury Villa Interior",
    location: "Dubai, UAE",
    category: "Architecture",
    images: [
      { src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2400&q=95", position: "48% 52%" },
      { src: "https://images.unsplash.com/photo-1600210492493-0946911123ea?auto=format&fit=crop&w=2400&q=95", position: "50% 50%" },
      { src: "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=2400&q=95", position: "50% 52%" }
    ]
  },
  {
    title: "Real Estate Launch Mandate",
    location: "Jebel Ali, UAE",
    category: "Real Estate",
    images: [
      { src: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=2400&q=95", position: "50% 52%" },
      { src: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2400&q=95", position: "48% 48%" },
      { src: "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=2400&q=95", position: "50% 50%" }
    ]
  },
  {
    title: "Corporate Office",
    location: "Bangalore, India",
    category: "Architecture",
    images: [
      { src: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=2400&q=95", position: "50% 50%" },
      { src: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=2400&q=95", position: "50% 50%" },
      { src: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=2400&q=95", position: "50% 50%" }
    ]
  },
  {
    title: "Export & Import Hub",
    location: "Singapore",
    category: "Export & Import",
    images: [
      { src: "https://images.unsplash.com/photo-1494412651409-8963ce7935a7?auto=format&fit=crop&w=2400&q=95", position: "50% 50%" },
      { src: "https://images.unsplash.com/photo-1605745341112-85968b19335b?auto=format&fit=crop&w=2400&q=95", position: "50% 50%" },
      { src: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=2400&q=95", position: "50% 48%" }
    ]
  },
  {
    title: "Private OTC Deal Room",
    location: "Doha, Qatar",
    category: "OTC Exchange",
    images: [
      { src: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=2400&q=95", position: "50% 50%" },
      { src: "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=2400&q=95", position: "50% 50%" },
      { src: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=2400&q=95", position: "50% 50%" }
    ]
  }
];

function WireframePanel({ side }: { side: "left" | "right" }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 420 720"
      className={cn(
        "pointer-events-none absolute top-28 hidden h-[46rem] w-[27rem] text-[#b49452] opacity-[0.12] lg:block",
        side === "left" ? "-left-20" : "-right-20 scale-x-[-1]"
      )}
    >
      <path d="M58 598 210 510 363 598 210 686Z" stroke="currentColor" strokeWidth="1" />
      <path d="M58 598V294L210 206 363 294V598" stroke="currentColor" strokeWidth="1" />
      <path d="M210 206V510" stroke="currentColor" strokeWidth="1" />
      <path d="M58 294 210 382 363 294" stroke="currentColor" strokeWidth="1" />
      <path d="M92 570V350L210 282 330 350V570" stroke="currentColor" strokeWidth="0.8" />
      <path d="M92 350 210 418 330 350" stroke="currentColor" strokeWidth="0.8" />
      <path d="M128 548V406L210 358 294 406V548" stroke="currentColor" strokeWidth="0.8" />
      <path d="M128 406 210 454 294 406" stroke="currentColor" strokeWidth="0.8" />
      <path d="M34 186H218M78 150h286M112 114h210M168 78h170" stroke="currentColor" strokeWidth="0.8" />
      <path d="M84 186V72M146 186V108M218 186V42M286 150V86M338 150V52" stroke="currentColor" strokeWidth="0.8" />
      <circle cx="218" cy="42" r="5" fill="currentColor" opacity="0.42" />
      <circle cx="338" cy="52" r="4" fill="currentColor" opacity="0.36" />
      <circle cx="34" cy="186" r="3" fill="currentColor" opacity="0.34" />
      <path d="M210 24v662M18 598h384M58 294h305" stroke="currentColor" strokeWidth="0.55" opacity="0.45" />
    </svg>
  );
}

function ProjectImageShowcase({ project, index, activeFilter }: { project: ProjectCard; index: number; activeFilter: ProjectFilter }) {
  const shouldPrioritize = index < 3 && activeFilter === "All";

  return (
    <div data-project-showcase className="absolute inset-0 overflow-hidden bg-[#17110d]">
      <div data-project-depth-move className="absolute -inset-[3%] will-change-transform">
        <div data-project-depth className="absolute inset-0 transition duration-[1000ms] ease-out will-change-transform group-hover:scale-[1.055]">
          {project.images.map((frame, frameIndex) => (
            <Image
              key={frame.src}
              data-project-image-layer
              data-project-image-src={frame.src}
              data-project-image-position={frame.position ?? "50% 50%"}
              src={frame.src}
              alt={frameIndex === 0 ? `${project.title} in ${project.location}` : ""}
              aria-hidden={frameIndex === 0 ? undefined : true}
              fill
              sizes="(min-width: 1024px) 31vw, (min-width: 640px) 48vw, 100vw"
              quality={95}
              priority={shouldPrioritize && frameIndex === 0}
              className={cn(
                "object-cover will-change-[opacity,transform,clip-path,filter]",
                frameIndex === 0 ? "opacity-100" : "opacity-0"
              )}
              style={{
                objectPosition: frame.position ?? "50% 50%",
                zIndex: frameIndex === 0 ? 2 : 1
              }}
            />
          ))}
        </div>
      </div>
      <div
        data-project-blueprint-flicker
        className="pointer-events-none absolute inset-0 opacity-0 mix-blend-screen"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,248,237,0.16) 1px, transparent 1px), linear-gradient(90deg, rgba(199,167,99,0.15) 1px, transparent 1px), linear-gradient(135deg, transparent 0%, rgba(139,17,24,0.22) 48%, rgba(255,248,237,0.16) 50%, transparent 54%)",
          backgroundSize: "54px 54px, 54px 54px, 100% 100%"
        }}
      />
      <div className="pointer-events-none absolute inset-0">
        {Array.from({ length: glitchSliceCount }).map((_, sliceIndex) => (
          <div key={sliceIndex} data-project-glitch-slice className="absolute inset-0 opacity-0 will-change-[opacity,transform,clip-path]" />
        ))}
      </div>
      <div
        data-project-scan
        className="pointer-events-none absolute -inset-x-8 top-0 h-24 -translate-y-full opacity-0 mix-blend-screen blur-[0.2px] will-change-transform"
        style={{
          background:
            "linear-gradient(180deg, transparent 0%, rgba(255,248,237,0.18) 42%, rgba(199,167,99,0.42) 50%, rgba(139,17,24,0.16) 56%, transparent 100%)"
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition duration-700 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(circle at 50% 28%, rgba(255,248,237,0.16), transparent 30%), radial-gradient(circle at 78% 72%, rgba(199,167,99,0.2), transparent 32%)"
        }}
      />
    </div>
  );
}

export function OurProjectsPage() {
  const [activeFilter, setActiveFilter] = useState<ProjectFilter>("All");
  const rootRef = useRef<HTMLElement | null>(null);
  const reduceMotion = useReducedMotion();
  const filteredProjects = useMemo(
    () => (activeFilter === "All" ? projects : projects.filter((project) => project.category === activeFilter)),
    [activeFilter]
  );
  const reveal = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 28 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.28 },
        transition: { duration: 0.72, ease }
      };

  useEffect(() => {
    const root = rootRef.current;

    if (!root || reduceMotion) return undefined;

    const cleanupCallbacks: Array<() => void> = [];
    const context = gsap.context(() => {
      const showcases = gsap.utils.toArray<HTMLElement>("[data-project-showcase]", root);

      showcases.forEach((showcase, showcaseIndex) => {
        const card = showcase.closest<HTMLElement>("[data-project-card]");
        const depthMove = showcase.querySelector<HTMLElement>("[data-project-depth-move]");
        const imageLayers = gsap.utils.toArray<HTMLElement>("[data-project-image-layer]", showcase);
        const slices = gsap.utils.toArray<HTMLElement>("[data-project-glitch-slice]", showcase);
        const blueprint = showcase.querySelector<HTMLElement>("[data-project-blueprint-flicker]");
        const scan = showcase.querySelector<HTMLElement>("[data-project-scan]");

        if (!card || !depthMove || imageLayers.length < 2) return;

        let activeImageIndex = 0;
        let isCycleActive = false;
        let cycleCall: gsap.core.Tween | null = null;
        const imageSources = imageLayers.map((image) => image.dataset.projectImageSrc ?? "");
        const imagePositions = imageLayers.map((image) => image.dataset.projectImagePosition ?? "50% 50%");

        gsap.set(depthMove, {
          transformPerspective: 900,
          transformOrigin: "50% 50%",
          force3D: true
        });
        gsap.set(imageLayers, {
          autoAlpha: 0,
          scale: 1.035,
          zIndex: 1,
          clipPath: "inset(0% 0% 0% 0%)",
          filter: "contrast(1.02) saturate(1.04)",
          force3D: true
        });
        gsap.set(imageLayers[0], {
          autoAlpha: 1,
          scale: 1,
          zIndex: 3,
          filter: "contrast(1) saturate(1)"
        });
        gsap.set(slices, {
          autoAlpha: 0,
          x: 0,
          scaleX: 1,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          mixBlendMode: "screen",
          zIndex: 8
        });
        gsap.set([blueprint, scan].filter(Boolean), { autoAlpha: 0 });

        const transitionToImage = (nextImageIndex: number, onSettled?: () => void) => {
          if (nextImageIndex === activeImageIndex || !imageLayers[nextImageIndex]) return;

          const currentImage = imageLayers[activeImageIndex];
          const nextImage = imageLayers[nextImageIndex];
          const transitionTargets = [currentImage, nextImage, blueprint, scan, ...slices].filter(Boolean);

          gsap.killTweensOf(transitionTargets);
          gsap.set(nextImage, {
            autoAlpha: 1,
            zIndex: 5,
            scale: 1.028,
            clipPath: "inset(0% 0% 100% 0%)",
            filter: "contrast(1.045) saturate(1.055) brightness(1.025)"
          });
          gsap.set(currentImage, {
            zIndex: 3,
            clipPath: "inset(0% 0% 0% 0%)"
          });

          const sliceHeight = 100 / Math.max(slices.length, 1);

          slices.forEach((slice, sliceIndex) => {
            const topInset = Math.max(0, sliceIndex * sliceHeight - 0.35);
            const bottomInset = Math.max(0, 100 - (sliceIndex + 1) * sliceHeight - 0.35);

            gsap.set(slice, {
              backgroundImage: `url("${imageSources[nextImageIndex]}")`,
              backgroundPosition: imagePositions[nextImageIndex],
              clipPath: `inset(${topInset}% 0% ${bottomInset}% 0%)`,
              autoAlpha: 0,
              x: sliceIndex % 2 === 0 ? 10 : -10,
              scaleX: 1.008
            });
          });

          gsap
            .timeline({
              defaults: { ease: "power3.out" },
              onComplete: () => {
                gsap.set(currentImage, {
                  autoAlpha: 0,
                  zIndex: 1,
                  scale: 1.035,
                  clipPath: "inset(0% 0% 0% 0%)"
                });
                gsap.set(nextImage, {
                  zIndex: 3,
                  scale: 1,
                  clipPath: "inset(0% 0% 0% 0%)",
                  filter: "contrast(1) saturate(1)"
                });
                activeImageIndex = nextImageIndex;
                onSettled?.();
              }
            })
            .to(blueprint, { autoAlpha: 0.18, duration: 0.24, ease: "sine.out" }, 0)
            .to(scan, { autoAlpha: 0.28, yPercent: 145, duration: 1.36, ease: "power2.inOut" }, 0)
            .to(slices, { autoAlpha: 0.13, x: 0, duration: 0.48, stagger: 0.035, ease: "power2.out" }, 0.08)
            .to(slices, { autoAlpha: 0, x: (sliceIndex) => (sliceIndex % 2 === 0 ? -3 : 3), duration: 0.62, stagger: 0.028, ease: "sine.inOut" }, 0.58)
            .to(nextImage, { clipPath: "inset(0% 0% 0% 0%)", scale: 1, filter: "contrast(1) saturate(1)", duration: imageTransitionSeconds, ease: "power2.inOut" }, 0.04)
            .to(currentImage, { autoAlpha: 0, scale: 1.012, filter: "contrast(0.99) saturate(0.98)", duration: 1.42, ease: "power2.inOut" }, 0.14)
            .to(blueprint, { autoAlpha: 0, duration: 0.72, ease: "sine.inOut" }, 0.66)
            .set(scan, { autoAlpha: 0, yPercent: -110 });
        };

        const stopCycle = () => {
          isCycleActive = false;
          cycleCall?.kill();
          cycleCall = null;
        };

        const scheduleNextCycle = () => {
          cycleCall?.kill();
          cycleCall = gsap.delayedCall(imageDwellSeconds + showcaseIndex * 0.18, () => {
            cycleCall = null;
            if (!isCycleActive) return;

            transitionToImage((activeImageIndex + 1) % imageLayers.length, () => {
              if (isCycleActive) scheduleNextCycle();
            });
          });
        };

        const startCycle = () => {
          if (isCycleActive) return;

          isCycleActive = true;
          scheduleNextCycle();
        };

        const syncCycleState = () => {
          const rect = card.getBoundingClientRect();
          const isInViewport = rect.top <= window.innerHeight * 0.82 && rect.bottom >= window.innerHeight * 0.18;

          if (isInViewport) {
            startCycle();
          } else {
            stopCycle();
          }
        };

        const trigger = ScrollTrigger.create({
          trigger: card,
          start: "top 82%",
          end: "bottom 18%",
          onEnter: startCycle,
          onEnterBack: startCycle,
          onLeave: stopCycle,
          onLeaveBack: stopCycle,
          onRefresh: syncCycleState,
          onUpdate: syncCycleState
        });

        if (trigger.isActive) startCycle();
        syncCycleState();

        const setX = gsap.quickTo(depthMove, "x", { duration: 0.85, ease: "power3.out" });
        const setY = gsap.quickTo(depthMove, "y", { duration: 0.85, ease: "power3.out" });
        const setRotateX = gsap.quickTo(depthMove, "rotateX", { duration: 0.85, ease: "power3.out" });
        const setRotateY = gsap.quickTo(depthMove, "rotateY", { duration: 0.85, ease: "power3.out" });

        const handlePointerMove = (event: PointerEvent) => {
          if (event.pointerType === "touch") return;

          const rect = card.getBoundingClientRect();
          const relativeX = (event.clientX - rect.left) / rect.width - 0.5;
          const relativeY = (event.clientY - rect.top) / rect.height - 0.5;

          setX(relativeX * 16);
          setY(relativeY * 12);
          setRotateY(relativeX * 1.5);
          setRotateX(relativeY * -1.5);
        };

        const handlePointerLeave = () => {
          setX(0);
          setY(0);
          setRotateX(0);
          setRotateY(0);
        };

        card.addEventListener("pointermove", handlePointerMove);
        card.addEventListener("pointerleave", handlePointerLeave);
        cleanupCallbacks.push(() => {
          stopCycle();
          card.removeEventListener("pointermove", handlePointerMove);
          card.removeEventListener("pointerleave", handlePointerLeave);
        });
      });
    }, root);

    const refreshId = requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      cancelAnimationFrame(refreshId);
      cleanupCallbacks.forEach((cleanup) => cleanup());
      context.revert();
    };
  }, [activeFilter, reduceMotion]);

  return (
    <section
      ref={rootRef}
      className="ractysh-work-page relative isolate overflow-hidden bg-[#fbf7ef] px-5 pb-24 pt-[9rem] text-[#1f1712] sm:px-8 md:pt-[10rem] lg:pb-32 [font-family:var(--font-manrope)]"
    >
      <div
        className="pointer-events-none absolute inset-0 -z-20"
        style={{
          background:
            "radial-gradient(circle at 50% -12%, rgba(255,255,255,0.98), transparent 34rem), radial-gradient(circle at 82% 18%, rgba(214,180,95,0.16), transparent 30rem), radial-gradient(circle at 16% 38%, rgba(255,255,255,0.88), transparent 32rem), linear-gradient(180deg, #fffdf8 0%, #f7efe1 48%, #fff9ef 100%)"
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.36]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(180,148,82,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(180,148,82,0.07) 1px, transparent 1px), radial-gradient(circle at 50% 18%, rgba(255,255,255,0.82), transparent 28rem)",
          backgroundSize: "74px 74px, 74px 74px, auto",
          WebkitMaskImage: "linear-gradient(180deg, transparent 0%, black 18%, black 82%, transparent 100%)",
          maskImage: "linear-gradient(180deg, transparent 0%, black 18%, black 82%, transparent 100%)"
        }}
      />
      <WireframePanel side="left" />
      <WireframePanel side="right" />

      <div className="mx-auto max-w-[88rem]">
        <motion.nav
          {...reveal}
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center gap-3 text-[0.6rem] font-medium uppercase leading-[1.5] tracking-normal text-[rgba(123,109,91,0.62)] sm:text-[0.64rem]"
        >
          <Link href="/" className="transition duration-300 hover:text-[#8b1118]">
            Ractysh Group
          </Link>
          <span className="text-[#b99a54]" aria-hidden="true">
            &rarr;
          </span>
          <Link href="/services" className="transition duration-300 hover:text-[#8b1118]">
            Services
          </Link>
          <span className="text-[#b99a54]" aria-hidden="true">
            &rarr;
          </span>
          <span className="text-[#1f1712]/60">Our Work</span>
        </motion.nav>

        <motion.div
          {...reveal}
          transition={reduceMotion ? undefined : { duration: 0.86, ease }}
          className="mx-auto mt-14 max-w-[68rem] text-center"
        >
          <h1 className="mx-auto max-w-[60rem] text-5xl font-semibold italic leading-[0.92] tracking-[0] text-[#181614] font-display md:text-6xl lg:text-7xl">
            <span>Our Recent </span>
            <span className="not-italic text-[#b68a35]">Works</span>
          </h1>
          <p className="mx-auto mt-7 max-w-[42rem] text-[0.82rem] font-medium leading-[1.9] tracking-[0] text-[rgba(67,61,54,0.66)] [font-family:var(--font-manrope)] sm:text-[0.9rem]">
            Selected Architecture, Construction, Real Estate, Export-Import and OTC Exchange workflows.
          </p>
          <div className="mx-auto mt-8 h-px w-28 bg-[linear-gradient(90deg,transparent,rgba(199,167,99,0.74),transparent)]" />
        </motion.div>

        <motion.div
          {...reveal}
          transition={reduceMotion ? undefined : { duration: 0.72, delay: 0.12, ease }}
          className="mt-14 flex flex-wrap gap-2.5"
          aria-label="Work category filters"
        >
          {filters.map((filter) => {
            const isActive = activeFilter === filter;

            return (
              <button
                key={filter}
                type="button"
                aria-pressed={isActive}
                onClick={() => setActiveFilter(filter)}
                className={cn(
                  "rounded-full border px-4 py-2.5 text-[0.9rem] font-medium leading-none tracking-normal text-[rgba(69,56,44,0.78)] shadow-[0_10px_26px_rgba(95,73,38,0.06)] transition duration-500 ease-out hover:-translate-y-0.5 hover:border-[#c7a45d]/70 hover:bg-[#fffdf8] hover:text-[#241a13] hover:shadow-[0_18px_42px_rgba(126,94,42,0.11)] sm:px-[1.125rem]",
                  isActive
                    ? "border-[#d7b86d] bg-[#fffaf0] text-[#17120e] shadow-[0_20px_50px_rgba(182,139,56,0.16),0_0_24px_rgba(214,184,109,0.16)]"
                    : "border-[rgba(217,203,169,0.76)] bg-[rgba(248,240,227,0.88)]"
                )}
              >
                {filter}
              </button>
            );
          })}
        </motion.div>

        <motion.div
          id="work-grid"
          {...reveal}
          viewport={reduceMotion ? undefined : { once: true, amount: 0.05 }}
          transition={reduceMotion ? undefined : { duration: 0.72, delay: 0.18, ease }}
          className="mt-14 grid gap-6 sm:gap-7 lg:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => (
              <motion.article
                layout
                key={project.title}
                initial={reduceMotion ? false : { opacity: 0, y: 24, scale: 0.985 }}
                animate={reduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
                exit={reduceMotion ? undefined : { opacity: 0, y: 14, scale: 0.985 }}
                transition={{ duration: 0.52, delay: reduceMotion ? 0 : index * 0.035, ease }}
                data-project-card
                className="group relative aspect-[0.78] min-h-[28rem] overflow-hidden rounded-[1.45rem] border border-white/75 bg-[#efe3cf] shadow-[0_28px_80px_rgba(55,39,20,0.16),0_1px_0_rgba(255,255,255,0.85)_inset] will-change-transform"
              >
                <ProjectImageShowcase project={project} index={index} activeFilter={activeFilter} />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,14,10,0.02)_0%,rgba(20,14,10,0.12)_45%,rgba(20,14,10,0.72)_100%)] transition duration-700 group-hover:bg-[linear-gradient(180deg,rgba(20,14,10,0.08)_0%,rgba(20,14,10,0.18)_38%,rgba(20,14,10,0.80)_100%)]" />
                <div className="absolute inset-x-0 bottom-0 p-6 text-[#fffaf1] sm:p-7">
                  <div className="translate-y-2 transition duration-700 ease-out group-hover:translate-y-0">
                    <h2 className="font-display text-[1.18rem] font-medium leading-[1.15] tracking-tight drop-shadow-[0_12px_30px_rgba(0,0,0,0.34)] sm:text-[1.34rem]">
                      {project.title}
                    </h2>
                    <p className="mt-2.5 text-[0.72rem] font-medium leading-[1.7] tracking-[0] text-[rgba(255,248,237,0.62)]">{project.location}</p>
                  </div>
                </div>
                <div className="absolute left-6 top-6 rounded-full border border-white/30 bg-[rgba(255,255,255,0.12)] px-3 py-1 text-[0.56rem] font-semibold uppercase leading-none tracking-[0] text-[rgba(255,255,255,0.68)] shadow-[0_12px_30px_rgba(0,0,0,0.18)] backdrop-blur-[8px]">
                  {project.category}
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>

        <motion.div
          {...reveal}
          transition={reduceMotion ? undefined : { duration: 0.72, delay: 0.2, ease }}
          className="mt-16 flex justify-center"
        >
          <button
            type="button"
            onClick={() => setActiveFilter("All")}
            className="group inline-flex min-h-[3.25rem] items-center justify-center gap-3 rounded-full border border-[#d5b567]/70 bg-[#fffaf0] px-7 text-[0.78rem] font-medium leading-none tracking-normal text-[rgba(37,27,20,0.82)] shadow-[0_18px_48px_rgba(126,91,31,0.12),0_1px_0_rgba(255,255,255,0.9)_inset] transition duration-500 ease-out hover:-translate-y-0.5 hover:border-[#d7b86d] hover:bg-[#fffdf8] hover:text-[#1b130e] hover:shadow-[0_22px_58px_rgba(177,130,45,0.18),0_0_34px_rgba(214,184,109,0.18)]"
          >
            Explore Our Work
            <ArrowUpRight className="h-4 w-4 text-[#9b7429] transition duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
