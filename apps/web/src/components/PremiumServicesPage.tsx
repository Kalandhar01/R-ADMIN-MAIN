"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, X } from "lucide-react";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

const heroTitleLines = ["Five Professional Services.", "One Commercial Service Desk."] as const;

type ServiceFilter = "Architecture" | "Construction" | "Real Estate" | "Import & Export" | "OTC Exchange";

interface EnterpriseServicePillar {
  id: string;
  filter: ServiceFilter;
  number: string;
  name: string;
  description: string;
  statement: string;
  href: string;
  image: string;
  alt: string;
  className: string;
  layout: "feature" | "tall" | "wide" | "standard";
}

const cinemaEase = [0.22, 1, 0.36, 1] as const;

const openingNetworkPaths = [
  { id: "architecture", d: "M322 254C284 194 248 138 194 104", delay: 0 },
  { id: "construction", d: "M322 254C368 202 416 142 472 126", delay: 0.16 },
  { id: "real-estate", d: "M322 254C402 254 480 296 514 364", delay: 0.32 },
  { id: "import-export", d: "M322 254C338 318 334 390 302 430", delay: 0.48 },
  { id: "otc-exchange", d: "M322 254C242 256 170 280 126 330", delay: 0.64 }
] as const;

const openingNetworkNodes = [
  { id: "architecture", label: "Architecture", x: 194, y: 104, labelX: 190, labelY: 82 },
  { id: "construction", label: "Construction", x: 472, y: 126, labelX: 462, labelY: 106 },
  { id: "real-estate", label: "Real Estate", x: 514, y: 364, labelX: 496, labelY: 342 },
  { id: "import-export", label: "Import Export", x: 302, y: 430, labelX: 294, labelY: 410 },
  { id: "otc-exchange", label: "OTC Exchange", x: 126, y: 330, labelX: 158, labelY: 306 }
] as const;

const openingStatusCards = [
  { label: "Architecture", value: "Active", className: "card-one", delay: 0.1 },
  { label: "Construction", value: "Live Projects", className: "card-two", delay: 0.32 },
  { label: "Import Export", value: "Global Trade", className: "card-three", delay: 0.52 }
] as const;

const services: EnterpriseServicePillar[] = [
  {
    id: "architecture",
    filter: "Architecture",
    number: "01",
    name: "Architecture Service",
    description: "Luxury building concepts, master planning, facade language and execution-ready design documentation.",
    statement: "Luxury villas, architectural renders and spatial identity systems shaped for premium development decisions.",
    href: "/architecture-service",
    image: "/services/showcase-architecture.webp",
    alt: "Ultra-high-resolution luxury modern architectural residence with refined exterior lighting",
    className: "md:col-span-2 md:row-span-2 xl:col-span-6 xl:row-span-2",
    layout: "feature"
  },
  {
    id: "construction",
    filter: "Construction",
    number: "02",
    name: "Construction Service",
    description: "Full-spectrum construction: civil & MEP engineering, buildings, interiors, landscape, turnkey and 25+ capabilities.",
    statement: "Civil works, MEP, commercial & residential buildings, PEB, interiors, landscape, swimming pools, lifts and mega structures under one accountable system.",
    href: "/construction-service",
    image: "/services/showcase-construction.webp",
    alt: "Ultra-high-resolution active premium construction site with structural teams and site control",
    className: "md:col-span-1 xl:col-span-3",
    layout: "tall"
  },
  {
    id: "real-estate",
    filter: "Real Estate",
    number: "03",
    name: "Real Estate Service",
    description: "Land and building promotion, villa projects, plotted developments, residential & commercial buildings, row houses, gated communities and government-approved lands.",
    statement: "Premium real estate developments — villas, plots, residential, commercial, row houses, gated communities and approved lands.",
    href: "/real-estate-service",
    image: "/services/showcase-real-estate.webp",
    alt: "Premium real estate service for property development",
    className: "md:col-span-1 xl:col-span-3",
    layout: "standard"
  },
  {
    id: "import-export",
    filter: "Import & Export",
    number: "04",
    name: "Import & Export Service",
    description: "Import operations, export operations, supplier lanes and cross-border commerce support.",
    statement: "Global trade, supplier networks and international documentation supported through one operating lane.",
    href: "/import-export-service",
    image: "/services/showcase-import-export.webp",
    alt: "Ultra-high-resolution container ship and port operations for import and export trade support",
    className: "md:col-span-1 xl:col-span-4",
    layout: "wide"
  },
  {
    id: "otc-exchange",
    filter: "OTC Exchange",
    number: "05",
    name: "OTC Exchange Service",
    description: "Crypto based currency exchange, USDT exchange services, FIU registered ISO certified partnerships and KYC verification for OTC transactions.",
    statement: "Crypto and USDT exchange services backed by FIU registered partnerships and ISO certified compliance with full KYC verification.",
    href: "/otc-exchange-service",
    image: "/services/showcase-otc-exchange.webp",
    alt: "OTC exchange service for crypto, USDT and KYC-verified transactions",
    className: "md:col-span-2 xl:col-span-4",
    layout: "wide"
  }
];

export function PremiumServicesPage() {
  return (
    <main className="services-enterprise-page">
      <HeroSection />
      <ServiceShowcase />
      <EnterpriseDesk />
    </main>
  );
}

function HeroSection() {
  const heroRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const section = heroRef.current;
    if (!section) {
      return;
    }

    const reduceMotion = Boolean(shouldReduceMotion);

    const context = gsap.context(() => {
      const revealItems = gsap.utils.toArray<HTMLElement>("[data-services-hero-reveal]");
      const titleChars = gsap.utils.toArray<HTMLElement>("[data-services-hero-char]");
      const ecosystemLabels = gsap.utils.toArray<HTMLElement>("[data-services-ecosystem-label]");
      const imageReveals = gsap.utils.toArray<HTMLElement>("[data-services-image-reveal]");
      const visualLayers = gsap.utils.toArray<HTMLElement>("[data-services-visual-layer]");
      const depthLayers = gsap.utils.toArray<HTMLElement>("[data-services-hero-depth]");
      const goldPaths = gsap.utils.toArray<SVGPathElement>("[data-services-gold-path]");

      if (reduceMotion) {
        gsap.set([...revealItems, ...titleChars, ...ecosystemLabels, ...imageReveals, ...visualLayers], {
          clearProps: "all"
        });
        gsap.set(goldPaths, { strokeDashoffset: 0 });
        return;
      }

      goldPaths.forEach((path) => {
        const length = path.getTotalLength();
        gsap.set(path, {
          strokeDasharray: length,
          strokeDashoffset: length
        });
      });

      gsap.set(revealItems, { opacity: 0, y: 26, filter: "blur(10px)", force3D: true });
      gsap.set(titleChars, {
        opacity: 0,
        yPercent: 112,
        rotateX: -20,
        transformOrigin: "50% 100%",
        force3D: true
      });
      gsap.set(ecosystemLabels, { opacity: 0, y: 20, scale: 0.96, force3D: true });
      gsap.set(imageReveals, {
        opacity: 0,
        clipPath: "inset(0 100% 0 0)",
        scale: 1.035,
        y: 18,
        force3D: true
      });
      gsap.set(visualLayers, { opacity: 0, y: 18, force3D: true });

      const intro = gsap.timeline({ defaults: { ease: "power4.out" } });

      intro
        .to(revealItems, {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.9,
          stagger: 0.08
        })
        .to(
          titleChars,
          {
            opacity: 1,
            yPercent: 0,
            rotateX: 0,
            duration: 0.72,
            stagger: 0.014
          },
          0.12
        )
        .to(
          visualLayers,
          {
            opacity: 1,
            y: 0,
            duration: 0.85,
            stagger: 0.08
          },
          0.22
        )
        .to(
          goldPaths,
          {
            strokeDashoffset: 0,
            duration: 1.35,
            stagger: 0.08,
            ease: "power2.out"
          },
          0.35
        )
        .to(
          imageReveals,
          {
            opacity: 1,
            clipPath: "inset(0 0% 0 0)",
            scale: 1,
            y: 0,
            duration: 1,
            stagger: 0.12
          },
          0.46
        )
        .to(
          ecosystemLabels,
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.72,
            stagger: 0.055
          },
          0.78
        );

      depthLayers.forEach((layer, index) => {
        const depth = Number(layer.dataset.servicesHeroDepth || 1);
        gsap.to(layer, {
          yPercent: -4.5 * depth,
          xPercent: index % 2 === 0 ? -1.8 * depth : 1.8 * depth,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom top",
            scrub: 1.2
          }
        });
      });
    }, section);

    return () => context.revert();
  }, [shouldReduceMotion]);

  return (
    <section ref={heroRef} className="services-enterprise-hero" aria-labelledby="services-page-title">
      <div className="services-enterprise-atmosphere" aria-hidden="true">
        <span className="services-enterprise-atmosphere-grid" data-services-hero-depth="0.7" />
        <span className="services-enterprise-atmosphere-lines" data-services-hero-depth="1" />
        <span className="services-enterprise-atmosphere-glow" data-services-hero-depth="0.45" />
      </div>
      <div className="services-enterprise-shell services-enterprise-hero-grid">
        <div className="services-enterprise-hero-copy">
          <p className="services-enterprise-badge" data-services-hero-reveal>
            RACTYSH SERVICES
          </p>

          <h1
            id="services-page-title"
            className="services-enterprise-title"
            aria-label="Six Professional Services. One Commercial Service Desk."
          >
            <AnimatedHeroTitle />
          </h1>

          <p className="services-enterprise-subtext" data-services-hero-reveal>
            Professional service offerings separated from the Ractysh business division ecosystem.
          </p>

          <span className="services-enterprise-copy-rule" aria-hidden="true" data-services-hero-reveal />
        </div>

        <ArchitecturalOpeningVisual />
      </div>

    </section>
  );
}

function AnimatedHeroTitle() {
  return (
    <>
      {heroTitleLines.map((line) => {
        const words = line.split(" ");

        return (
          <span key={line} className="services-enterprise-title-line" aria-hidden="true">
            {words.map((word, wordIndex) => (
              <Fragment key={`${line}-${word}-${wordIndex}`}>
                <span className="services-enterprise-title-word">
                  {word.split("").map((char, charIndex) => (
                    <span key={`${word}-${char}-${charIndex}`} className="services-enterprise-title-char" data-services-hero-char>
                      {char}
                    </span>
                  ))}
                </span>
                {wordIndex < words.length - 1 ? <span className="services-enterprise-title-space">&nbsp;</span> : null}
              </Fragment>
            ))}
          </span>
        );
      })}
    </>
  );
}

function ArchitecturalOpeningVisual() {
  const shouldReduceMotion = useReducedMotion();
  const reduceMotion = Boolean(shouldReduceMotion);

  return (
    <div className="services-enterprise-opening-visual" aria-hidden="true" data-services-hero-reveal data-services-hero-depth="0.8">
      <div className="services-enterprise-visual-plate" data-services-visual-layer>
        <span className="services-enterprise-blueprint-grid" data-services-visual-layer />
        <span className="services-enterprise-visual-glow" data-services-visual-layer />
        <span className="services-enterprise-depth-rim" data-services-visual-layer />
        <motion.span
          className="services-enterprise-glass-panel panel-one"
          animate={reduceMotion ? undefined : { y: [0, -7, 0], opacity: [0.58, 0.78, 0.58] }}
          transition={{ duration: 7.5, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.span
          className="services-enterprise-glass-panel panel-two"
          animate={reduceMotion ? undefined : { y: [0, 8, 0], opacity: [0.46, 0.66, 0.46] }}
          transition={{ duration: 8.8, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
        />

        <svg className="services-enterprise-blueprint-diagram" viewBox="0 0 640 520" role="presentation" focusable="false">
          <path className="services-enterprise-blueprint-line" d="M72 404H246V252h148v-96h174" />
          <path className="services-enterprise-blueprint-line" d="M108 118h156v92h94v178h164" />
          <path className="services-enterprise-blueprint-line" d="M154 438V302h114V168h236" />
          <path className="services-enterprise-blueprint-line muted" d="M84 82h472v354H84z" />
          <path className="services-enterprise-blueprint-line muted" d="M140 82v354M276 82v354M412 82v354M84 168h472M84 302h472" />
          <path className="services-enterprise-blueprint-gold" data-services-gold-path d="M112 388c68-78 126-124 174-138 64-18 112 15 168-20 32-20 54-58 76-112" />
          <path className="services-enterprise-blueprint-gold fine" data-services-gold-path d="M154 118c58 48 96 88 114 120 26 46 20 94 62 126 34 26 88 30 162 12" />
        </svg>

        <svg className="services-enterprise-network-layer" viewBox="0 0 640 520" role="presentation" focusable="false">
          <defs>
            <linearGradient id="services-network-gold" x1="118" x2="522" y1="96" y2="430" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#B68A35" stopOpacity="0.18" />
              <stop offset="0.5" stopColor="#B68A35" stopOpacity="0.92" />
              <stop offset="1" stopColor="#B68A35" stopOpacity="0.22" />
            </linearGradient>
          </defs>
          {openingNetworkPaths.map((path) => (
            <Fragment key={path.id}>
              <motion.path
                className="services-enterprise-network-line"
                d={path.d}
                initial={reduceMotion ? false : { pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: reduceMotion ? 0 : 1.2, delay: reduceMotion ? 0 : 0.42 + path.delay, ease: cinemaEase }}
              />
              <motion.path
                className="services-enterprise-network-flow"
                d={path.d}
                animate={reduceMotion ? undefined : { strokeDashoffset: [64, 0, -64] }}
                transition={{ duration: 6.5, repeat: Infinity, ease: "linear", delay: path.delay }}
              />
            </Fragment>
          ))}
          {openingNetworkNodes.map((node, index) => (
            <g key={node.id}>
              <motion.circle
                className="services-enterprise-network-node-pulse"
                cx={node.x}
                cy={node.y}
                r="10"
                animate={reduceMotion ? undefined : { r: [8, 13, 8], opacity: [0.18, 0.38, 0.18] }}
                transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut", delay: index * 0.34 }}
              />
              <circle className="services-enterprise-network-node" cx={node.x} cy={node.y} r="5.5" />
              <text className="services-enterprise-network-label" x={node.labelX} y={node.labelY}>
                {node.label}
              </text>
            </g>
          ))}
        </svg>

        <motion.div
          className="services-enterprise-hub-card"
          animate={reduceMotion ? undefined : { y: [0, -5, 0], scale: [1, 1.015, 1] }}
          transition={{ duration: 6.4, repeat: Infinity, ease: "easeInOut" }}
        >
          <span>Ractysh Ecosystem</span>
          <strong>5 Professional Services</strong>
          <em>Connected Commercial Network</em>
        </motion.div>

        <motion.div
          className="services-enterprise-image-slab slab-one"
          data-services-image-reveal
          data-services-hero-depth="1.2"
          whileHover={reduceMotion ? undefined : { y: -8, rotateX: 1.4, rotateY: -1.4, scale: 1.018 }}
          transition={{ duration: 0.55, ease: cinemaEase }}
        >
          <Image
            src="/visualization/gallery-exterior.webp"
            alt=""
            fill
            sizes="(min-width: 1024px) 20vw, 46vw"
            quality={88}
            priority
            className="services-enterprise-visual-image"
          />
        </motion.div>
        <motion.div
          className="services-enterprise-image-slab slab-two"
          data-services-image-reveal
          data-services-hero-depth="0.65"
          whileHover={reduceMotion ? undefined : { y: -7, rotateX: 1.2, rotateY: 1.5, scale: 1.018 }}
          transition={{ duration: 0.55, ease: cinemaEase }}
        >
          <Image
            src="/visualization/gallery-lobby.webp"
            alt=""
            fill
            sizes="(min-width: 1024px) 15vw, 36vw"
            quality={88}
            className="services-enterprise-visual-image"
          />
        </motion.div>
        <motion.div
          className="services-enterprise-image-slab slab-three"
          data-services-image-reveal
          data-services-hero-depth="1"
          whileHover={reduceMotion ? undefined : { y: -6, rotateX: 1.1, rotateY: -1, scale: 1.018 }}
          transition={{ duration: 0.55, ease: cinemaEase }}
        >
          <Image
            src="/services/global-trade-transport.webp"
            alt=""
            fill
            sizes="(min-width: 1024px) 16vw, 40vw"
            quality={88}
            className="services-enterprise-visual-image"
          />
        </motion.div>

        {openingStatusCards.map((card) => (
          <motion.div
            key={card.label}
            className={cn("services-enterprise-status-card", card.className)}
            animate={reduceMotion ? undefined : { y: [0, -7, 0] }}
            transition={{ duration: 6.8, repeat: Infinity, ease: "easeInOut", delay: card.delay }}
          >
            <span>{card.label}</span>
            <strong>{card.value}</strong>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function ServiceShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const [selected, setSelected] = useState<EnterpriseServicePillar | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const reduceMotion = Boolean(shouldReduceMotion);

    const context = gsap.context(() => {
      const revealItems = gsap.utils.toArray<HTMLElement>("[data-services-layout-reveal]");
      const cards = gsap.utils.toArray<HTMLElement>("[data-services-layout-card]");

      if (reduceMotion) {
        gsap.set([...revealItems, ...cards], { clearProps: "all" });
        return;
      }

      gsap.set(revealItems, { opacity: 0, y: 28, filter: "blur(10px)" });
      gsap.set(cards, { opacity: 0, y: 42, rotateX: -4, transformOrigin: "50% 100%" });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 72%",
          once: true
        },
        defaults: { ease: "power4.out" }
      });

      timeline
        .to(revealItems, {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.86,
          stagger: 0.08
        })
        .to(
          cards,
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: 0.92,
            stagger: 0.08
          },
          0.18
        );
    }, section);

    return () => context.revert();
  }, [shouldReduceMotion]);

  useEffect(() => {
    if (!selected) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelected(null);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selected]);

  return (
    <section ref={sectionRef} className="services-enterprise-showcase" aria-labelledby="services-layout-heading">
      <div className="services-enterprise-shell">
        <div className="services-layout-heading">
          <p data-services-layout-reveal>Enterprise Services</p>
          <h2 id="services-layout-heading" data-services-layout-reveal>
            Connected Through One Operating Ecosystem
          </h2>
          <span data-services-layout-reveal>
            Six specialist service lanes are arranged as a premium operating surface. Open any panel to expand the
            context, then move into the dedicated service path.
          </span>
        </div>

        <motion.div className="services-layout-grid" layout>
          {services.map((service, index) => (
            <LayoutGridCard
              key={service.id}
              service={service}
              index={index}
              reduceMotion={Boolean(shouldReduceMotion)}
              onSelect={() => setSelected(service)}
            />
          ))}
        </motion.div>
      </div>

      <AnimatePresence>
        {selected ? (
          <motion.div
            className="services-layout-expanded-layer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: shouldReduceMotion ? 0.01 : 0.42, ease: cinemaEase }}
            onClick={() => setSelected(null)}
          >
            <motion.article
              layoutId={`services-layout-card-${selected.id}`}
              className="services-layout-expanded-card"
              role="dialog"
              aria-modal="true"
              aria-label={selected.name}
              onClick={(event) => event.stopPropagation()}
              transition={{ duration: shouldReduceMotion ? 0.01 : 0.72, ease: cinemaEase }}
            >
              <motion.div layoutId={`services-layout-image-${selected.id}`} className="services-layout-expanded-media">
                <Image
                  src={selected.image}
                  alt={selected.alt}
                  fill
                  sizes="(min-width: 1280px) 62vw, 92vw"
                  quality={95}
                  className="services-layout-expanded-image"
                  priority
                />
              </motion.div>
              <button
                type="button"
                className="services-layout-close"
                aria-label="Close service preview"
                onClick={() => setSelected(null)}
              >
                <X className="h-4 w-4" strokeWidth={1.9} />
              </button>
              <div className="services-layout-expanded-content">
                <motion.p
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: shouldReduceMotion ? 0 : 0.54, delay: 0.12, ease: cinemaEase }}
                >
                  {selected.filter}
                </motion.p>
                <motion.h3
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: shouldReduceMotion ? 0 : 0.58, delay: 0.18, ease: cinemaEase }}
                >
                  {selected.name}
                </motion.h3>
                <motion.span
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: shouldReduceMotion ? 0 : 0.62, delay: 0.24, ease: cinemaEase }}
                >
                  {selected.statement}
                </motion.span>
                <motion.div
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: shouldReduceMotion ? 0 : 0.56, delay: 0.3, ease: cinemaEase }}
                >
                  <Link href={selected.href} className="services-layout-expanded-cta">
                    Explore {selected.name}
                    <ArrowRight className="h-4 w-4" strokeWidth={2.1} />
                  </Link>
                </motion.div>
              </div>
            </motion.article>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}

function LayoutGridCard({
  service,
  index,
  reduceMotion,
  onSelect
}: {
  service: EnterpriseServicePillar;
  index: number;
  reduceMotion: boolean;
  onSelect: () => void;
}) {
  return (
    <motion.button
      type="button"
      layoutId={`services-layout-card-${service.id}`}
      className={cn("services-layout-card group", service.className)}
      data-services-layout-card
      data-layout={service.layout}
      data-pillar={service.id}
      onClick={onSelect}
      whileHover={reduceMotion ? undefined : { y: -8, rotateX: 1.2, rotateY: index % 2 === 0 ? -1.1 : 1.1 }}
      whileTap={reduceMotion ? undefined : { scale: 0.985 }}
      transition={{ duration: reduceMotion ? 0.01 : 0.58, ease: cinemaEase }}
      aria-label={`Open ${service.name}`}
    >
      <motion.div layoutId={`services-layout-image-${service.id}`} className="services-layout-card-media">
        <Image
          src={service.image}
          alt={service.alt}
          fill
          sizes={
            service.layout === "feature"
              ? "(min-width: 1280px) 50vw, (min-width: 768px) 92vw, 100vw"
              : "(min-width: 1280px) 28vw, (min-width: 768px) 46vw, 100vw"
          }
          quality={95}
          priority={index < 2}
          className="services-layout-card-image"
        />
      </motion.div>
      <span className="services-layout-card-glow" aria-hidden="true" />
      <span className="services-layout-card-frame" aria-hidden="true" />
      <span className="services-layout-card-number">{service.number}</span>
      <span className="services-layout-card-copy">
        <span>{service.filter}</span>
        <strong>{service.name}</strong>
      </span>
      <span className="services-layout-card-hint" aria-hidden="true">
        Expand
        <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.1} />
      </span>
    </motion.button>
  );
}

function EnterpriseDesk() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="services-enterprise-desk-section" aria-label="Service desk">
      <div className="services-enterprise-shell">
        <motion.div
          className="services-enterprise-desk"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.72, ease: cinemaEase }}
        >
          <p>Professional Service Desk</p>
          <h2>Coordinate your next mandate through one Ractysh service desk.</h2>
          <div className="services-enterprise-desk-actions">
            <Link href="/book-consultation" className="services-enterprise-button primary">
              Book Consultation
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/contact" className="services-enterprise-button secondary">
              Connect With Service Team
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
