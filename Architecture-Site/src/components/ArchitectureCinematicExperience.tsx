"use client";

import { FormEvent, MouseEvent, useCallback, useEffect, useRef, useState, type ReactNode, type RefObject, type SyntheticEvent } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion, useScroll, useTransform, type HTMLMotionProps, type Variants } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight, Check, ChevronLeft, ChevronRight, Loader2, Mail, X } from "lucide-react";
import { editorialPanels } from "@/lib/architectureContent";
import { cn } from "@/lib/utils";
import type { ArchitectureHeroView, ArchitectureProjectView } from "@/lib/architectureCms";
import { OptimizedImage as Image } from "@/components/OptimizedImage";
import ArchitecturePremiumSections from "@/components/ArchitecturePremiumSections";
import { ArchitectureTestimonials } from "@/components/ArchitectureTestimonials";
import { ArchitectureStudioAccessWidget } from "@/components/ArchitectureStudioAccessWidget";
import { ProjectTypeSelect } from "@/components/ProjectTypeSelect";
import {
  ctaSectionContent,
  footerContent,
  heroSupportingContent,
  processContent,
  statisticsContent
} from "@/lib/architecturePremiumContent";

const easeOut = [0.22, 1, 0.36, 1] as const;
const power4Out = [0.16, 1, 0.3, 1] as const;
const heroVideoPlaybackRate = 1.35;
const architecturalPhrasePattern = /(Spatial Intelligence|Architecture|Design|Planning|Visualization)/gi;
const architecturalPhraseSet = new Set(["spatial intelligence", "architecture", "design", "planning", "visualization"]);
const studioStoryImages = [
  {
    src: "/images/architecture/ractysh-who-we-are-editorial-villa.webp",
    alt: "Luxury modern villa courtyard with stone, timber, glass, tropical planting, and natural daylight"
  },
  {
    src: "/images/architecture/ractysh-coimbatore-linear-house.avif",
    alt: "South Indian residence with contemporary roof planes, stone, glass, lawn, and shaded tropical edges"
  },
  {
    src: "/images/architecture/architecture-content-gallery-lobby-07.webp",
    alt: "Interior architecture with refined lobby materials, warm light, and composed spatial depth"
  }
] as const;

function configureHeroVideo(video: HTMLVideoElement) {
  video.defaultPlaybackRate = heroVideoPlaybackRate;
  video.playbackRate = heroVideoPlaybackRate;
  video.muted = true;
}

const reveal: Variants = {
  hidden: { opacity: 0, y: 26 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: power4Out }
  }
};

const staggerReveal: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.05
    }
  }
};

const delayedStaggerReveal: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.28
    }
  }
};

const maskReveal: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08
    }
  }
};

const maskLineReveal: Variants = {
  hidden: { scaleX: 0, opacity: 0 },
  visible: {
    scaleX: 1,
    opacity: 1,
    transition: { duration: 0.72, ease: power4Out }
  }
};

const maskCopyReveal: Variants = {
  hidden: { y: "112%", opacity: 0 },
  visible: {
    y: "0%",
    opacity: 1,
    transition: { duration: 0.8, ease: power4Out }
  }
};

const heroMaskCopyReveal: Variants = {
  hidden: { y: "112%", opacity: 0 },
  visible: {
    y: "0%",
    opacity: 1,
    transition: { duration: 1.2, ease: power4Out }
  }
};

const wordPhraseReveal: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.055,
      delayChildren: 0.1
    }
  }
};

const wordReveal: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: power4Out }
  }
};

const imageReveal: Variants = {
  hidden: { clipPath: "inset(0% 0% 100% 0%)" },
  visible: {
    clipPath: "inset(0% 0% 0% 0%)",
    transition: { duration: 1.4, ease: power4Out }
  }
};

const projectBoardReveal: Variants = {
  hidden: { clipPath: "inset(0% 100% 0% 0%)" },
  visible: {
    clipPath: "inset(0% 0% 0% 0%)",
    transition: { duration: 1.4, ease: power4Out }
  }
};

const imageScaleReveal: Variants = {
  hidden: { scale: 1.08 },
  visible: {
    scale: 1,
    transition: { duration: 1.4, ease: power4Out }
  }
};

const studioImageReveal: Variants = {
  hidden: { clipPath: "inset(0% 0% 100% 0%)" },
  visible: {
    clipPath: "inset(0% 0% 0% 0%)",
    transition: { duration: 1.2, ease: power4Out }
  }
};

const studioImageScaleReveal: Variants = {
  hidden: { scale: 1.08 },
  visible: {
    scale: 1,
    transition: { duration: 1.2, ease: power4Out }
  }
};

const ruleReveal: Variants = {
  hidden: { scaleX: 0, opacity: 0 },
  visible: {
    scaleX: 1,
    opacity: 1,
    transition: { duration: 0.95, ease: power4Out }
  }
};

const formFieldReveal: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.68, ease: power4Out }
  }
};

const consultationDeskReveal: Variants = {
  hidden: { clipPath: "inset(0% 100% 0% 0%)", opacity: 0 },
  visible: {
    clipPath: "inset(0% 0% 0% 0%)",
    opacity: 1,
    transition: {
      duration: 1.05,
      ease: power4Out,
      staggerChildren: 0.085,
      delayChildren: 0.2
    }
  }
};

const heroLogoReveal: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: power4Out }
  }
};

const heroDescriptionReveal: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: power4Out, delay: 0.3 }
  }
};

const heroActionsReveal: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: power4Out, delay: 0.6 }
  }
};

const heroHeadingReveal: Variants = {
  hidden: { opacity: 0, y: 60, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 1.2,
      ease: power4Out,
      staggerChildren: 0.085
    }
  }
};

function WordReveal({ phrase }: { phrase: string }) {
  const words = phrase.split(/\s+/).filter(Boolean);

  return (
    <motion.span className="arch-word-phrase" variants={wordPhraseReveal}>
      {words.map((word, index) => (
        <motion.span key={`${word}-${index}`} className="arch-word" variants={wordReveal}>
          {word}
          {index < words.length - 1 ? " " : null}
        </motion.span>
      ))}
    </motion.span>
  );
}

function renderArchitecturalText(text: string) {
  return text.split(architecturalPhrasePattern).map((part, index) => {
    if (architecturalPhraseSet.has(part.toLowerCase())) {
      return <WordReveal key={`${part}-${index}`} phrase={part} />;
    }

    return part;
  });
}

function renderRevealChildren(children: ReactNode) {
  return typeof children === "string" ? renderArchitecturalText(children) : children;
}

type MaskRevealH1Props = Omit<HTMLMotionProps<"h1">, "children"> & {
  children: ReactNode;
};

type MaskRevealH2Props = Omit<HTMLMotionProps<"h2">, "children"> & {
  children: ReactNode;
};

type MaskRevealH3Props = Omit<HTMLMotionProps<"h3">, "children"> & {
  children: ReactNode;
};

function MaskRevealH1({ children, className = "", variants = maskReveal, ...props }: MaskRevealH1Props) {
  return (
    <motion.h1 className={`arch-mask-reveal ${className}`} variants={variants} {...props}>
      <motion.span className="arch-draft-line" variants={maskLineReveal} aria-hidden="true" />
      <motion.span className="arch-mask-reveal-copy" variants={heroMaskCopyReveal}>
        {renderRevealChildren(children)}
      </motion.span>
    </motion.h1>
  );
}

function MaskRevealH2({ children, className = "", variants = maskReveal, ...props }: MaskRevealH2Props) {
  return (
    <motion.h2 className={`arch-mask-reveal ${className}`} variants={variants} {...props}>
      <motion.span className="arch-draft-line" variants={maskLineReveal} aria-hidden="true" />
      <motion.span className="arch-mask-reveal-copy" variants={maskCopyReveal}>
        {renderRevealChildren(children)}
      </motion.span>
    </motion.h2>
  );
}

function MaskRevealH3({ children, className = "", variants = maskReveal, ...props }: MaskRevealH3Props) {
  return (
    <motion.h3 className={`arch-mask-reveal ${className}`} variants={variants} {...props}>
      <motion.span className="arch-draft-line" variants={maskLineReveal} aria-hidden="true" />
      <motion.span className="arch-mask-reveal-copy" variants={maskCopyReveal}>
        {renderRevealChildren(children)}
      </motion.span>
    </motion.h3>
  );
}

type ArchitecturalTextProps = Omit<HTMLMotionProps<"p">, "children"> & {
  children: string;
};

function ArchitecturalText({ children, className = "", variants = reveal, ...props }: ArchitecturalTextProps) {
  return (
    <motion.p className={className} variants={variants} {...props}>
      {renderArchitecturalText(children)}
    </motion.p>
  );
}

function BrandLogo() {
  return (
    <span className="brand-logo">
      <Image
        src="/images/architecture/ractysh-architecture-logo.webp"
        alt="Ractysh Architecture emblem"
        fill
        sizes="(max-width: 720px) 44px, 56px"
        className="object-contain"
        placeholder="empty"
        style={{ background: "transparent" }}
      />
    </span>
  );
}

type DeskState = "idle" | "submitting" | "success" | "error";
type NavSectionId = "works" | "consultation" | "";

const navItems: { id: NavSectionId; label: string }[] = [
  { id: "works", label: "Works" },
  { id: "consultation", label: "Consultation" }
];

const architectureFooterColumns = [footerContent.studio, footerContent.services, footerContent.locations, footerContent.contact] as const;
const architectureFooterStatement = ["Built Beyond", "Blueprints.", "Designed to Endure."] as const;

const consultationSectionId = "consultation";
const consultationDeskId = "architecture-consultation-desk";
const contactPageAliases = new Set(["/contact", "/contact-us", "/consultation", "/schedule", "/request-schedule"]);
const contactHashAliases = new Set(["contact", "contact-us", "schedule", "request-schedule", "architecture-contact", "architecture-consultation"]);
const navSectionIds = navItems.map((item) => item.id);
const navScrollDuration = 1.35;
const navScrollEase = (time: number) => (time < 0.5 ? 4 * time * time * time : 1 - Math.pow(-2 * time + 2, 3) / 2);

let architectureLenis: {
  scrollTo: (
    target: HTMLElement | string | number,
    options?: {
      offset?: number;
      duration?: number;
      easing?: (time: number) => number;
      onComplete?: () => void;
      lock?: boolean;
      immediate?: boolean;
      force?: boolean;
    }
  ) => void;
  resize?: () => void;
  start?: () => void;
  stop?: () => void;
} | null = null;

function SmoothScroll() {
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) return;

    let cancelled = false;
    let lenis: import("lenis").default | null = null;
    let frame = 0;

    void import("lenis").then(({ default: Lenis }) => {
      if (cancelled) return;

      lenis = new Lenis({
        duration: 1.3,
        easing: (time: number) => Math.min(1, 1.001 - Math.pow(2, -10 * time)),
        smoothWheel: true,
        wheelMultiplier: 0.74,
        touchMultiplier: 0.88,
        prevent: (node) => node.closest("[data-lenis-prevent]") !== null
      });
      architectureLenis = lenis;

      const raf = (time: number) => {
        lenis?.raf(time);
        frame = window.requestAnimationFrame(raf);
      };

      frame = window.requestAnimationFrame(raf);
    });

    return () => {
      cancelled = true;
      if (frame) window.cancelAnimationFrame(frame);
      if (architectureLenis === lenis) architectureLenis = null;
      lenis?.destroy();
    };
  }, [reduceMotion]);

  return null;
}

function useArchitectureGsap(rootRef: RefObject<HTMLElement | null>, reduceMotion: boolean | null) {
  useEffect(() => {
    if (reduceMotion) return;

    let cancelled = false;
    let context: { revert: () => void } | null = null;

    void Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([gsapModule, scrollModule]) => {
      const root = rootRef.current;
      if (cancelled || !root) return;

      const { gsap } = gsapModule;
      const { ScrollTrigger } = scrollModule;
      gsap.registerPlugin(ScrollTrigger);

      context = gsap.context(() => {
        gsap.utils.toArray<HTMLElement>("[data-metric-counter]", root).forEach((counter) => {
          const finalValue = parseInt(counter.dataset.value || "0", 10);
          if (isNaN(finalValue)) return;
          
          gsap.fromTo(
            counter,
            { innerHTML: "0" },
            {
              innerHTML: finalValue,
              duration: 2.5,
              ease: "power3.out",
              snap: { innerHTML: 1 },
              scrollTrigger: {
                trigger: counter,
                start: "top 85%",
                once: true
              }
            }
          );
        });

        gsap.utils.toArray<HTMLElement>("[data-parallax-text]", root).forEach((item) => {
          gsap.to(item, {
            y: -34,
            ease: "none",
            scrollTrigger: {
              trigger: item,
              start: "top 90%",
              end: "bottom 18%",
              scrub: true
            }
          });
        });

        const contactHero = root.querySelector<HTMLElement>("[data-contact-hero]");
        if (contactHero) {
          const contactVideo = contactHero.querySelector<HTMLElement>("[data-contact-hero-video]");
          const contactRevealItems = gsap.utils.toArray<HTMLElement>("[data-contact-reveal]", contactHero);
          const contactTimeline = gsap.timeline({
            scrollTrigger: {
              trigger: contactHero,
              start: "top 72%",
              once: true
            }
          });

          if (contactVideo) {
            contactTimeline.fromTo(
              contactVideo,
              { opacity: 0, scale: 1.08 },
              { opacity: 1, scale: 1.02, duration: 1.9, ease: "power4.out" }
            );
          }

          if (contactRevealItems.length) {
            contactTimeline.fromTo(
              contactRevealItems,
              { opacity: 0, y: 36 },
              {
                opacity: 1,
                y: 0,
                duration: 1.05,
                ease: "power4.out",
                stagger: 0.16
              },
              contactVideo ? ">-0.15" : 0
            );
          }
        }

        gsap.utils.toArray<HTMLElement>("[data-studio-story]", root).forEach((item) => {
          const media = item.querySelector<HTMLElement>("[data-studio-story-media]");
          const image = item.querySelector<HTMLElement>("[data-studio-story-image]");
          const copyItems = item.querySelectorAll<HTMLElement>("[data-studio-story-copy] > *");

          if (media) {
            gsap.fromTo(
              media,
              { clipPath: "inset(0% 0% 100% 0%)" },
              {
                clipPath: "inset(0% 0% 0% 0%)",
                duration: 1.25,
                ease: "power4.out",
                scrollTrigger: {
                  trigger: item,
                  start: "top 82%",
                  once: true
                }
              }
            );
          }

          if (image) {
            gsap.fromTo(
              image,
              { scale: 1.08 },
              {
                scale: 1,
                duration: 1.35,
                ease: "power4.out",
                scrollTrigger: {
                  trigger: item,
                  start: "top 82%",
                  once: true
                }
              }
            );

            gsap.to(image, {
              yPercent: -7,
              ease: "none",
              scrollTrigger: {
                trigger: item,
                start: "top bottom",
                end: "bottom top",
                scrub: true
              }
            });
          }

          if (copyItems.length) {
            gsap.fromTo(
              copyItems,
              { opacity: 0, y: 28 },
              {
                opacity: 1,
                y: 0,
                duration: 0.82,
                stagger: 0.08,
                ease: "power4.out",
                scrollTrigger: {
                  trigger: item,
                  start: "top 78%",
                  once: true
                }
              }
            );
          }
        });

        ScrollTrigger.refresh();
      }, root);
    });

    return () => {
      cancelled = true;
      context?.revert();
    };
  }, [reduceMotion, rootRef]);
}

function navOffset() {
  const nav = document.querySelector<HTMLElement>(".architecture-nav");
  return Math.round((nav?.getBoundingClientRect().height || 74) + 18);
}

function normalizePathname(pathname: string) {
  const normalized = pathname.replace(/\/+$/, "");
  return normalized || "/";
}

function targetIdFromHash(hash: string) {
  const targetId = decodeURIComponent(hash.replace(/^#/, "")).trim();
  if (!targetId) return null;

  return contactHashAliases.has(targetId.toLowerCase()) ? consultationDeskId : targetId;
}

function navIdFromHash(hash: string) {
  if (hash === consultationDeskId || contactHashAliases.has(hash.toLowerCase())) return consultationSectionId;
  return navSectionIds.includes(hash as NavSectionId) ? (hash as NavSectionId) : null;
}

function scrollTargetFromHref(href: string) {
  const trimmedHref = href.trim();
  if (!trimmedHref) return null;
  if (trimmedHref.startsWith("#")) return targetIdFromHash(trimmedHref);

  try {
    const url = new URL(trimmedHref, window.location.href);
    if (url.origin !== window.location.origin) return null;

    if (url.hash) return targetIdFromHash(url.hash);

    const targetPath = normalizePathname(url.pathname);
    if (contactPageAliases.has(targetPath)) return consultationDeskId;
  } catch {
    return null;
  }

  return null;
}

async function premiumScrollTo(target: HTMLElement, onComplete: () => void) {
  const top = Math.max(0, target.getBoundingClientRect().top + window.scrollY - navOffset());

  try {
    const [{ gsap }, { ScrollToPlugin }] = await Promise.all([import("gsap"), import("gsap/ScrollToPlugin")]);
    gsap.registerPlugin(ScrollToPlugin);
    architectureLenis?.scrollTo(window.scrollY, { immediate: true, force: true });
    gsap.killTweensOf(window);
    gsap.to(window, {
      scrollTo: { y: top, autoKill: false },
      duration: navScrollDuration,
      ease: "power3.inOut",
      overwrite: true,
      onUpdate: () => architectureLenis?.resize?.(),
      onComplete: () => {
        architectureLenis?.resize?.();
        onComplete();
      }
    });
  } catch {
    if (architectureLenis) {
      architectureLenis.scrollTo(top, {
        duration: navScrollDuration,
        easing: navScrollEase,
        onComplete,
        lock: true
      });
      return;
    }

    window.scrollTo({ top, behavior: "smooth" });
    window.setTimeout(onComplete, navScrollDuration * 1000);
  }
}

type AnchorNavigateHandler = (event: MouseEvent<HTMLAnchorElement>, href: string) => void;

function useMobileHeroFrame() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 720px)");
    const update = () => setIsMobile(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return isMobile;
}

function heroVideoSources(videoUrl: string): { src: string; type: string; media?: string }[] {
  return [{ src: videoUrl, type: videoUrl.endsWith(".webm") ? "video/webm" : "video/mp4" }];
}

function HeroFilm({
  hero,
  onContentReveal,
  onAnchorNavigate
}: {
  hero: ArchitectureHeroView;
  onContentReveal: () => void;
  onAnchorNavigate: AnchorNavigateHandler;
}) {
  const ref = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const revealTriggeredRef = useRef(false);
  const reduceMotion = useReducedMotion();
  const isMobileHero = useMobileHeroFrame();
  const [contentRevealed, setContentRevealed] = useState(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("arch-intro-revealed") === "true";
    }
    return false;
  });
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const videoY = useTransform(scrollYProgress, [0, 1], reduceMotion || isMobileHero ? ["0%", "0%"] : ["0%", "14%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], reduceMotion ? ["0%", "0%"] : ["0%", "-12%"]);
  const sources = heroVideoSources(hero.videoUrl);

  const revealHeroContent = useCallback(() => {
    if (revealTriggeredRef.current) return;
    revealTriggeredRef.current = true;
    setContentRevealed(true);
    onContentReveal();
    try { sessionStorage.setItem("arch-intro-revealed", "true"); } catch { /* noop */ }
  }, [onContentReveal]);

  const handleSkipIntro = useCallback(
    (event: MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();
      revealHeroContent();
    },
    [revealHeroContent]
  );

  const handleVideoReady = useCallback((event: SyntheticEvent<HTMLVideoElement>) => {
    const video = event.currentTarget;
    configureHeroVideo(video);
    void video.play().catch(() => undefined);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    configureHeroVideo(video);
    void video.play().catch(() => undefined);
  }, []);

  const handleVideoProgress = useCallback(
    (event: SyntheticEvent<HTMLVideoElement>) => {
      const video = event.currentTarget;
      configureHeroVideo(video);

      if (revealTriggeredRef.current) return;

      const duration = video.duration;
      const hasDuration = Number.isFinite(duration) && duration > 0;
      const revealAt = hasDuration ? duration * 0.5 : 4.5;

      if (video.currentTime >= revealAt) {
        revealHeroContent();
      }
    },
    [revealHeroContent]
  );

  return (
    <section ref={ref} className="arch-hero relative overflow-hidden text-white">
      {hero.posterUrl ? (
        <Image
          src={hero.posterUrl}
          alt=""
          fill
          priority
          quality={84}
          sizes="100vw"
          aria-hidden="true"
          className="arch-hero-poster object-cover"
        />
      ) : null}
      <motion.video
        ref={videoRef}
        className={`arch-hero-video absolute inset-0 w-full object-cover ${isMobileHero ? "h-full" : "h-[116%]"}`}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
        onCanPlay={handleVideoReady}
        onLoadedMetadata={handleVideoReady}
        onPlay={handleVideoReady}
        onPlaying={handleVideoReady}
        onTimeUpdate={handleVideoProgress}
        initial={{ opacity: 0, scale: 1 }}
        animate={{ opacity: 1, scale: isMobileHero ? 1.01 : 1.05 }}
        transition={{
          opacity: { duration: 1.25, ease: easeOut },
          scale: { duration: 5, ease: power4Out }
        }}
        style={{ y: videoY }}
      >
        {sources.map((source: { src: string; type: string; media?: string }) => (
          <source key={source.src} src={source.src} type={source.type} media={source.media} />
        ))}
      </motion.video>
      <motion.div
        className="arch-hero-overlay absolute inset-0"
        initial={false}
        animate={{ opacity: contentRevealed ? 0.48 : 0.24 }}
        transition={{ duration: 1.15, ease: power4Out }}
      />
      {!contentRevealed && (
        <motion.a
          href="#architecture-hero-content"
          className="arch-skip-intro"
          onClick={handleSkipIntro}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 0.6, y: 0 }}
          transition={{ duration: 0.55, ease: power4Out, delay: 0.2 }}
        >
          Skip Intro →
        </motion.a>
      )}
      <motion.div
        id="architecture-hero-content"
        className="arch-hero-content relative z-10 mx-auto flex min-h-[100svh] max-w-7xl flex-col items-center justify-center px-5 py-28 text-center sm:px-8 lg:px-12"
        style={{ y: contentY }}
        aria-hidden={!contentRevealed}
      >
        <motion.div
          className="hero-logo-lockup"
          initial="hidden"
          animate={contentRevealed ? "visible" : "hidden"}
          variants={heroLogoReveal}
        >
          <BrandLogo />
          <span className="brand-word">{heroSupportingContent.eyebrow}</span>
        </motion.div>
        <MaskRevealH1
          className="arch-hero-title mt-8 font-display"
          initial="hidden"
          animate={contentRevealed ? "visible" : "hidden"}
          variants={heroHeadingReveal}
          data-parallax-text
        >
          {hero.heading
            .split(/\n+/)
            .map((line) => line.trim())
            .filter(Boolean)
            .map((line) => (
              <span key={line} className="arch-title-line">
                {renderArchitecturalText(line)}
              </span>
            ))}
        </MaskRevealH1>
        <ArchitecturalText
          className="arch-hero-subtitle mt-8 max-w-2xl"
          initial="hidden"
          animate={contentRevealed ? "visible" : "hidden"}
          variants={heroDescriptionReveal}
        >
          {isMobileHero ? heroSupportingContent.mobileDescription : hero.description}
        </ArchitecturalText>
        <motion.div
          className="arch-hero-actions"
          initial="hidden"
          animate={contentRevealed ? "visible" : "hidden"}
          variants={heroActionsReveal}
        >
          {isMobileHero ? (
            <a href="#works" className="arch-hero-cta is-primary" onClick={(event) => onAnchorNavigate(event, "#works")}>
              <span>View Works</span>
              <ArrowUpRight aria-hidden="true" />
            </a>
          ) : (
            <>
              <a href={hero.primaryCtaHref} className="arch-hero-cta is-primary" onClick={(event) => onAnchorNavigate(event, hero.primaryCtaHref)}>
                <span>{hero.primaryCtaText}</span>
                <ArrowUpRight aria-hidden="true" />
              </a>
              <a href={hero.secondaryCtaHref} className="arch-hero-cta" onClick={(event) => onAnchorNavigate(event, hero.secondaryCtaHref)}>
                <span>{hero.secondaryCtaText}</span>
                <ArrowUpRight aria-hidden="true" />
              </a>
            </>
          )}
        </motion.div>
        {!isMobileHero ? (
          <motion.p
            className="mt-6 max-w-2xl text-sm leading-7 text-white/68"
            initial="hidden"
            animate={contentRevealed ? "visible" : "hidden"}
            variants={heroDescriptionReveal}
          >
            {heroSupportingContent.caption}
          </motion.p>
        ) : null}
      </motion.div>
      {isMobileHero ? (
        <motion.a
          href={`#${consultationDeskId}`}
          className="arch-hero-floating-cta"
          onClick={(event) => onAnchorNavigate(event, `#${consultationDeskId}`)}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: contentRevealed ? 1 : 0, y: contentRevealed ? 0 : 16 }}
          transition={{ duration: 0.6, ease: power4Out, delay: contentRevealed ? 0.65 : 0 }}
          style={{ pointerEvents: contentRevealed ? "auto" : "none" }}
        >
          <span>Consultation</span>
          <ArrowUpRight aria-hidden="true" />
        </motion.a>
      ) : null}
      <motion.div
        className="arch-scroll-line absolute bottom-8 left-1/2 z-10 h-16 w-px -translate-x-1/2 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: contentRevealed ? 1 : 0 }}
        transition={{ duration: 0.75, ease: power4Out, delay: contentRevealed ? 0.8 : 0 }}
      >
        <span />
      </motion.div>
    </section>
  );
}



function portfolioCardClass(project: ArchitectureProjectView, index: number) {
  if (index === 0) return "is-featured";
  if (project.featured) return "is-wide";
  if (index % 6 === 1) return "is-tall";
  if (index % 6 === 2) return "is-wide";
  if (index % 6 === 4) return "is-quiet";
  return "";
}

function projectGallery(project: ArchitectureProjectView) {
  return Array.from(new Set([project.image, ...project.galleryImages].filter(Boolean))).slice(0, 6);
}

function PortfolioProjectCard({
  project,
  index,
  onSelect
}: {
  project: ArchitectureProjectView;
  index: number;
  onSelect: (project: ArchitectureProjectView) => void;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], reduceMotion ? ["0%", "0%"] : ["-7%", "7%"]);

  return (
    <motion.button
      ref={ref}
      type="button"
      className={`arch-portfolio-card ${portfolioCardClass(project, index)}`}
      variants={reveal}
      onClick={() => onSelect(project)}
    >
      <motion.span className="arch-portfolio-image-mask" variants={projectBoardReveal}>
        <motion.span className="arch-portfolio-image-plane" style={{ y: imageY }} variants={imageScaleReveal} data-arch-project-image>
          <Image
            src={project.image}
            alt={project.alt}
            fill
            priority={index === 0}
            sizes={index === 0 ? "(min-width: 1280px) 58vw, (min-width: 1024px) 54vw, 100vw" : "(min-width: 1280px) 34vw, (min-width: 1024px) 42vw, 100vw"}
            className="object-cover"
          />
        </motion.span>
      </motion.span>
      <span className="arch-portfolio-shade" aria-hidden="true" />
      <span className="arch-portfolio-index">{project.number}</span>
      <span className="arch-portfolio-content">
        <span className="arch-portfolio-kicker">{project.projectType}</span>
        <span className="arch-portfolio-title">{project.title}</span>
        <span className="arch-portfolio-description">{project.description}</span>
        <span className="arch-portfolio-location">{project.location}</span>
      </span>
      <span className="arch-portfolio-arrow" aria-hidden="true">
        <ArrowUpRight />
      </span>
    </motion.button>
  );
}

function compactLocation(location: string) {
  return location.split(",")[0]?.trim() || location;
}

function completedYear(project: ArchitectureProjectView) {
  return `Completed ${project.year}`;
}

function highlightProjectType(projectType: string) {
  if (/(villa|residence|estate|house)/i.test(projectType)) return "Private Residence";
  if (/(office|commercial|pavilion)/i.test(projectType)) return "Commercial Architecture";
  return projectType;
}

function designApproach(project: ArchitectureProjectView) {
  return [
    `Material selection for ${project.title} is guided by natural stone, warm surfaces and durable details that age with quiet confidence.`,
    "Spatial planning is organized around calm thresholds, courtyard moments and connected living zones so movement through the project feels composed rather than forced.",
    "Climate response shapes shaded edges, cross ventilation and deep openings, while natural lighting is calibrated to bring softness into the interiors throughout the day."
  ];
}

function numericMetric(value: string) {
  const match = value.match(/^(.*?)([\d,]+)(.*)$/);
  if (!match) return null;

  return {
    prefix: match[1],
    value: Number(match[2].replace(/,/g, "")),
    suffix: match[3]
  };
}

function ProjectMetric({ value, label }: { value: string; label: string }) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const metric = numericMetric(value);

  useEffect(() => {
    if (!metric || reduceMotion) return;

    let frame = 0;
    const startedAt = performance.now();
    const duration = 1100;
    const formatter = new Intl.NumberFormat("en-IN", { useGrouping: !/(completed|planned)/i.test(metric.prefix) });

    const tick = (time: number) => {
      const progress = Math.min(1, (time - startedAt) / duration);
      const eased = 1 - Math.pow(1 - progress, 4);
      const next = Math.round(metric.value * eased);

      if (ref.current) {
        ref.current.textContent = `${metric.prefix}${formatter.format(next)}${metric.suffix}`;
      }

      if (progress < 1) {
        frame = window.requestAnimationFrame(tick);
      }
    };

    frame = window.requestAnimationFrame(tick);
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [metric, reduceMotion]);

  return (
    <div className="arch-project-case-metric" data-modal-reveal>
      <span ref={ref}>{value}</span>
      <small>{label}</small>
    </div>
  );
}

function ProjectDetailModal({
  project,
  onClose,
  onConsultationClick
}: {
  project: ArchitectureProjectView;
  onClose: () => void;
  onConsultationClick: (event: MouseEvent<HTMLAnchorElement>) => void;
}) {
  const gallery = projectGallery(project);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const approach = designApproach(project);
  const features = ["Courtyard Planning", "Natural Ventilation", "Stone Materials", "Luxury Living"];
  const metrics = [
    { value: project.area || project.scale, label: "Scale" },
    { value: highlightProjectType(project.projectType), label: "Project Type" },
    { value: compactLocation(project.location), label: "Location" },
    { value: completedYear(project), label: "Timeline" }
  ];

  const showPreviousImage = useCallback(() => {
    setLightboxIndex((index) => (index === null ? gallery.length - 1 : (index - 1 + gallery.length) % gallery.length));
  }, [gallery.length]);

  const showNextImage = useCallback(() => {
    setLightboxIndex((index) => (index === null ? 0 : (index + 1) % gallery.length));
  }, [gallery.length]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (lightboxIndex !== null) {
          setLightboxIndex(null);
          return;
        }

        onClose();
      }

      if (lightboxIndex !== null && event.key === "ArrowLeft") showPreviousImage();
      if (lightboxIndex !== null && event.key === "ArrowRight") showNextImage();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    architectureLenis?.stop?.();
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      architectureLenis?.start?.();
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [lightboxIndex, onClose, showNextImage, showPreviousImage]);

  useEffect(() => {
    if (reduceMotion) return;

    let cancelled = false;
    let context: { revert: () => void } | null = null;

    void Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([gsapModule, scrollModule]) => {
      if (cancelled || !modalRef.current || !bodyRef.current) return;

      const { gsap } = gsapModule;
      const { ScrollTrigger } = scrollModule;
      gsap.registerPlugin(ScrollTrigger);

      context = gsap.context(() => {
        const scroller = bodyRef.current;

        gsap.utils.toArray<HTMLElement>("[data-modal-reveal]", modalRef.current).forEach((item) => {
          gsap.fromTo(
            item,
            { opacity: 0, y: 28 },
            {
              opacity: 1,
              y: 0,
              duration: 0.78,
              ease: "power4.out",
              scrollTrigger: {
                trigger: item,
                scroller,
                start: "top 88%",
                once: true
              }
            }
          );
        });

        gsap.utils.toArray<HTMLElement>("[data-modal-image]", modalRef.current).forEach((item) => {
          const image = item.querySelector("img");

          gsap.fromTo(
            item,
            { clipPath: "inset(0% 0% 100% 0%)" },
            {
              clipPath: "inset(0% 0% 0% 0%)",
              duration: 1.05,
              ease: "power4.out",
              scrollTrigger: {
                trigger: item,
                scroller,
                start: "top 88%",
                once: true
              }
            }
          );

          if (image) {
            gsap.fromTo(
              image,
              { scale: 1.08 },
              {
                scale: 1,
                duration: 1.18,
                ease: "power4.out",
                scrollTrigger: {
                  trigger: item,
                  scroller,
                  start: "top 88%",
                  once: true
                }
              }
            );
          }
        });

        ScrollTrigger.refresh();
      }, modalRef);
    });

    return () => {
      cancelled = true;
      context?.revert();
    };
  }, [project.id, reduceMotion]);

  return (
    <motion.div
      ref={modalRef}
      className="arch-project-modal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.28, ease: easeOut }}
      onClick={(event) => {
        if (event.currentTarget === event.target) onClose();
      }}
    >
      <motion.article
        className="arch-project-modal-panel"
        initial={{ opacity: 0, y: 46, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.98 }}
        transition={{ duration: 0.55, ease: power4Out }}
      >
        <button type="button" className="arch-project-modal-close" onClick={onClose} aria-label="Close project view">
          <X aria-hidden="true" />
        </button>
        <div className="arch-project-modal-hero">
          <Image src={project.image} alt={project.alt} fill priority sizes="(min-width: 1024px) 58vw, 100vw" className="object-cover" />
        </div>
        <div
          className="arch-project-modal-body"
          ref={bodyRef}
          data-lenis-prevent
          data-lenis-prevent-wheel
          data-lenis-prevent-touch
          onWheel={(event) => event.stopPropagation()}
          onTouchStart={(event) => event.stopPropagation()}
          onTouchMove={(event) => event.stopPropagation()}
        >
          <div className="arch-project-modal-copy" data-modal-reveal>
            <p className="arch-kicker text-executive-red">{project.projectType}</p>
            <h3 className="font-display">{project.title}</h3>
            <p>{project.description}</p>
          </div>
          <dl className="arch-project-modal-meta" data-modal-reveal>
            <div>
              <dt>Location</dt>
              <dd>{project.location}</dd>
            </div>
            <div>
              <dt>Project Type</dt>
              <dd>{project.projectType}</dd>
            </div>
            <div>
              <dt>Year</dt>
              <dd>{project.year}</dd>
            </div>
            <div>
              <dt>Scale</dt>
              <dd>{project.area || project.scale}</dd>
            </div>
          </dl>

          <div className="arch-project-case-metrics">
            {metrics.map((metric) => (
              <ProjectMetric key={metric.label} value={metric.value} label={metric.label} />
            ))}
          </div>

          <section className="arch-project-story" data-modal-reveal>
            <span>Design Approach</span>
            <h4 className="font-display">Material, climate and light shape the experience.</h4>
            {approach.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </section>

          <section className="arch-project-features" data-modal-reveal>
            <span>Architectural Features</span>
            <ul>
              {features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          </section>

          <section className="arch-project-gallery-section">
            <div className="arch-project-gallery-head" data-modal-reveal>
              <span>Project Gallery</span>
              <p>{gallery.length} studies in material, proportion and atmosphere.</p>
            </div>
            <div className="arch-project-modal-gallery">
              {gallery.map((image, imageIndex) => (
                <button
                  key={`${project.id}-${image}`}
                  type="button"
                  className={imageIndex === 0 ? "is-large" : ""}
                  data-modal-image
                  onClick={() => setLightboxIndex(imageIndex)}
                >
                  <Image
                    src={image}
                    alt={`${project.title} gallery image ${imageIndex + 1}`}
                    fill
                    sizes={imageIndex === 0 ? "(min-width: 1024px) 42vw, 100vw" : "(min-width: 1024px) 24vw, 100vw"}
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </section>

          <div className="arch-project-modal-cta" data-modal-reveal>
            <span>Start Similar Project</span>
            <h4 className="font-display">Schedule Consultation</h4>
            <p>Share the site, ambition and atmosphere you want the space to hold.</p>
            <a href={`#${consultationDeskId}`} onClick={onConsultationClick}>
              <span>Schedule Consultation</span>
              <ArrowUpRight aria-hidden="true" />
            </a>
          </div>
        </div>
      </motion.article>

      <AnimatePresence>
        {lightboxIndex !== null ? (
          <motion.div
            className="arch-project-lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28, ease: easeOut }}
            onClick={(event) => {
              if (event.currentTarget === event.target) setLightboxIndex(null);
            }}
          >
            <button type="button" className="arch-project-lightbox-close" onClick={() => setLightboxIndex(null)} aria-label="Close gallery viewer">
              <X aria-hidden="true" />
            </button>
            <button type="button" className="arch-project-lightbox-arrow is-prev" onClick={showPreviousImage} aria-label="Previous gallery image">
              <ChevronLeft aria-hidden="true" />
            </button>
            <motion.div
              key={gallery[lightboxIndex]}
              className="arch-project-lightbox-image"
              initial={{ opacity: 0, scale: 0.985, clipPath: "inset(0 0 100% 0)" }}
              animate={{ opacity: 1, scale: 1, clipPath: "inset(0 0 0% 0)" }}
              exit={{ opacity: 0, scale: 0.99 }}
              transition={{ duration: 0.55, ease: power4Out }}
            >
              <Image
                src={gallery[lightboxIndex]}
                alt={`${project.title} enlarged gallery image ${lightboxIndex + 1}`}
                fill
                sizes="100vw"
                className="object-contain"
              />
            </motion.div>
            <button type="button" className="arch-project-lightbox-arrow is-next" onClick={showNextImage} aria-label="Next gallery image">
              <ChevronRight aria-hidden="true" />
            </button>
            <div className="arch-project-lightbox-caption">
              <span>{project.title}</span>
              <small>{String(lightboxIndex + 1).padStart(2, "0")} / {String(gallery.length).padStart(2, "0")}</small>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
}

function WorksSection({ projects }: { projects: ArchitectureProjectView[] }) {
  const [selectedProject, setSelectedProject] = useState<ArchitectureProjectView | null>(null);
  const viewedProjectsRef = useRef(new Set<string>());

  const openProject = useCallback((project: ArchitectureProjectView) => {
    setSelectedProject(project);

    if (viewedProjectsRef.current.has(project.id)) return;
    viewedProjectsRef.current.add(project.id);

    void fetch("/api/architecture/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "project",
        path: window.location.pathname,
        projectId: project.id,
        projectSlug: project.slug
      })
    }).catch(() => undefined);
  }, []);

  const closeProject = useCallback(() => setSelectedProject(null), []);
  const startSimilarProject = useCallback((event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    setSelectedProject(null);

    window.requestAnimationFrame(() => {
      const target = document.getElementById(consultationDeskId);
      if (!target) return;

      void premiumScrollTo(target, () => undefined);
      window.history.replaceState(null, "", `#${consultationDeskId}`);
    });
  }, []);

  return (
    <section id="works" className="arch-works-section arch-portfolio-section bg-white text-nearblack">
      <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-28 lg:px-12 lg:py-36">
        <motion.div className="arch-works-intro" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={staggerReveal} data-arch-section>
          <motion.p className="arch-kicker text-executive-red" variants={reveal}>
            Our Works
          </motion.p>
          <MaskRevealH2 className="arch-section-title font-display" data-parallax-text>
            A living portfolio of private architectural work.
          </MaskRevealH2>
          <ArchitecturalText>
            Residences, work environments and private estates composed through proportion, light, material discipline and long-term purpose.
          </ArchitecturalText>
        </motion.div>

        {projects.length ? (
          <motion.div className="arch-portfolio-grid" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.08 }} variants={delayedStaggerReveal}>
            {projects.map((project, index) => (
              <PortfolioProjectCard key={project.id} project={project} index={index} onSelect={openProject} />
            ))}
          </motion.div>
        ) : (
          <motion.div className="arch-portfolio-empty" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={reveal}>
            <p>Selected architecture works are being curated.</p>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {selectedProject ? <ProjectDetailModal project={selectedProject} onClose={closeProject} onConsultationClick={startSimilarProject} /> : null}
      </AnimatePresence>
    </section>
  );
}

function EditorialPositionSection() {
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const headingY = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [-34, 34]);
  const panelY = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [38, -38]);

  return (
    <section ref={ref} id="editorial" className="arch-editorial-position bg-warm-100 text-nearblack" data-arch-section>
      <div className="mx-auto grid max-w-7xl gap-14 px-5 py-24 sm:px-8 sm:py-28 lg:grid-cols-[0.78fr_1.22fr] lg:px-12 lg:py-36">
        <motion.div className="lg:sticky lg:top-28 lg:h-fit" style={{ y: headingY }} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.32 }} variants={staggerReveal}>
          <motion.p className="arch-kicker text-executive-red" variants={reveal}>
            Editorial Position
          </motion.p>
          <MaskRevealH2 className="arch-section-title mt-5 font-display">Atmosphere is planned before appearance.</MaskRevealH2>
          <motion.div className="arch-editorial-rule" variants={ruleReveal} aria-hidden="true" />
        </motion.div>
        <motion.div className="arch-editorial-panels" style={{ y: panelY }} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.18 }} variants={delayedStaggerReveal}>
          {editorialPanels.map((panel) => (
            <motion.article key={panel.number} variants={staggerReveal}>
              <motion.span variants={reveal}>{panel.number}</motion.span>
              <MaskRevealH3 className="font-display">{panel.title}</MaskRevealH3>
              <ArchitecturalText>{panel.body}</ArchitecturalText>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function ContactSection({ onAnchorNavigate }: { onAnchorNavigate: AnchorNavigateHandler }) {
  const [state, setState] = useState<DeskState>("idle");
  const [message, setMessage] = useState("Every private brief is reviewed by the Ractysh architecture desk.");
  const reduceMotion = useReducedMotion();
  const contactHeroRef = useRef<HTMLDivElement>(null);
  const isContactHeroInView = useInView(contactHeroRef, { once: true, margin: "600px 0px" });
  const consultationImageRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: contactHeroProgress } = useScroll({
    target: contactHeroRef,
    offset: ["start start", "end start"]
  });
  const { scrollYProgress: consultationImageProgress } = useScroll({
    target: consultationImageRef,
    offset: ["start end", "end start"]
  });
  const contactHeroVideoY = useTransform(contactHeroProgress, [0, 1], reduceMotion ? ["0%", "0%"] : ["0%", "12%"]);
  const contactHeroCopyY = useTransform(contactHeroProgress, [0, 1], reduceMotion ? ["0%", "0%"] : ["0%", "-10%"]);
  const consultationImageY = useTransform(consultationImageProgress, [0, 1], reduceMotion ? ["0%", "0%"] : ["8%", "-8%"]);

  const handleContactVideoReady = useCallback((event: SyntheticEvent<HTMLVideoElement>) => {
    const video = event.currentTarget;
    configureHeroVideo(video);
    void video.play().catch(() => undefined);
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    setState("submitting");
    setMessage("Preparing your consultation request for the architecture desk.");

    try {
      const payload = Object.fromEntries(formData.entries());
      const response = await fetch("/api/architecture-consultation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });
      const result = (await response.json().catch(() => ({}))) as { message?: string };

      if (!response.ok) {
        throw new Error(result.message || "Unable to route the consultation.");
      }

      setState("success");
      setMessage("Consultation Request Received. Our team will review your requirements and reach out shortly.");
      form.reset();
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : "Unable to route the consultation.");
    }
  }

  return (
    <section id="consultation" className="arch-contact-section arch-luxury-consultation arch-contact-experience bg-white text-nearblack" data-arch-section>
      <div ref={contactHeroRef} className="arch-contact-hero" data-contact-hero>
        <motion.video
          className="arch-contact-hero-video"
          src={isContactHeroInView ? "/videos/architecture/villa-orbit-golden-hour.mp4" : undefined}
          poster={isContactHeroInView ? "/images/architecture/architecture-hero-film-poster-01.avif" : undefined}
          autoPlay={isContactHeroInView}
          muted
          loop
          playsInline
          preload={isContactHeroInView ? "metadata" : "none"}
          aria-hidden="true"
          data-contact-hero-video
          onCanPlay={handleContactVideoReady}
          onLoadedMetadata={handleContactVideoReady}
          onPlay={handleContactVideoReady}
          onPlaying={handleContactVideoReady}
          style={{ y: contactHeroVideoY }}
        />
        <div className="arch-contact-hero-shade" aria-hidden="true" />
        <motion.div className="arch-contact-hero-copy" style={{ y: contactHeroCopyY }}>
          <div className="arch-contact-hero-lockup" data-contact-reveal>
            <BrandLogo />
            <span>Private Architectural Consultation</span>
          </div>
          <h2 className="arch-contact-hero-title font-display" data-contact-reveal>
            <span>Begin Your</span>
            <span>Next</span>
            <span>Commission.</span>
          </h2>
          <p data-contact-reveal>
            Whether private residence, commercial environment, interior transformation or brand-led space, the studio reviews every brief with discretion, technical clarity and senior design leadership from the first exchange.
          </p>
          <a
            href={`#${consultationDeskId}`}
            className="arch-contact-hero-cta"
            data-contact-reveal
            onClick={(event) => onAnchorNavigate(event, `#${consultationDeskId}`)}
          >
            <span>{ctaSectionContent.primary.label}</span>
            <ArrowUpRight aria-hidden="true" />
          </a>
        </motion.div>
        <div className="arch-contact-hero-meta" data-contact-reveal>
          <span>Architecture Desk</span>
          <span>India / International Commissions / Senior-Led Review</span>
        </div>
      </div>

      <motion.div
        className="arch-contact-trust-panel mx-auto max-w-[1400px] px-5 py-24 sm:px-8 sm:py-32 lg:px-12 lg:py-40"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.16 }}
        variants={staggerReveal}
      >
        <div className="flex flex-col gap-16 lg:gap-24">
          {/* Top: Editorial Headline */}
          <motion.div variants={staggerReveal} className="max-w-4xl">
            <div className="flex items-center gap-4">
              <div className="h-px w-12 bg-executive-red" />
              <motion.p className="text-[0.7rem] font-black uppercase tracking-[0.4em] text-executive-red" variants={reveal}>
                {statisticsContent.kicker}
              </motion.p>
            </div>
            <MaskRevealH2 className="mt-8 font-display text-[4rem] font-light leading-[0.88] tracking-tighter sm:text-[5.5rem] lg:text-[7rem]" data-parallax-text>
              {statisticsContent.title.map((line, i) => (
                <span key={i} className="block whitespace-nowrap">
                  {i % 2 !== 0 ? <span className="italic text-executive-red/90">{line}</span> : line}
                </span>
              ))}
            </MaskRevealH2>
            <motion.p className="mt-10 max-w-xl text-lg leading-relaxed text-nearblack/60 sm:text-xl" variants={reveal}>
              Built across residences, workplaces and specialist commissions, our portfolio is measured by long-term trust, technical precision and the consistency of delivery from brief to handover.
            </motion.p>
          </motion.div>

          {/* Bottom: Compact Metrics Row */}
          <motion.div 
            className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:flex lg:flex-wrap lg:gap-6" 
            variants={delayedStaggerReveal}
          >
            {statisticsContent.metrics.map((metric, idx) => (
              <motion.article 
                key={metric.label} 
                className="group relative flex min-h-[180px] flex-1 flex-col justify-between overflow-hidden rounded-[1rem] border border-nearblack/5 bg-stone-50 p-6 transition-all duration-700 hover:border-executive-red/30 hover:bg-white lg:min-w-[200px] lg:p-7"
                variants={reveal}
                whileHover={{ y: -4 }}
              >
                {/* Background Blueprint Texture */}
                <div className="pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-1000 group-hover:opacity-[0.03]">
                  <svg width="100%" height="100%" className="text-nearblack">
                    <pattern id={`metric-pattern-${idx}`} x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
                      <path d="M 30 0 L 0 0 0 30" fill="none" stroke="currentColor" strokeWidth="1" />
                      <circle cx="30" cy="30" r="1.5" fill="currentColor" />
                    </pattern>
                    <rect width="100%" height="100%" fill={`url(#metric-pattern-${idx})`} />
                  </svg>
                </div>
                
                {/* Spotlight Gradient on Hover */}
                <div className="absolute inset-0 z-0 bg-gradient-to-br from-executive-red/[0.03] to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100" />

                {/* Content */}
                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div>
                    <div className="flex items-end gap-1 overflow-hidden">
                      <span 
                        className="font-display text-[3.5rem] font-light leading-[0.8] tracking-tighter text-nearblack transition-transform duration-700 group-hover:-translate-y-1 sm:text-[4rem]"
                        data-metric-counter
                        data-value={metric.value}
                      >
                        {metric.value}
                      </span>
                      <span className="font-display text-[2rem] font-light text-executive-red transition-transform duration-700 group-hover:-translate-y-2 sm:text-[2.5rem]">
                        {metric.suffix}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <div className="mb-3 h-px w-6 bg-executive-red/30 transition-all duration-700 group-hover:w-12 group-hover:bg-executive-red" />
                    <h3 className="font-display text-base font-medium tracking-tight text-nearblack sm:text-lg">
                      {metric.label}
                    </h3>
                  </div>
                </div>
                
                {/* Luxury Border Reveal */}
                <div className="absolute inset-0 pointer-events-none rounded-[1rem]">
                  <div className="absolute left-6 top-0 h-px w-0 bg-executive-red/40 transition-all duration-700 group-hover:w-[calc(100%-3rem)]" />
                  <div className="absolute bottom-6 left-0 h-0 w-px bg-executive-red/40 transition-all duration-700 group-hover:h-[calc(100%-3rem)]" />
                </div>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-28 lg:px-12 lg:py-36"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.16 }}
        variants={staggerReveal}
      >
        <div className="arch-contact-process grid gap-14 lg:grid-cols-[0.72fr_1.28fr]">
          <motion.div className="lg:sticky lg:top-28 lg:h-fit" variants={staggerReveal}>
            <motion.p className="arch-kicker text-executive-red" variants={reveal}>
              {processContent.kicker}
            </motion.p>
            <MaskRevealH2 className="arch-section-title mt-5 font-display" data-parallax-text>
              {processContent.title}
            </MaskRevealH2>
            <motion.p className="mt-6 max-w-xl text-base leading-8 text-nearblack/66 sm:text-lg" variants={reveal}>
              {processContent.body}
            </motion.p>
          </motion.div>

          <motion.div className="arch-contact-process-list" variants={delayedStaggerReveal}>
            <motion.span
              className="arch-contact-process-line"
              variants={{
                hidden: { scaleY: 0, opacity: 0 },
                visible: { scaleY: 1, opacity: 1, transition: { duration: 1, ease: power4Out } }
              }}
            />
            {processContent.steps.map((step) => (
              <motion.article key={step.number} variants={reveal}>
                <span>{step.number}</span>
                <div>
                  <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-executive-red/90">{step.summary}</p>
                  <h3 className="font-display">{step.name}</h3>
                  <p>{step.body}</p>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </motion.div>

      <FinalContactCTA onAnchorNavigate={onAnchorNavigate} />

      <div id="architecture-consultation-desk" className="arch-consultation-private-grid mx-auto grid max-w-7xl gap-12 px-5 py-24 sm:px-8 sm:py-28 lg:grid-cols-[0.95fr_1.05fr] lg:px-12 lg:py-36">
        <motion.div className="arch-consultation-editorial" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.16 }} variants={staggerReveal}>
          <motion.div className="arch-consultation-image-shell" ref={consultationImageRef} variants={imageReveal}>
            <motion.div className="arch-consultation-image" style={{ y: consultationImageY }} variants={imageScaleReveal}>
              <Image
                src="/images/architecture/ractysh-kerala-courtyard-consultation.webp"
                alt="Premium South Indian contemporary villa courtyard with natural stone, warm lighting, and tropical planting."
                fill
                sizes="(max-width: 1023px) 100vw, 48vw"
                className="object-cover"
              />
            </motion.div>
            <motion.div className="arch-consultation-image-note" variants={formFieldReveal}>
              <span>Private Consultation Desk</span>
              <span>Material, light, site and proportion reviewed together</span>
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div className="arch-consultation-form-stage" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.14 }} variants={staggerReveal}>
          <motion.form className="consultation-desk arch-consultation-desk arch-luxury-consultation-desk" onSubmit={handleSubmit} variants={consultationDeskReveal}>
            <input className="hidden" tabIndex={-1} name="website" autoComplete="off" aria-label="Leave this field empty" />
            <input type="hidden" name="sourcePage" value="architecture-domain" />
            <motion.div className="arch-consultation-form-head" variants={formFieldReveal}>
              <p>RACTYSH ARCHITECTURE</p>
              <h3 className="font-display">
                <span>Architecture</span>
                <span>Begins With</span>
                <span>Clarity.</span>
              </h3>
              <span>Share the site, ambition, budget and the atmosphere you want the project to hold. The architecture desk will review the brief privately and respond with senior direction.</span>
            </motion.div>
            <motion.div className="arch-consultation-field-grid grid gap-4 md:grid-cols-2" variants={staggerReveal}>
              <motion.label variants={formFieldReveal}>
                <span>Name</span>
                <input name="name" autoComplete="name" required placeholder="Principal contact" />
              </motion.label>
              <motion.label variants={formFieldReveal}>
                <span>Email</span>
                <input name="email" type="email" autoComplete="email" required placeholder="studio@example.com" />
              </motion.label>
              <motion.label variants={formFieldReveal}>
                <span>Phone</span>
                <input name="phone" type="tel" autoComplete="tel" placeholder="+91 contact number" />
              </motion.label>
              <motion.div className="arch-projecttype-field" variants={formFieldReveal}>
                <span className="arch-projecttype-label">Project Type</span>
                <ProjectTypeSelect name="projectType" defaultValue="Architectural Design" />
              </motion.div>
              <motion.label variants={formFieldReveal}>
                <span>Location</span>
                <input name="location" placeholder="City / site region" />
              </motion.label>
              <motion.label variants={formFieldReveal}>
                <span>Budget</span>
                <input name="budget" placeholder="Estimated investment range" />
              </motion.label>
              <motion.label className="md:col-span-2" variants={formFieldReveal}>
                <span>Message</span>
                <textarea name="message" rows={5} required placeholder="Describe the site, ambition, timeline and the feeling the space should carry." />
              </motion.label>
            </motion.div>
            <motion.div className="arch-desk-footer" variants={formFieldReveal}>
              <p className={`desk-message ${state === "error" ? "is-error" : ""} ${state === "success" ? "is-success" : ""}`}>{message}</p>
              <motion.button
                className="desk-action arch-consultation-submit"
                type="submit"
                disabled={state === "submitting"}
                whileHover={state === "submitting" ? undefined : { y: -2 }}
                whileTap={state === "submitting" ? undefined : { scale: 0.985 }}
              >
                {state === "submitting" ? <Loader2 className="animate-spin" aria-hidden="true" /> : state === "success" ? <Check aria-hidden="true" /> : null}
                <span>{state === "submitting" ? "Sending Request" : state === "success" ? "Request Received" : "Request Consultation"}</span>
                <ArrowUpRight aria-hidden="true" />
              </motion.button>
            </motion.div>
            <AnimatePresence>
              {state === "success" ? (
                <motion.div
                  className="arch-consultation-success"
                  initial={{ opacity: 0, y: 18, clipPath: "inset(0 0 100% 0)" }}
                  animate={{ opacity: 1, y: 0, clipPath: "inset(0 0 0% 0)" }}
                  exit={{ opacity: 0, y: 12 }}
                  transition={{ duration: 0.72, ease: power4Out }}
                >
                  <Check aria-hidden="true" />
                  <strong>Consultation Request Received.</strong>
                  <span>Our team will review your requirements and reach out shortly.</span>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </motion.form>
        </motion.div>
      </div>

      <ArchitectureJournalFooter onAnchorNavigate={onAnchorNavigate} />
    </section>
  );
}

function FinalContactCTA({ onAnchorNavigate }: { onAnchorNavigate: AnchorNavigateHandler }) {
  return (
    <motion.div
      className="arch-contact-final-cta mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-28 lg:px-12 lg:py-36"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.24 }}
      variants={staggerReveal}
    >
      <motion.p className="arch-kicker arch-consultation-label" variants={reveal}>
        {ctaSectionContent.kicker}
      </motion.p>
      <MaskRevealH2 className="arch-contact-final-title font-display" data-parallax-text>
        <span className="arch-title-line">The right project begins</span>
        <span className="arch-title-line">with the right</span>
        <span className="arch-title-line">conversation.</span>
      </MaskRevealH2>
      <ArchitecturalText className="arch-contact-final-copy" variants={formFieldReveal}>
        {ctaSectionContent.body}
      </ArchitecturalText>
      <motion.div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row" variants={staggerReveal}>
        <motion.a
          className="arch-contact-final-button"
          href={ctaSectionContent.primary.href}
          variants={formFieldReveal}
          onClick={(event) => onAnchorNavigate(event, ctaSectionContent.primary.href)}
        >
          <span>{ctaSectionContent.primary.label}</span>
          <ArrowUpRight aria-hidden="true" />
        </motion.a>
      </motion.div>
      <motion.p className="mt-5 text-[0.78rem] font-semibold uppercase tracking-[0.24em] text-nearblack/52" variants={formFieldReveal}>
        {ctaSectionContent.reassurance}
      </motion.p>
    </motion.div>
  );
}

function ArchitectureJournalFooter({ onAnchorNavigate }: { onAnchorNavigate: AnchorNavigateHandler }) {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterState, setNewsletterState] = useState<DeskState>("idle");
  const [newsletterMessage, setNewsletterMessage] = useState("");
  const [showNewsletterNotice, setShowNewsletterNotice] = useState(false);
  const newsletterSubmitting = newsletterState === "submitting";
  const newsletterSubscribed = newsletterState === "success";

  useEffect(() => {
    if (!newsletterSubscribed) {
      setShowNewsletterNotice(false);
      return;
    }

    setShowNewsletterNotice(true);

    const fadeTimer = window.setTimeout(() => {
      setShowNewsletterNotice(false);
    }, 2800);
    const resetTimer = window.setTimeout(() => {
      setNewsletterState("idle");
      setNewsletterMessage("");
    }, 3600);

    return () => {
      window.clearTimeout(fadeTimer);
      window.clearTimeout(resetTimer);
    };
  }, [newsletterSubscribed]);

  async function handleNewsletterSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (newsletterSubmitting) return;

    const email = newsletterEmail.trim();
    if (!email) {
      setNewsletterState("error");
      setNewsletterMessage("Enter your email address.");
      return;
    }

    setNewsletterState("submitting");
    setNewsletterMessage("Subscribing...");

    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          source: "architecture_footer_newsletter",
        }),
      });
      const payload = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        success?: boolean;
        alreadySubscribed?: boolean;
        message?: string;
      };

      if (!response.ok || payload.ok === false || payload.success === false) {
        throw new Error(payload.message || "Unable to subscribe right now.");
      }

      setNewsletterState("success");
      setNewsletterMessage(payload.alreadySubscribed ? "Already subscribed" : "Subscribed");
      setNewsletterEmail("");
    } catch (error) {
      setNewsletterState("error");
      setNewsletterMessage(
        error instanceof Error
          ? error.message
          : "Unable to subscribe right now. Please try again.",
      );
    }
  }

  return (
    <motion.footer
      className="arch-journal-footer"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.22 }}
      variants={staggerReveal}
    >
      <div className="arch-journal-footer-grid" aria-hidden="true" />
      <div className="arch-journal-footer-inner">
        <motion.div className="arch-journal-footer-top" variants={staggerReveal}>
          <motion.div className="arch-journal-footer-brand" variants={heroLogoReveal}>
            <BrandLogo />
            <span>
              <span aria-hidden="true">&#10022;</span>
              {heroSupportingContent.eyebrow}
            </span>
          </motion.div>
          <motion.a
            className="arch-journal-footer-group-link"
            href="https://ractysh.com"
            target="_blank"
            rel="noreferrer"
            variants={heroLogoReveal}
          >
            <span>Ractysh Group</span>
            <small>{footerContent.legal.notes}</small>
            <ArrowUpRight aria-hidden="true" />
          </motion.a>
        </motion.div>

        <motion.p className="max-w-3xl text-sm leading-8 text-white/66" variants={reveal}>
          {footerContent.brandStatement}
        </motion.p>

        <motion.h2 className="arch-journal-footer-statement font-display" variants={staggerReveal}>
          {architectureFooterStatement.map((line) => (
            <motion.span key={line} variants={maskCopyReveal}>
              {line}
            </motion.span>
          ))}
        </motion.h2>

        <motion.div className="arch-journal-newsletter" variants={reveal}>
          <div className="arch-journal-newsletter-copy">
            <span>Studio Notes</span>
            <p>Receive architecture updates, project stories and design intelligence from Ractysh.</p>
          </div>
          <div>
            <div className={`arch-journal-newsletter-shell ${newsletterSubscribed ? "is-success" : ""}`}>
              <form className="arch-journal-newsletter-form" onSubmit={handleNewsletterSubmit}>
                <label className="sr-only" htmlFor="architecture-newsletter-email">
                  Email address
                </label>
                <span className="arch-journal-newsletter-input-wrap">
                  <Mail aria-hidden="true" />
                  <input
                    id="architecture-newsletter-email"
                    name="email"
                    type="email"
                    required
                    value={newsletterEmail}
                    onChange={(event) => {
                      setNewsletterEmail(event.target.value);
                      if (!newsletterSubmitting) {
                        setNewsletterState("idle");
                        setNewsletterMessage("");
                      }
                    }}
                    aria-describedby="architecture-newsletter-status"
                    placeholder="Email address"
                  />
                </span>
                <button type="submit" disabled={newsletterSubmitting}>
                  {newsletterSubmitting ? (
                    <Loader2 className="animate-spin" aria-hidden="true" />
                  ) : (
                    <ArrowUpRight aria-hidden="true" />
                  )}
                  <span>{newsletterSubmitting ? "Sending" : "Subscribe"}</span>
                </button>
              </form>
              <AnimatePresence>
                {newsletterSubscribed ? (
                  <motion.div
                    className="arch-journal-newsletter-success"
                    role="status"
                    aria-live="polite"
                    initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
                    animate={{
                      opacity: showNewsletterNotice ? 1 : 0,
                      y: showNewsletterNotice ? 0 : 10,
                      filter: showNewsletterNotice ? "blur(0px)" : "blur(8px)",
                    }}
                    exit={{ opacity: 0, y: 10, filter: "blur(8px)" }}
                    transition={{ duration: 0.6, ease: power4Out }}
                  >
                    <Check aria-hidden="true" />
                    <span>{newsletterMessage || "Subscribed"}</span>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
            <p
              id="architecture-newsletter-status"
              className={`arch-journal-newsletter-status ${newsletterState === "error" ? "is-error" : ""}`}
              aria-live="polite"
            >
              {newsletterSubscribed ? "" : newsletterMessage}
            </p>
          </div>
        </motion.div>

        <motion.div className="arch-journal-footer-columns" variants={delayedStaggerReveal}>
          {architectureFooterColumns.map((column) => (
            <motion.div key={column.title} className="arch-journal-footer-column" variants={staggerReveal}>
              <motion.h3 variants={reveal}>{column.title}</motion.h3>
              <motion.div variants={delayedStaggerReveal}>
                {column.items.map((item) =>
                  "href" in item && item.href ? (
                    <motion.a
                      key={item.label}
                      className="arch-journal-footer-link"
                      href={item.href}
                      variants={formFieldReveal}
                      onClick={(event) => onAnchorNavigate(event, item.href)}
                    >
                      {item.label}
                    </motion.a>
                  ) : (
                    <motion.span key={item.label} className="arch-journal-footer-location" variants={formFieldReveal}>
                      {item.label}
                    </motion.span>
                  )
                )}
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div className="arch-journal-footer-strip" variants={reveal}>
          <span>{heroSupportingContent.eyebrow}</span>
          <span>
            {footerContent.locations.items.map((item) => item.label).join(" • ")}
          </span>
          <span>{footerContent.legal.copyright}</span>
        </motion.div>
      </div>
    </motion.footer>
  );
}

export function ArchitectureCinematicExperience({
  hero,
  projects
}: {
  hero: ArchitectureHeroView;
  projects: ArchitectureProjectView[];
}) {
  const rootRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const [heroContentRevealed, setHeroContentRevealed] = useState(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("arch-intro-revealed") === "true";
    }
    return false;
  });
  const [activeSection, setActiveSection] = useState<NavSectionId>("");
  const [navOverLight, setNavOverLight] = useState(false);
  const [navHidden, setNavHidden] = useState(false);
  const lastScrollYRef = useRef(0);

  useEffect(() => {
    document.documentElement.classList.add("arch-intro-lock");
    architectureLenis?.stop?.();
    return () => {
      document.documentElement.classList.remove("arch-intro-lock");
      architectureLenis?.start?.();
    };
  }, []);

  useEffect(() => {
    if (heroContentRevealed) {
      document.documentElement.classList.remove("arch-intro-lock");
      architectureLenis?.start?.();
    } else {
      document.documentElement.classList.add("arch-intro-lock");
      architectureLenis?.stop?.();
    }
  }, [heroContentRevealed]);

  useArchitectureGsap(rootRef, reduceMotion);

  useEffect(() => {
    void fetch("/api/architecture/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "page", path: window.location.pathname })
    }).catch(() => undefined);
  }, []);

  useEffect(() => {
    let frame = 0;

    const updateActiveSection = () => {
      frame = 0;
      const scrollY = Math.max(window.scrollY, 0);
      const scrollDelta = scrollY - lastScrollYRef.current;
      const offset = navOffset() + 120;
      const current = navSectionIds.reduce<NavSectionId>((active, id) => {
        const section = document.getElementById(id);
        if (!section) return active;
        return section.offsetTop - offset <= scrollY ? id : active;
      }, "");

      setActiveSection(current);
      setNavOverLight(scrollY > window.innerHeight * 0.72);

      if (scrollY < 32) {
        setNavHidden(false);
      } else if (Math.abs(scrollDelta) > 8) {
        setNavHidden(scrollDelta > 0 && scrollY > 120);
      }

      lastScrollYRef.current = scrollY;
    };

    const scheduleUpdate = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(updateActiveSection);
    };

    updateActiveSection();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, []);

  const handleAnchorNavigate = useCallback((event: MouseEvent<HTMLAnchorElement>, href: string) => {
    const targetId = scrollTargetFromHref(href);
    if (!targetId) return;

    const target = document.getElementById(targetId);
    if (!target) return;

    event.preventDefault();
    const navId = navIdFromHash(targetId);
    if (navId) setActiveSection(navId);
    setNavHidden(false);
    void premiumScrollTo(target, () => {
      if (navId) setActiveSection(navId);
    });
    window.history.replaceState(null, "", `#${targetId}`);
  }, []);

  const handleHeroContentReveal = useCallback(() => {
    setHeroContentRevealed(true);
    setNavHidden(false);
    try { sessionStorage.setItem("arch-intro-revealed", "true"); } catch { /* noop */ }
  }, []);

  const navVisible = heroContentRevealed && !navHidden;

  return (
    <main ref={rootRef} className="architecture-site bg-white text-nearblack" data-arch-root>
      <SmoothScroll />

      <motion.header
        className={`architecture-nav fixed left-0 right-0 top-0 z-40 ${navOverLight ? "is-over-light" : ""}`}
        initial={{ opacity: 0, y: -24 }}
        animate={{ opacity: navVisible ? 1 : 0, y: navVisible ? 0 : -88 }}
        transition={{ duration: navVisible ? 0.56 : 0.42, ease: power4Out, delay: heroContentRevealed && !navHidden ? 0.12 : 0 }}
        style={{ pointerEvents: navVisible ? "auto" : "none" }}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-12" aria-label="Architecture navigation">
          <Link href="/" className="nav-mark" aria-label="Ractysh Architecture home">
            <BrandLogo />
            <small>Ractysh Architecture</small>
          </Link>
          <div className="architecture-nav-links">
            <a
              href="#services"
              className="architecture-nav-link"
              onClick={(event) => handleAnchorNavigate(event, "#services")}
            >
              Services
            </a>
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`architecture-nav-link ${activeSection === item.id ? "is-active" : ""}`}
                aria-current={activeSection === item.id ? "page" : undefined}
                onClick={(event) => handleAnchorNavigate(event, `#${item.id}`)}
              >
                {item.label}
              </a>
            ))}
          </div>
        </nav>
      </motion.header>

      <HeroFilm hero={hero} onContentReveal={handleHeroContentReveal} onAnchorNavigate={handleAnchorNavigate} />
      <ArchitecturePremiumSections onAnchorNavigate={handleAnchorNavigate} />
      <WorksSection projects={projects} />
      <ArchitectureTestimonials />
      <EditorialPositionSection />
      <ContactSection onAnchorNavigate={handleAnchorNavigate} />

      <ArchitectureStudioAccessWidget />
    </main>
  );
}
