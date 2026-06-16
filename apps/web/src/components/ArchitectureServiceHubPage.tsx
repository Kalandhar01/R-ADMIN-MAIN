"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, CalendarCheck, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

const subServices = [
  {
    number: "01",
    name: "Architectural Design",
    href: "/architectural-design",
    description: "Concept architecture, spatial identity and signature massing for premium residential and commercial developments.",
    image: "/services/showcase-architecture.webp",
    alt: "Premium architectural design concept for a modern villa"
  },
  {
    number: "02",
    name: "Interior Design",
    href: "/interior-design",
    description: "Interior atmosphere, material rhythm and private-luxury spatial experiences for residential and commercial interiors.",
    image: "/visualization/gallery-interior.webp",
    alt: "Premium interior design with refined materials"
  },
  {
    number: "03",
    name: "Structural Design",
    href: "/structural-design",
    description: "Engineering structure with architectural discipline — beams, grids, load paths and QA systems for premium builds.",
    image: "/services/construction-india-commercial-tower.webp",
    alt: "Structural design for premium commercial construction"
  },
  {
    number: "04",
    name: "MEP Design",
    href: "/mep-design",
    description: "Mechanical, electrical and plumbing systems designed for efficiency, compliance and seamless building integration.",
    image: "/visualization/systems-model.webp",
    alt: "MEP design systems for modern buildings"
  },
  {
    number: "05",
    name: "Landscape Design",
    href: "/landscape-design",
    description: "Outdoor environments, terrain logic, planting palettes and arrival sequences shaped as premium landscape experiences.",
    image: "/visualization/gallery-exterior.webp",
    alt: "Modern landscape design for premium developments"
  },
  {
    number: "06",
    name: "Urban Planning",
    href: "/urban-planning",
    description: "Site strategy, zoning logic, circulation networks and master planning for residential, commercial and mixed-use precincts.",
    image: "/visualization/gallery-lobby.webp",
    alt: "Urban planning and master site strategy"
  },
  {
    number: "07",
    name: "3D Model & Visualisation",
    href: "/3d-model-visualisation",
    description: "Photorealistic 3D models, walkthrough-ready presentations and spatial studies for confident design decisions.",
    image: "/visualization/hero-studio.webp",
    alt: "3D model and visualisation studio presentation"
  },
  {
    number: "08",
    name: "Rendering",
    href: "/rendering",
    description: "Cinematic still renders, material studies and decision-grade visual output for architecture and interior projects.",
    image: "/visualization/presentation-standards.webp",
    alt: "Architectural rendering presentation"
  },
  {
    number: "09",
    name: "Furniture Design",
    href: "/furniture-design",
    description: "Custom furniture, joinery and object design for residential, hospitality and commercial interior environments.",
    image: "/visualization/gallery-interior.webp",
    alt: "Premium furniture design for luxury interiors"
  },
  {
    number: "10",
    name: "Architectural Lighting Design",
    href: "/architectural-lighting-design",
    description: "Layered lighting strategies that shape atmosphere, function, display and evening experience for interior and exterior spaces.",
    image: "/visualization/hero-studio.webp",
    alt: "Architectural lighting design for ambient spaces"
  },
  {
    number: "11",
    name: "Elevation Design",
    href: "/elevation-design",
    description: "Facade language, proportion systems and exterior identity designed for lasting architectural presence.",
    image: "/services/showcase-architecture.webp",
    alt: "Elevation design for premium building facades"
  },
  {
    number: "12",
    name: "Commercial Building Design",
    href: "/commercial-building-design",
    description: "Boardroom-grade massing, lobby impression and workplace clarity for premium commercial and enterprise environments.",
    image: "/services/showcase-real-estate.webp",
    alt: "Commercial building design for enterprise environments"
  },
  {
    number: "13",
    name: "Project Management Consultation (PMC)",
    href: "/project-management-consultation",
    description: "Project governance, milestone tracking, reporting rhythm and stakeholder coordination for premium execution.",
    image: "/services/construction-india-site-governance.webp",
    alt: "Project management consultation for premium builds"
  },
  {
    number: "14",
    name: "Logo Design",
    href: "/logo-design",
    description: "Brand identity, visual language and logo systems designed for enterprises, studios and commercial ventures.",
    image: "/services/design-systems-premium-bg.webp",
    alt: "Logo design for brand identity systems"
  }
] as const;

const architectureHeroImage = {
  image: "/architect.webp",
  alt: "Luxury modern architecture landing showcase"
} as const;
const heroImageSizes = "(min-width: 1280px) 56vw, (min-width: 1024px) 52vw, 100vw";

const showcaseItems = [
  {
    title: "Luxury Villas",
    subtitle: "Private residential identity",
    detail: "Facade rhythm, arrival sequence and interior-outdoor transitions shaped as one architectural statement.",
    image: "/services/showcase-architecture.webp",
    alt: "Ultra wide luxury villa architecture showcase"
  },
  {
    title: "Corporate Buildings",
    subtitle: "Executive commercial presence",
    detail: "Boardroom-grade massing, lobby impression and workplace clarity for premium business environments.",
    image: "/services/showcase-real-estate.webp",
    alt: "Corporate building architecture showcase"
  },
  {
    title: "Modern Interiors",
    subtitle: "Material-led spatial atmosphere",
    detail: "Light, stone, timber and proportion are composed to create quiet private-luxury interiors.",
    image: "/visualization/gallery-interior.webp",
    alt: "Modern interior architecture showcase"
  },
  {
    title: "Landscape Environments",
    subtitle: "Arrival and outdoor living",
    detail: "Terrain, planting, hardscape and view corridors are coordinated into a resort-grade exterior presence.",
    image: "/visualization/gallery-exterior.webp",
    alt: "Landscape architecture environment showcase"
  },
  {
    title: "Architectural Renders",
    subtitle: "Decision-grade visualization",
    detail: "Cinematic visual studies reveal scale, material and experience before execution decisions are committed.",
    image: "/visualization/hero-studio.webp",
    alt: "Architectural render showcase"
  }
] as const;

export function ArchitectureServiceHubPage() {
  const rootRef = useRef<HTMLElement>(null);
  const serviceSectionRef = useRef<HTMLElement>(null);
  const serviceTrackRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const showcaseHoverCleanups: Array<() => void> = [];
    const serviceMotion = gsap.matchMedia();

    const context = gsap.context(() => {
      const shouldReduce = Boolean(reduceMotion) || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const revealItems = gsap.utils.toArray<HTMLElement>("[data-ash-reveal]", root);
      const titleLines = gsap.utils.toArray<HTMLElement>("[data-ash-title-line]", root);
      const masks = gsap.utils.toArray<HTMLElement>("[data-ash-mask]", root);
      const heroVisual = root.querySelector<HTMLElement>("[data-ash-hero-visual]");
      const heroImageParallax = root.querySelector<HTMLElement>("[data-ash-hero-image-parallax]");
      const heroImage = root.querySelector<HTMLElement>("[data-ash-hero-image]");
      const panels = gsap.utils.toArray<HTMLElement>("[data-ash-panel]", root);
      const panelImages = gsap.utils.toArray<HTMLElement>("[data-ash-panel-image]", root);
      const showcaseCards = gsap.utils.toArray<HTMLElement>("[data-ash-showcase-card]", root);
      const showcaseWindows = gsap.utils.toArray<HTMLElement>("[data-ash-showcase-window]", root);
      const showcaseImages = gsap.utils.toArray<HTMLElement>("[data-ash-showcase-image]", root);
      const showcaseOverlays = gsap.utils.toArray<HTMLElement>("[data-ash-showcase-overlay]", root);
      const showcaseTitles = gsap.utils.toArray<HTMLElement>("[data-ash-showcase-title]", root);
      const showcaseSubtitles = gsap.utils.toArray<HTMLElement>("[data-ash-showcase-subtitle]", root);
      const showcaseDetails = gsap.utils.toArray<HTMLElement>("[data-ash-showcase-detail]", root);
      const showcaseIcons = gsap.utils.toArray<HTMLElement>("[data-ash-showcase-icon]", root);
      const blueprintPaths = gsap.utils.toArray<SVGPathElement>("[data-ash-draw]", root);
      const mobileServiceCards = gsap.utils.toArray<HTMLElement>("[data-ash-mobile-service-card]", root);

      if (shouldReduce) {
        gsap.set(
          [
            ...revealItems,
            ...titleLines,
            ...masks,
            heroImageParallax,
            heroImage,
            ...panels,
            ...panelImages,
            ...showcaseCards,
            ...showcaseWindows,
            ...showcaseImages,
            ...showcaseOverlays,
            ...showcaseTitles,
            ...showcaseSubtitles,
            ...showcaseDetails,
            ...showcaseIcons,
            ...blueprintPaths,
            ...mobileServiceCards
          ].filter(Boolean),
          {
            clearProps: "all"
          }
        );
        return;
      }

      gsap.to("[data-ash-grid]", {
        x: 64,
        y: 64,
        duration: 34,
        repeat: -1,
        ease: "none"
      });

      gsap.fromTo(
        titleLines,
        { opacity: 0, yPercent: 112, rotateX: -14, transformOrigin: "50% 100%" },
        { opacity: 1, yPercent: 0, rotateX: 0, duration: 1.12, stagger: 0.11, ease: "power4.out" }
      );

      if (heroVisual) {
        gsap.fromTo(
          heroVisual,
          { opacity: 0, y: 16, scale: 0.995 },
          { opacity: 1, y: 0, scale: 1, duration: 1.18, delay: 0.18, ease: "power3.out" }
        );
      }

      if (heroImage) {
        gsap.fromTo(
          heroImage,
          { opacity: 0, scale: 1.03 },
          { opacity: 1, scale: 1, duration: 1.45, delay: 0.22, ease: "power3.out" }
        );
      }

      if (heroImageParallax && heroVisual) {
        gsap.fromTo(
          heroImageParallax,
          { yPercent: 1.6 },
          {
            yPercent: -2.4,
            ease: "none",
            scrollTrigger: {
              trigger: heroVisual,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.5
            }
          }
        );
      }

      revealItems.forEach((item) => {
        gsap.fromTo(
          item,
          { opacity: 0, y: 42 },
          {
            opacity: 1,
            y: 0,
            duration: 0.95,
            ease: "power4.out",
            scrollTrigger: {
              trigger: item,
              start: "top 86%"
            }
          }
        );
      });

      masks.forEach((mask) => {
        gsap.fromTo(
          mask,
          { clipPath: "inset(0 0 100% 0)", y: 28, scale: 1.02 },
          {
            clipPath: "inset(0 0 0% 0)",
            y: 0,
            scale: 1,
            duration: 1.2,
            ease: "power4.out",
            scrollTrigger: {
              trigger: mask,
              start: "top 78%"
            }
          }
        );
      });

      blueprintPaths.forEach((path, index) => {
        const length = path.getTotalLength();
        gsap.fromTo(
          path,
          { strokeDasharray: length, strokeDashoffset: length, opacity: 0 },
          {
            strokeDashoffset: 0,
            opacity: 1,
            duration: 1.8,
            delay: index * 0.06,
            ease: "power3.out",
            repeat: -1,
            repeatDelay: 3.8,
            yoyo: true
          }
        );
      });

      panels.forEach((panel, index) => {
        gsap.fromTo(
          panel,
          { opacity: 0, y: 74, x: index % 2 === 0 ? 40 : -40, scale: 0.965 },
          {
            opacity: 1,
            y: 0,
            x: 0,
            scale: 1,
            duration: 1.05,
            ease: "power4.out",
            scrollTrigger: {
              trigger: panel,
              start: "top 78%"
            }
          }
        );
      });

      panelImages.forEach((image) => {
        gsap.fromTo(
          image,
          { clipPath: "inset(0 0 0 36%)", scale: 1.16 },
          {
            clipPath: "inset(0 0 0 0%)",
            scale: 1,
            duration: 1.25,
            ease: "power4.out",
            scrollTrigger: {
              trigger: image,
              start: "top 78%"
            }
          }
        );
      });

      if (showcaseCards.length) {
        gsap.fromTo(
          showcaseCards,
          { opacity: 0, y: 76, xPercent: 7, clipPath: "inset(0 38% 0 0)" },
          {
            opacity: 1,
            y: 0,
            xPercent: 0,
            clipPath: "inset(0 0% 0 0)",
            duration: 1.05,
            stagger: 0.12,
            ease: "power4.out",
            scrollTrigger: {
              trigger: showcaseCards[0],
              start: "top 78%"
            }
          }
        );
      }

      if (showcaseCards.length) {
        gsap.set(showcaseCards, {
          transformOrigin: "50% 50%",
          x: 0,
          y: 0,
          scaleX: 1,
          scaleY: 1,
          opacity: 1,
          force3D: true
        });
        gsap.set(showcaseWindows, {
          transformOrigin: "50% 50%",
          x: 0,
          y: 0,
          scale: 1,
          force3D: true
        });
        gsap.set(showcaseImages, {
          transformOrigin: "50% 50%",
          x: 0,
          y: 0,
          scale: 1.035,
          force3D: true
        });
        gsap.set(showcaseOverlays, { opacity: 0.9 });
        gsap.set(showcaseTitles, { autoAlpha: 0.92, y: 0 });
        gsap.set(showcaseSubtitles, { autoAlpha: 0.5, y: 8 });
        gsap.set(showcaseDetails, { autoAlpha: 0, y: 18 });
        gsap.set(showcaseIcons, { autoAlpha: 0.72, scale: 0.96 });

        const supportsHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

        if (supportsHover) {
          let activeShowcaseIndex = -1;
          const showcaseHoverTimelines = showcaseCards.map((card, activeIndex) => {
            const timeline = gsap.timeline({
              paused: true,
              defaults: {
                duration: 1.05,
                ease: "power3.out",
                overwrite: "auto"
              },
              onStart: () => {
                showcaseCards.forEach((item, index) => {
                  item.style.zIndex = index === activeIndex ? "20" : String(5 + index);
                });
              },
              onReverseComplete: () => {
                if (activeShowcaseIndex === -1) {
                  showcaseCards.forEach((item) => {
                    item.style.zIndex = "";
                  });
                }
              }
            });

            timeline
              .to(
                showcaseCards,
                {
                  x: (index) => {
                    if (index === activeIndex) return 0;
                    return index < activeIndex ? -24 : 24;
                  },
                  y: (index) => {
                    if (index === activeIndex) return 0;
                    return index < activeIndex ? -18 : 18;
                  },
                  scaleX: (index) => (index === activeIndex ? 1.055 : 0.982),
                  scaleY: (index) => (index === activeIndex ? 1.035 : 0.982),
                  opacity: (index) => (index === activeIndex ? 1 : 0.64),
                  force3D: true
                },
                0
              )
              .to(
                showcaseWindows,
                {
                  x: (index) => {
                    if (index === activeIndex) return 0;
                    return index < activeIndex ? -8 : 8;
                  },
                  scale: (index) => (index === activeIndex ? 1.018 : 0.992),
                  force3D: true
                },
                0
              )
              .to(
                showcaseImages,
                {
                  x: (index) => {
                    if (index === activeIndex) return 0;
                    return index < activeIndex ? -6 : 6;
                  },
                  y: (index) => (index === activeIndex ? -8 : 0),
                  scale: (index) => (index === activeIndex ? 1.095 : 1.02),
                  force3D: true
                },
                0
              )
              .to(showcaseOverlays, { opacity: (index) => (index === activeIndex ? 0.48 : 0.92) }, 0)
              .to(showcaseTitles, { autoAlpha: (index) => (index === activeIndex ? 1 : 0.58), y: (index) => (index === activeIndex ? -8 : 6) }, 0.06)
              .to(showcaseSubtitles, { autoAlpha: (index) => (index === activeIndex ? 1 : 0.2), y: (index) => (index === activeIndex ? 0 : 12) }, 0.1)
              .to(showcaseDetails, { autoAlpha: (index) => (index === activeIndex ? 1 : 0), y: (index) => (index === activeIndex ? 0 : 18) }, 0.14)
              .to(showcaseIcons, { autoAlpha: (index) => (index === activeIndex ? 1 : 0.28), scale: (index) => (index === activeIndex ? 1.08 : 0.88) }, 0.1);

            timeline.progress(0).pause();
            return timeline;
          });

          showcaseCards.forEach((card, index) => {
            const enter = () => {
              if (activeShowcaseIndex === index) return;

              showcaseHoverTimelines.forEach((timeline, timelineIndex) => {
                if (timelineIndex !== index) {
                  timeline.pause(0);
                }
              });

              activeShowcaseIndex = index;
              showcaseHoverTimelines[index]?.play();
            };
            const leave = () => {
              if (activeShowcaseIndex !== index) return;

              showcaseHoverTimelines[index]?.reverse();
              activeShowcaseIndex = -1;
            };
            card.addEventListener("mouseenter", enter);
            card.addEventListener("mouseleave", leave);
            showcaseHoverCleanups.push(() => {
              card.removeEventListener("mouseenter", enter);
              card.removeEventListener("mouseleave", leave);
            });
          });

          showcaseHoverCleanups.push(() => {
            showcaseHoverTimelines.forEach((timeline) => timeline.kill());
          });
        }
      }

      serviceMotion.add("(min-width: 1024px)", () => {
        gsap.to("[data-ash-horizontal-accent]", {
          xPercent: -14,
          ease: "none",
          scrollTrigger: {
            trigger: serviceSectionRef.current ?? root,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.4
          }
        });

        if (!serviceSectionRef.current || !serviceTrackRef.current) return;

        const section = serviceSectionRef.current;
        const track = serviceTrackRef.current;
        const getDistance = () => Math.max(0, track.scrollWidth - section.clientWidth + 80);

        const serviceTween = gsap.to(track, {
          x: () => -getDistance(),
          ease: "none",
          scrollTrigger: {
            id: "ash-service-scroll",
            trigger: section,
            start: "top top",
            end: () => `+=${Math.max(getDistance(), window.innerHeight * 1.65)}`,
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true
          }
        });

        gsap.utils.toArray<HTMLElement>("[data-ash-service-step]", root).forEach((step) => {
          gsap.fromTo(
            step,
            { scale: 0.94, opacity: 0.64 },
            {
              scale: 1,
              opacity: 1,
              ease: "none",
              scrollTrigger: {
                trigger: step,
                containerAnimation: serviceTween,
                start: "left 80%",
                end: "center center",
                scrub: true
              }
            }
          );
        });
      });

      serviceMotion.add("(max-width: 1023px)", () => {
        if (!mobileServiceCards.length) return;

        mobileServiceCards.forEach((card) => {
          gsap.fromTo(
            card,
            { opacity: 0, y: 36, scale: 0.95, transformOrigin: "50% 72%" },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.9,
              ease: "power4.out",
              scrollTrigger: {
                trigger: card,
                start: "top 84%",
                once: true
              }
            }
          );
        });
      });

      gsap.utils.toArray<HTMLElement>("[data-ash-depth]", root).forEach((layer) => {
        const depth = Number(layer.dataset.ashDepth ?? "1");
        gsap.to(layer, {
          yPercent: -8 * depth,
          scale: 1.05,
          ease: "none",
          scrollTrigger: {
            trigger: layer,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.3
          }
        });
      });

      const refreshFrame = window.requestAnimationFrame(() => ScrollTrigger.refresh());
      return () => window.cancelAnimationFrame(refreshFrame);
    }, root);

    return () => {
      showcaseHoverCleanups.forEach((cleanup) => cleanup());
      serviceMotion.revert();
      context.revert();
    };
  }, [reduceMotion]);

  return (
    <article ref={rootRef} className="architecture-service-hub relative overflow-hidden bg-[#fffefa] text-[#15110d]">
      <section className="relative isolate overflow-hidden bg-[#fffefa] px-5 pb-14 pt-24 sm:px-6 md:px-8 lg:min-h-[100svh] lg:px-10 lg:pb-16 lg:pt-28 xl:px-12">
        <ArchitectureAtmosphere />

        <div className="relative z-10 mx-auto grid w-full max-w-[1540px] gap-x-9 gap-y-8 lg:grid-cols-[minmax(26rem,0.78fr)_minmax(0,1fr)] lg:items-center xl:gap-x-12">
          <div className="contents lg:block lg:max-w-[42rem] lg:-translate-y-6">
            <div className="order-1 max-w-[42rem] lg:max-w-none">
              <p data-ash-reveal className="text-xs font-semibold uppercase leading-none tracking-[0.28em] text-[#8B0E14]">
                RACTYSH ARCHITECTURE
              </p>

              <h1
                aria-label="Designing Spaces. Creating Identity."
                className="ash-hero-title mt-6 overflow-hidden font-display text-6xl font-semibold leading-[0.88] tracking-normal text-[#111111] sm:text-7xl lg:text-8xl"
              >
                <span data-ash-title-line className="ash-display-line block">
                  Designing Spaces.
                </span>
                <span data-ash-title-line className="ash-display-line block text-[#8B0E14] [text-shadow:0_18px_52px_rgba(139,14,20,0.16)]">
                  Creating Identity.
                </span>
              </h1>
            </div>

            <p className="order-3 max-w-[28rem] text-base font-medium leading-8 text-[#5f554a] md:text-lg lg:mt-6">
              A premium design studio for architectural, interior, structural, MEP, landscape, urban, 3D, rendering, furniture, lighting, elevation, commercial, PMC and logo design.
            </p>

            <div className="order-4 flex flex-col gap-3 sm:flex-row lg:mt-8">
              <Link
                href="/book-consultation"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[8px] border border-[#8B0E14] bg-[#8B0E14] px-5 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-[#fff8ec] shadow-[0_18px_44px_rgba(139,14,20,0.2)] transition hover:-translate-y-0.5 hover:border-[#B88A44] hover:bg-[#741016]"
              >
                Book Consultation
                <CalendarCheck className="h-4 w-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[8px] border border-[#d8bf82] bg-white/62 px-5 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-[#17120f] transition hover:-translate-y-0.5 hover:border-[#8B0E14]"
              >
                Contact Service Desk
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="#"
                target="_blank"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[8px] border border-[#d8bf82] bg-white/62 px-5 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-[#8B0E14] transition hover:-translate-y-0.5 hover:border-[#8B0E14]"
              >
                For More Details, Check This
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div
            data-ash-hero-visual
            className="ash-hero-showcase order-5 relative min-h-[29rem] overflow-hidden rounded-[28px] border border-[#d8bf82]/62 bg-[#fffdf8] shadow-[0_46px_128px_rgba(72,50,25,0.16),0_18px_46px_rgba(184,138,68,0.08)] sm:min-h-[32rem] md:min-h-[42rem] lg:order-none lg:min-h-[50rem] xl:min-h-[52rem]"
          >
            <div data-ash-hero-image-parallax className="absolute inset-[-2.5%]">
              <Image
                data-ash-hero-image
                fill
                priority
                loading="eager"
                sizes={heroImageSizes}
                src={architectureHeroImage.image}
                alt={architectureHeroImage.alt}
                className="object-cover object-[center_58%]"
              />
            </div>
            <div className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(90deg,rgba(255,253,248,0.04),rgba(255,253,248,0)_48%,rgba(255,253,248,0.1)),linear-gradient(180deg,rgba(255,253,248,0.08)_0%,rgba(255,253,248,0)_50%,rgba(21,17,13,0.18)_100%)]" />
            <div className="pointer-events-none absolute inset-4 z-20 rounded-[22px] border border-[#fffdf8]/62 shadow-[inset_0_1px_0_rgba(255,255,255,0.34)] md:inset-5 md:rounded-[24px]" />
            <div className="pointer-events-none absolute bottom-7 left-7 right-7 z-30 h-px bg-[linear-gradient(90deg,rgba(216,183,101,0.72),rgba(255,253,248,0.2),transparent)]" />
          </div>
        </div>
      </section>

      <section
        id="architecture-service-ecosystem"
        ref={serviceSectionRef}
        className="relative overflow-hidden bg-[#fffdf8] px-5 py-14 text-[#15110d] sm:px-6 md:px-8 lg:min-h-[100svh] lg:py-16 xl:px-12"
      >
        <ArchitectureAtmosphere compact />
        <div data-ash-horizontal-accent className="pointer-events-none absolute left-0 top-16 h-px w-[140vw] bg-[linear-gradient(90deg,transparent,rgba(139,14,20,0.38),rgba(216,183,101,0.68),transparent)]" />

        <div className="relative z-10 mx-auto mb-7 grid max-w-[1480px] gap-5 lg:mb-8 lg:grid-cols-[minmax(0,0.48fr)_minmax(0,0.52fr)] lg:items-end">
          <div>
            <p data-ash-reveal className="text-xs font-semibold uppercase tracking-[0.28em] text-[#8B0E14]">
              Architecture Service Ecosystem
            </p>
            <h2 data-ash-reveal className="mt-4 max-w-[43rem] font-display text-4xl font-black leading-[0.98] tracking-normal text-[#15110d] md:text-5xl xl:text-6xl">
              One Architecture Platform. 14 Specialized Services.
            </h2>
          </div>
          <p data-ash-reveal className="max-w-[35rem] text-base font-medium leading-8 text-[#665b50] md:text-lg">
            A connected design platform where architectural, interior, structural, MEP, landscape, urban, 3D, rendering, furniture, lighting, elevation, commercial, PMC and logo design move as one premium studio workflow.
          </p>
        </div>

        <div className="relative z-10 mx-auto flex max-w-[36rem] flex-col gap-6 lg:hidden">
          {subServices.map((service) => (
            <Link
              key={service.name}
              href={service.href}
              data-ash-mobile-service-card
              className="group overflow-hidden rounded-[24px] border border-[#eadab3] bg-[#fffaf2] text-[#15110d] shadow-[0_22px_64px_rgba(54,34,16,0.12)] ring-1 ring-white/80"
            >
              <figure className="relative aspect-[1.08/1] min-h-[16rem] overflow-hidden bg-[#0f0c0a]">
                <img
                  src={service.image}
                  alt={service.alt}
                  className="h-full w-full object-cover opacity-[0.96] transition duration-[1200ms] ease-out group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,12,10,0.02),rgba(15,12,10,0.32))]" />
                <span className="absolute left-4 top-4 rounded-full border border-white/38 bg-white/86 px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[#8B0E14] shadow-[0_12px_34px_rgba(18,9,10,0.16)] backdrop-blur-xl">
                  {service.number} / 14
                </span>
              </figure>

              <div className="px-5 pb-6 pt-5">
                <h3 className="font-display text-[2.45rem] font-semibold leading-[0.95] tracking-normal text-[#15110d]">
                  {service.name}
                </h3>
                <p className="mt-4 text-[0.96rem] font-medium leading-7 text-[#63584e]">
                  {service.description}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div ref={serviceTrackRef} className="relative z-10 mx-auto hidden max-w-[1480px] flex-col gap-5 lg:flex lg:w-max lg:max-w-none lg:flex-row lg:items-stretch lg:pb-4">
          {subServices.map((service) => (
            <Link
              key={service.name}
              href={service.href}
              data-ash-panel
              data-ash-service-step
              className="ash-service-panel ash-ecosystem-panel group grid min-h-[31rem] overflow-hidden rounded-[8px] border border-[#d8bf82] bg-[#fffaf0] text-[#15110d] shadow-[0_34px_110px_rgba(54,34,16,0.12)] transition-[grid-template-columns,transform,border-color,box-shadow] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:border-[#8B0E14]/36 hover:shadow-[0_46px_140px_rgba(54,34,16,0.18)] lg:min-h-[34rem] lg:w-[82vw] lg:max-w-[1180px] lg:grid-cols-[minmax(0,0.58fr)_minmax(24rem,0.42fr)] lg:hover:grid-cols-[minmax(0,0.64fr)_minmax(23rem,0.36fr)]"
            >
              <figure className="relative min-h-[22rem] overflow-hidden bg-[#0f0c0a] lg:min-h-full">
                <img
                  data-ash-panel-image
                  src={service.image}
                  alt={service.alt}
                  className="h-full w-full object-cover opacity-[0.94] transition duration-[1400ms] ease-out group-hover:scale-[1.06] group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(15,12,10,0.05),rgba(15,12,10,0.08)_48%,rgba(15,12,10,0.44)),linear-gradient(180deg,transparent,rgba(15,12,10,0.38))]" />
                <div className="absolute bottom-6 left-6 rounded-[8px] border border-[#d8b765]/36 bg-[#12090a]/52 px-4 py-3 text-[#fff8ec] shadow-[0_18px_48px_rgba(0,0,0,0.22)] backdrop-blur-xl">
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#d8b765]">Studio Service</span>
                </div>
              </figure>

              <div className="relative flex min-h-[23rem] flex-col p-6 md:p-9 lg:p-10">
                <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.42] [background-image:linear-gradient(rgba(139,14,20,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(184,138,68,0.08)_1px,transparent_1px)] [background-size:42px_42px]" />
                <p className="relative font-display text-8xl font-semibold leading-none tracking-normal text-[#8B0E14] md:text-9xl">
                  {service.number}
                </p>

                <div className="relative mt-10 max-w-[48rem]">
                  <h3 className="font-display text-5xl font-semibold leading-none tracking-normal text-[#15110d] md:text-6xl">
                    {service.name}
                  </h3>
                  <p className="mt-6 max-w-[32rem] text-base font-medium leading-8 text-[#62564c] md:text-lg">
                    {service.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#fffdf8] px-5 py-20 text-[#15110d] sm:px-6 md:px-8 lg:py-28 xl:px-12">
        <ArchitectureAtmosphere compact />
        <div className="relative z-10 mx-auto max-w-[1480px]">
          <div className="mb-12 grid gap-8 lg:grid-cols-[minmax(0,0.45fr)_minmax(0,0.55fr)] lg:items-end">
            <div>
              <p data-ash-reveal className="text-xs font-semibold uppercase tracking-[0.28em] text-[#8B0E14]">
                Showcase
              </p>
              <h2 data-ash-reveal className="mt-5 font-display text-5xl font-black leading-[0.95] tracking-normal text-[#15110d] md:text-7xl">
                Ultra-wide architectural presence.
              </h2>
            </div>
            <p data-ash-reveal className="max-w-[34rem] text-base font-medium leading-8 text-[#665b50] md:text-lg">
              Villas, corporate environments, interiors, landscapes, renders and all architecture services are treated as one visual language.
            </p>
          </div>

          <div data-ash-showcase-stage className="ash-showcase-stage flex flex-col gap-5">
            {showcaseItems.map((item, index) => (
              <article
                key={item.title}
                data-ash-showcase-card
                tabIndex={0}
                className={`ash-showcase-card relative overflow-hidden rounded-[8px] border border-white/12 bg-[#0f0c0a] shadow-[0_34px_120px_rgba(0,0,0,0.28)] outline-none focus-visible:ring-2 focus-visible:ring-[#d8b765]/70 ${
                  index === 0 ? "min-h-[34rem] lg:min-h-[36rem]" : "min-h-[25rem] lg:min-h-[29rem]"
                } ${index % 2 === 0 ? "lg:self-start" : "lg:self-end"} lg:w-[84%]`}
              >
                <figure data-ash-showcase-window className="absolute inset-0 overflow-hidden">
                  <img
                    data-ash-showcase-image
                    src={item.image}
                    alt={item.alt}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </figure>
                <div
                  data-ash-showcase-overlay
                  className="absolute inset-0 bg-[linear-gradient(90deg,rgba(13,9,8,0.78),rgba(13,9,8,0.18)_52%,rgba(13,9,8,0.46)),linear-gradient(180deg,rgba(13,9,8,0),rgba(13,9,8,0.72))]"
                />
                <div className="pointer-events-none absolute inset-x-8 top-8 h-px bg-[linear-gradient(90deg,rgba(216,183,101,0.82),rgba(255,248,236,0.2),transparent)] opacity-80" />
                <div className="absolute bottom-0 left-0 right-0 flex flex-wrap items-end justify-between gap-6 p-6 md:p-10">
                  <div className="max-w-[46rem]">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#d8b765]">0{index + 1}</p>
                    <h3 data-ash-showcase-title className="mt-3 font-display text-4xl font-semibold leading-none tracking-normal text-[#fff8ec] md:text-6xl">
                      {item.title}
                    </h3>
                    <p data-ash-showcase-subtitle className="mt-4 text-xs font-semibold uppercase tracking-[0.22em] text-[#d8b765]">
                      {item.subtitle}
                    </p>
                    <div
                      data-ash-showcase-detail
                      className="mt-5 max-w-[33rem]"
                      style={{ opacity: 0, transform: "translate3d(0, 18px, 0)" }}
                    >
                      <span className="block h-px w-28 bg-[linear-gradient(90deg,#d8b765,transparent)]" />
                      <p className="mt-4 text-base font-medium leading-7 text-[#fff8ec]/78 md:text-lg">
                        {item.detail}
                      </p>
                    </div>
                  </div>
                  <span
                    data-ash-showcase-icon
                    className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-[#d8b765]/42 bg-white/10 text-[#d8b765] backdrop-blur-xl"
                  >
                    <Sparkles className="h-5 w-5" />
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden px-5 py-20 sm:px-6 md:px-8 lg:py-28 xl:px-12">
        <ArchitectureAtmosphere compact />
        <div data-ash-mask className="relative mx-auto min-h-[38rem] max-w-[1480px] overflow-hidden rounded-[8px] border border-[#d8b765]/28 bg-[#13090b] px-6 py-10 text-[#fff8ec] shadow-[0_44px_140px_rgba(52,29,15,0.24)] md:px-10 md:py-14 lg:px-14">
          <img
            data-ash-depth="1"
            src="/contact/enterprise-architecture-workspace.webp"
            alt="Architecture consultation workspace"
            className="absolute inset-0 h-[112%] w-full object-cover opacity-[0.58]"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(13,8,8,0.94),rgba(13,8,8,0.55)_52%,rgba(13,8,8,0.78)),radial-gradient(circle_at_76%_24%,rgba(216,183,101,0.2),transparent_30rem)]" />
          <BlueprintDrawing dark className="opacity-10" />
          <div className="relative z-10 flex min-h-[30rem] max-w-[52rem] flex-col justify-end">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#d8b765]">Architecture Consultation</p>
            <h2 className="mt-5 font-display text-5xl font-black leading-[0.92] tracking-normal text-[#fff8ec] md:text-7xl">
              Start Your Design Journey
            </h2>
            <p className="mt-6 max-w-[34rem] text-base font-medium leading-8 text-[#fff8ec]/72 md:text-lg">
              Bring the site, ambition and desired identity. The studio will shape the right path forward.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/book-consultation"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[8px] border border-[#8B0E14] bg-[#8B0E14] px-5 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-[#fff8ec] shadow-[0_18px_44px_rgba(139,14,20,0.2)] transition hover:-translate-y-0.5 hover:border-[#d8b765] hover:bg-[#741016]"
              >
                Book Consultation
                <CalendarCheck className="h-4 w-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[8px] border border-[#d8b765] bg-[#fffaf0] px-5 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-[#17120f] transition hover:-translate-y-0.5 hover:border-[#8B0E14] hover:bg-white"
              >
                Contact Service Desk
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="#"
                target="_blank"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[8px] border border-[#d8b765] bg-[#fffaf0] px-5 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-[#8B0E14] transition hover:-translate-y-0.5 hover:border-[#8B0E14] hover:bg-white"
              >
                For More Details, Check This
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </article>
  );
}

function ArchitectureAtmosphere({ compact = false }: { compact?: boolean }) {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden>
      <div className={compact ? "absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(184,138,68,0.05),transparent_28rem),linear-gradient(180deg,#fffefa,#fff8ee)]" : "absolute inset-0 bg-[radial-gradient(circle_at_18%_16%,rgba(184,138,68,0.065),transparent_30rem),radial-gradient(circle_at_82%_18%,rgba(139,14,20,0.016),transparent_28rem),linear-gradient(180deg,#fffefa,#fff9f1)]"} />
      <div
        data-ash-grid
        className="absolute inset-[-10%] opacity-[0.024] [background-image:linear-gradient(rgba(76,58,31,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(76,58,31,0.085)_1px,transparent_1px)] [background-size:64px_64px]"
      />
      <div className="absolute inset-0 opacity-35 bg-[linear-gradient(90deg,rgba(139,14,20,0.01)_1px,transparent_1px),linear-gradient(rgba(184,138,68,0.012)_1px,transparent_1px)] [background-size:18rem_18rem]" />
    </div>
  );
}

function BlueprintDrawing({ className = "", dark = false }: { className?: string; dark?: boolean }) {
  const stroke = dark ? "#d8b765" : "#8B0E14";
  const softStroke = dark ? "#fff8ec" : "#B88A44";

  return (
    <svg className={`pointer-events-none absolute inset-0 z-10 ${className}`} viewBox="0 0 1200 760" preserveAspectRatio="none" aria-hidden>
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path data-ash-draw d="M126 600 L284 336 L450 600 Z" stroke={stroke} strokeWidth="1.4" opacity="0.42" />
        <path data-ash-draw d="M366 600 L598 198 L840 600 Z" stroke={softStroke} strokeWidth="1.6" opacity="0.5" />
        <path data-ash-draw d="M520 600 L520 382 L710 382 L710 600" stroke={stroke} strokeWidth="1.2" opacity="0.34" />
        <path data-ash-draw d="M160 600 H1038" stroke={softStroke} strokeWidth="1.1" opacity="0.36" />
        <path data-ash-draw d="M240 512 H962" stroke={stroke} strokeWidth="1" opacity="0.28" />
        <path data-ash-draw d="M304 424 H898" stroke={softStroke} strokeWidth="1" opacity="0.28" />
        <path data-ash-draw d="M388 336 H812" stroke={stroke} strokeWidth="1" opacity="0.24" />
      </g>
    </svg>
  );
}
