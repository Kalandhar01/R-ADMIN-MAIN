"use client";

import Image from "next/image";
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type TouchEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

interface WhoWeAreEnterpriseShowcaseProps {
  sectionId?: string;
  anchorId?: string;
  className?: string;
  isActive?: boolean;
}

type SlideEffect = "architectural" | "grid" | "routes";

type WhoWeAreSlide = {
  alt: string;
  category: string;
  effect: SlideEffect;
  image: string;
  number: string;
  objectPosition: string;
  subtext: string;
  title: string[];
};

const SLIDE_DURATION_SECONDS = 4.7;
const transition = { duration: 1.2, ease: "easeInOut" as const };

const slides: WhoWeAreSlide[] = [
  {
    alt: "Luxury modern enterprise towers viewed from an architectural low angle",
    category: "Architecture",
    effect: "architectural",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2400&q=80",
    number: "01",
    objectPosition: "center center",
    subtext: "Spatial intelligence, planning and visualization for premium enterprise environments.",
    title: ["Architecture", "built through precision", "and spatial clarity."]
  },
  {
    alt: "Premium construction site with structural work and cranes",
    category: "Construction",
    effect: "grid",
    image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=2400&q=80",
    number: "02",
    objectPosition: "center center",
    subtext: "Civil & MEP engineering, buildings, interiors, landscape, turnkey and 25+ capabilities controlled through one cadence.",
    title: ["25+ construction", "capabilities under", "one accountable system."]
  },
  {
    alt: "Premium real estate frontage and urban development",
    category: "Real Estate",
    effect: "architectural",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=2400&q=80",
    number: "03",
    objectPosition: "center center",
    subtext: "Asset positioning, development advisory and investor-ready property storytelling.",
    title: ["Real estate assets", "positioned for", "enterprise value."]
  },
  {
    alt: "Premium global trade port with shipping containers and cranes",
    category: "Export & Import",
    effect: "routes",
    image: "https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?auto=format&fit=crop&w=2400&q=80",
    number: "04",
    objectPosition: "center center",
    subtext: "Structured export and import operations built for modern global coordination.",
    title: ["Global trade systems", "connected through", "enterprise trade support."]
  },
  {
    alt: "Private finance documentation workspace for transaction review",
    category: "OTC Exchange",
    effect: "routes",
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=2400&q=80",
    number: "05",
    objectPosition: "center center",
    subtext: "Qualified private transaction coordination with documentation and counterparty workflow.",
    title: ["OTC exchange desk", "for private", "enterprise deals."]
  }
];

export function WhoWeAreEnterpriseShowcase({
  sectionId = "frameworks",
  anchorId = "who-we-are",
  className = "",
  isActive = true
}: WhoWeAreEnterpriseShowcaseProps) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isInViewport, setIsInViewport] = useState(false);
  const [renderedImageIndexes, setRenderedImageIndexes] = useState<Set<number>>(() => new Set([0]));
  const sectionRef = useRef<HTMLElement | null>(null);
  const touchStartX = useRef<number | null>(null);
  const reduceMotion = useReducedMotion();
  const carouselVisible = isActive && isInViewport;
  const canAnimate = carouselVisible && !reduceMotion;

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) return undefined;

    if (!("IntersectionObserver" in window)) {
      setIsInViewport(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInViewport(entry.isIntersecting && entry.intersectionRatio >= 0.35);
      },
      { threshold: [0, 0.35, 0.6, 1] }
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  const ensureImagesForSlide = useCallback((index: number) => {
    const nextIndex = (index + 1) % slides.length;

    setRenderedImageIndexes((current) => {
      if (current.has(index) && current.has(nextIndex)) {
        return current;
      }

      const updated = new Set(current);
      updated.add(index);
      updated.add(nextIndex);
      return updated;
    });
  }, []);

  useLayoutEffect(() => {
    if (!carouselVisible) return;

    setActiveSlide(0);
    ensureImagesForSlide(0);
  }, [carouselVisible, ensureImagesForSlide]);

  useEffect(() => {
    if (!carouselVisible) return;

    ensureImagesForSlide(activeSlide);
  }, [activeSlide, carouselVisible, ensureImagesForSlide]);

  useEffect(() => {
    if (carouselVisible) return;

    touchStartX.current = null;
  }, [carouselVisible]);

  useEffect(() => {
    if (reduceMotion || !carouselVisible) return undefined;

    const timer = window.setTimeout(() => {
      setActiveSlide((current) => (current + 1) % slides.length);
    }, SLIDE_DURATION_SECONDS * 1000);

    return () => window.clearTimeout(timer);
  }, [activeSlide, carouselVisible, reduceMotion]);

  function selectSlide(index: number) {
    ensureImagesForSlide(index);
    setActiveSlide(index);
  }

  function handleTouchStart(event: TouchEvent<HTMLElement>) {
    if (!carouselVisible) return;

    touchStartX.current = event.touches[0]?.clientX ?? null;
  }

  function handleTouchEnd(event: TouchEvent<HTMLElement>) {
    if (!carouselVisible) return;
    if (touchStartX.current === null) return;

    const deltaX = (event.changedTouches[0]?.clientX ?? touchStartX.current) - touchStartX.current;
    touchStartX.current = null;

    if (Math.abs(deltaX) < 48) return;

    const direction = deltaX < 0 ? 1 : -1;
    const next = (activeSlide + direction + slides.length) % slides.length;
    ensureImagesForSlide(next);
    setActiveSlide(next);
  }

  const active = slides[activeSlide];
  const motionTransition = canAnimate ? transition : { duration: 0.01 };

  return (
    <section
      ref={sectionRef}
      id={sectionId}
      aria-label="Who we are fullscreen image carousel"
      className={`who-fullscreen-carousel ${carouselVisible ? "is-carousel-visible" : "is-carousel-paused"} relative isolate h-[100svh] min-h-[620px] overflow-hidden bg-black text-[#fff7e8] ${className}`}
      onTouchEnd={handleTouchEnd}
      onTouchStart={handleTouchStart}
    >
      <span id={anchorId} className="absolute -top-24" aria-hidden="true" />

      <div className="absolute inset-0 z-0 overflow-hidden">
        {slides.map((slide, index) => {
          const isActive = index === activeSlide;

          return (
            <motion.div
              key={slide.number}
              aria-hidden={!isActive}
              className="who-fullscreen-image absolute inset-0"
              initial={index === 0 ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 1.08 }}
              animate={isActive ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 1.08 }}
              transition={motionTransition}
            >
              {renderedImageIndexes.has(index) ? (
                <Image
                  src={slide.image}
                  alt={slide.alt}
                  fill
                  priority={index === 0}
                  loading={index === 0 ? undefined : "lazy"}
                  quality={index === 1 ? 82 : 80}
                  sizes="100vw"
                  className="object-cover"
                  decoding="async"
                  style={{ objectPosition: slide.objectPosition }}
                />
              ) : null}
            </motion.div>
          );
        })}
      </div>

      <div className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(to_right,rgba(0,0,0,0.58),rgba(0,0,0,0.18))]" />
      <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(ellipse_at_18%_72%,rgba(0,0,0,0.1),transparent_36rem),linear-gradient(180deg,rgba(0,0,0,0.22),transparent_30%,rgba(0,0,0,0.5))]" />

      <LineSystem effect={active.effect} reduceMotion={!canAnimate} />

      <div className="relative z-30 flex h-full items-end justify-center px-5 pb-[14svh] pt-24 text-center sm:px-8 md:items-center md:justify-start md:px-14 md:pb-0 md:pr-32 md:text-left lg:px-24 lg:pr-44 xl:pr-52">
        <AnimatePresence mode="wait" initial={false}>
          <motion.article
            key={active.number}
            data-who-hero-copy
            aria-live="polite"
            className="max-w-[64rem]"
            initial={!canAnimate ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={!canAnimate ? undefined : { opacity: 0, y: -18 }}
            transition={motionTransition}
          >
            <p
              data-who-section-label
              className="font-manrope text-[0.68rem] font-bold uppercase leading-none tracking-[0.28em] text-[#e7c778] drop-shadow-[0_2px_14px_rgba(0,0,0,0.65)] sm:text-[0.74rem]"
            >
              {active.category}
            </p>
            <h2
              data-who-title
              className="mt-4 font-display text-[3.25rem] font-semibold leading-[0.9] tracking-normal text-[#fff8ea] drop-shadow-[0_16px_44px_rgba(0,0,0,0.62)] max-[374px]:text-[2.78rem] sm:mt-5 sm:text-[5rem] md:text-[4.85rem] lg:text-[4.95rem] xl:text-[6rem] 2xl:text-[7rem]"
            >
              {active.title.map((line) => (
                <span key={line} className="block lg:whitespace-nowrap">
                  {line}
                </span>
              ))}
            </h2>
            <p
              data-who-subtitle
              className="mx-auto mt-5 max-w-[37rem] font-manrope text-[0.98rem] font-medium leading-[1.8] text-[#fff2d6]/88 drop-shadow-[0_8px_26px_rgba(0,0,0,0.7)] sm:text-[1.06rem] md:mx-0 md:text-[1.12rem]"
            >
              {active.subtext}
            </p>
          </motion.article>
        </AnimatePresence>
      </div>

      <CarouselIndicators activeSlide={activeSlide} reduceMotion={!canAnimate} selectSlide={selectSlide} />
    </section>
  );
}

function CarouselIndicators({
  activeSlide,
  reduceMotion,
  selectSlide
}: {
  activeSlide: number;
  reduceMotion: boolean;
  selectSlide: (index: number) => void;
}) {
  const indicatorTransition = reduceMotion ? { duration: 0.01 } : { duration: 0.7, ease: "easeInOut" as const };
  const activeLinePosition = `${((activeSlide + 0.5) / slides.length) * 100}%`;

  return (
    <nav
      aria-label="Who we are carousel slides"
      className="absolute inset-x-0 bottom-[5.25svh] z-40 flex items-center justify-center gap-5 px-5 md:inset-x-auto md:bottom-auto md:right-10 md:top-1/2 md:-translate-y-1/2 md:justify-start md:gap-4 md:px-0 lg:right-16 xl:right-20"
    >
      <div className="relative hidden h-44 w-px shrink-0 md:block" aria-hidden="true">
        <span className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 rounded-full bg-gradient-to-b from-transparent via-[#e7c778]/28 to-transparent" />
        <motion.span
          className="absolute left-1/2 h-12 w-px -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#f2d27d] shadow-[0_0_18px_rgba(231,199,120,0.32)]"
          animate={{ top: activeLinePosition }}
          initial={false}
          transition={indicatorTransition}
        >
          {reduceMotion ? null : (
            <motion.span
              key={activeSlide}
              className="absolute inset-0 origin-top rounded-full bg-gradient-to-b from-[#fff6cf] via-[#f2d27d] to-[#b98d3d]"
              initial={{ opacity: 0.4, scaleY: 0 }}
              animate={{ opacity: 1, scaleY: 1 }}
              transition={{ duration: SLIDE_DURATION_SECONDS, ease: "linear" }}
            />
          )}
        </motion.span>
      </div>

      <div className="flex items-center justify-center gap-5 md:h-44 md:flex-col md:gap-0">
        {slides.map((slide, index) => {
          const isActive = index === activeSlide;

          return (
            <motion.button
              key={slide.number}
              type="button"
              data-who-carousel-indicator
              aria-current={isActive ? "true" : undefined}
              aria-label={`Show ${slide.category}`}
              className="group relative grid h-11 min-w-9 flex-none place-items-center overflow-visible font-manrope text-[0.68rem] font-light leading-none tracking-[0.2em] outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-[#B68A35]/70 md:h-auto md:w-12 md:min-w-0 md:flex-1 md:text-[0.74rem] md:tracking-[0.34em] md:focus-visible:outline-[#e7c778]/70"
              animate={{ opacity: isActive ? 1 : 0.4, scale: isActive ? 1 : 0.96 }}
              transition={indicatorTransition}
              onClick={() => selectSlide(index)}
            >
              {isActive ? (
                <motion.span
                  layoutId="who-active-indicator-glow"
                  className="absolute inset-[-1.15rem] hidden rounded-full bg-[radial-gradient(circle,rgba(231,199,120,0.14),rgba(231,199,120,0.045)_34%,transparent_68%)] md:block"
                  transition={indicatorTransition}
                />
              ) : null}
              <span
                className={`relative transition-colors duration-700 ease-in-out ${
                  isActive
                    ? "text-[#B68A35] drop-shadow-[0_0_12px_rgba(182,138,53,0.24)] md:text-[#fff8ea] md:drop-shadow-[0_0_12px_rgba(231,199,120,0.34)]"
                    : "text-[rgba(255,255,255,0.55)] group-hover:text-white/80 md:text-[#e7c778] md:group-hover:text-[#fff1c0]"
                }`}
              >
                {slide.number}
              </span>
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
}

function LineSystem({ effect, reduceMotion }: { effect: SlideEffect; reduceMotion: boolean }) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={effect}
        className="who-cinematic-lines pointer-events-none absolute inset-0 z-20"
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={reduceMotion ? undefined : { opacity: 0 }}
        transition={reduceMotion ? { duration: 0.01 } : { duration: 1.2, ease: "easeInOut" }}
        aria-hidden="true"
      >
        {effect === "architectural" ? <ArchitecturalLines reduceMotion={reduceMotion} /> : null}
        {effect === "grid" ? <DesignGridLines reduceMotion={reduceMotion} /> : null}
        {effect === "routes" ? <GlobalRouteLines reduceMotion={reduceMotion} /> : null}
      </motion.div>
    </AnimatePresence>
  );
}

function ArchitecturalLines({ reduceMotion }: { reduceMotion: boolean }) {
  const animatedClass = reduceMotion ? "" : "who-line-drift";

  return (
    <svg className="h-full w-full" viewBox="0 0 1440 900" preserveAspectRatio="none">
      <defs>
        <linearGradient id="who-architecture-gold" x1="0%" x2="100%" y1="0%" y2="0%">
          <stop offset="0%" stopColor="#c9a24e" stopOpacity="0" />
          <stop offset="45%" stopColor="#f1d483" stopOpacity="0.62" />
          <stop offset="100%" stopColor="#fff1bd" stopOpacity="0" />
        </linearGradient>
      </defs>
      <g className={animatedClass} fill="none" stroke="url(#who-architecture-gold)" strokeLinecap="round">
        <path className={reduceMotion ? undefined : "who-dashed-line"} d="M54 708 C248 566 322 424 500 402 C702 378 798 210 1088 126" strokeWidth="1.2" />
        <path className={reduceMotion ? undefined : "who-dashed-line"} d="M166 172 C338 236 484 252 642 194 C840 122 1008 164 1304 286" strokeWidth="0.9" />
        <path className={reduceMotion ? undefined : "who-dashed-line"} d="M250 818 L616 472 L1038 690 L1368 354" strokeWidth="0.8" opacity="0.55" />
        <path d="M104 786 L438 458 M438 458 L892 296 M892 296 L1236 136" strokeWidth="0.65" opacity="0.42" />
      </g>
    </svg>
  );
}

function DesignGridLines({ reduceMotion }: { reduceMotion: boolean }) {
  const animatedClass = reduceMotion ? "" : "who-grid-drift";

  return (
    <svg className="h-full w-full" viewBox="0 0 1440 900" preserveAspectRatio="none">
      <defs>
        <linearGradient id="who-grid-gold" x1="0%" x2="100%" y1="0%" y2="100%">
          <stop offset="0%" stopColor="#fff0ba" stopOpacity="0" />
          <stop offset="52%" stopColor="#e6c16f" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#c49b46" stopOpacity="0" />
        </linearGradient>
      </defs>
      <g className={animatedClass} stroke="url(#who-grid-gold)" strokeWidth="0.72">
        {Array.from({ length: 8 }, (_, index) => (
          <path key={`v-${index}`} d={`M${250 + index * 118} 70 L${58 + index * 132} 870`} opacity={index % 2 === 0 ? 0.5 : 0.28} />
        ))}
        {Array.from({ length: 7 }, (_, index) => (
          <path key={`h-${index}`} d={`M90 ${150 + index * 96} L1330 ${102 + index * 102}`} opacity={index % 2 === 0 ? 0.48 : 0.24} />
        ))}
        <path className={reduceMotion ? undefined : "who-dashed-line"} d="M292 694 C470 592 610 546 772 564 C936 582 1058 508 1212 360" fill="none" strokeWidth="1" />
      </g>
    </svg>
  );
}

function GlobalRouteLines({ reduceMotion }: { reduceMotion: boolean }) {
  const lineClass = reduceMotion ? "" : "who-dashed-line";
  const nodeClass = reduceMotion ? "" : "who-route-node";

  return (
    <svg className="h-full w-full" viewBox="0 0 1440 900" preserveAspectRatio="none">
      <defs>
        <linearGradient id="who-route-gold" x1="0%" x2="100%" y1="0%" y2="0%">
          <stop offset="0%" stopColor="#c79b3c" stopOpacity="0" />
          <stop offset="36%" stopColor="#f2d37d" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#fff1bd" stopOpacity="0.06" />
        </linearGradient>
      </defs>
      <g fill="none" stroke="url(#who-route-gold)" strokeLinecap="round">
        <path className={lineClass} d="M116 614 C376 304 666 252 1028 416 C1190 490 1280 598 1372 724" strokeWidth="1.05" />
        <path className={lineClass} d="M210 328 C412 458 674 508 936 382 C1102 302 1216 214 1340 160" strokeWidth="0.9" opacity="0.64" />
        <path className={lineClass} d="M312 764 C566 800 770 718 966 570 C1110 460 1218 406 1320 394" strokeWidth="0.82" opacity="0.52" />
      </g>
      {[
        [116, 614],
        [666, 252],
        [1028, 416],
        [1372, 724],
        [210, 328],
        [936, 382],
        [1320, 394]
      ].map(([cx, cy], index) => (
        <circle
          key={`${cx}-${cy}`}
          className={nodeClass}
          cx={cx}
          cy={cy}
          r={index % 3 === 0 ? 3 : 2.4}
          fill="#f2d37d"
          opacity="0.76"
          style={{ animationDelay: `${index * 0.28}s` }}
        />
      ))}
    </svg>
  );
}
