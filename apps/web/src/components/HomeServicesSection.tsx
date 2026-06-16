"use client";

import type { CSSProperties } from "react";
import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useReducedMotion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";
import { useLenis } from "@/components/providers/SmoothScrollProvider";

gsap.registerPlugin(ScrollTrigger);

interface ServiceDivision {
  title: string;
  statement: string;
  href: string;
  image: string;
  imageClassName: string;
  code: string;
  capabilities: string[];
}

const serviceDivisions: ServiceDivision[] = [
  {
    title: "Architecture",
    statement: "Designing spaces that define identity.",
    href: "/architecture",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2600&q=95",
    imageClassName: "object-[48%_52%]",
    code: "ARC",
    capabilities: ["Planning", "Visualization", "Documentation", "Execution Support"]
  },
  {
    title: "Construction",
    statement: "Civil, MEP, buildings, interiors, landscape and turnkey — all under one accountable system.",
    href: "/construction",
    image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=2600&q=95",
    imageClassName: "object-[50%_44%]",
    code: "CON",
    capabilities: ["Civil & MEP", "Building Construction", "Interiors & Finishing", "Turnkey Projects"]
  },
  {
    title: "Real Estate",
    statement: "Land, buildings and communities with lasting value.",
    href: "/real-estate",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2600&q=95",
    imageClassName: "object-[50%_50%]",
    code: "REA",
    capabilities: ["Land & Building Promoters", "Villas & Plots", "Residential & Commercial", "Gated Communities"]
  },
  {
    title: "Import & Export",
    statement: "Connecting markets through global trade.",
    href: "/import-export",
    image: "https://images.unsplash.com/photo-1605745341112-85968b19335b?auto=format&fit=crop&w=2600&q=95",
    imageClassName: "object-[50%_50%]",
    code: "TRD",
    capabilities: ["Global Sourcing", "Supplier Network", "Trade Documentation", "International Movement"]
  },
  {
    title: "OTC Exchange",
    statement: "Crypto currency, USDT exchange and KYC-verified OTC services.",
    href: "/otc-exchange",
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=2600&q=95",
    imageClassName: "object-[50%_48%]",
    code: "OTC",
    capabilities: ["Crypto Currency Exchange", "USDT Exchange", "FIU Registered Partnerships", "KYC Verification"]
  }
];

const themeStyle = {
  "--ractysh-body-color": "rgba(255, 250, 240, 0.78)"
} as CSSProperties;

function StaggerWords({ text }: { text: string }) {
  return (
    <span aria-label={text}>
      {text.split(" ").map((word, index) => (
        <span key={`${word}-${index}`} aria-hidden="true" className="inline-block overflow-hidden align-bottom">
          <span data-service-copy-word className="inline-block">
            {word}
            {index < text.split(" ").length - 1 ? "\u00a0" : ""}
          </span>
        </span>
      ))}
    </span>
  );
}

export function HomeServicesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const lenis = useLenis();
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    if (shouldReduceMotion || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const context = gsap.context(() => {
      const introItems = gsap.utils.toArray<HTMLElement>("[data-services-intro-item]", section);
      const panels = gsap.utils.toArray<HTMLElement>("[data-service-panel]", section);
      const cards = gsap.utils.toArray<HTMLElement>("[data-service-card]", section);
      const images = gsap.utils.toArray<HTMLElement>("[data-service-image]", section);
      const curtains = gsap.utils.toArray<HTMLElement>("[data-service-curtain]", section);
      const depthLayers = gsap.utils.toArray<HTMLElement>("[data-service-depth]", section);
      const progressFill = section.querySelector<HTMLElement>("[data-services-progress-fill]");
      const scrollProgressIndicator = section.querySelector<HTMLElement>("[data-services-scroll-progress]");
      const scrollProgressTitle = section.querySelector<HTMLElement>("[data-services-scroll-progress-title]");
      const scrollProgressCount = section.querySelector<HTMLElement>("[data-services-scroll-progress-count]");
      const markerFills = gsap.utils.toArray<HTMLElement>("[data-services-marker-fill]", section);
      const markerLabels = gsap.utils.toArray<HTMLElement>("[data-services-marker-label]", section);
      const finalStage = section.querySelector<HTMLElement>("[data-services-final]");
      const finalTrack = section.querySelector<HTMLElement>("[data-services-final-track]");
      const finalCards = gsap.utils.toArray<HTMLElement>("[data-services-final-card]", section);
      const finalImages = gsap.utils.toArray<HTMLElement>("[data-services-final-image]", section);
      const finalCopy = gsap.utils.toArray<HTMLElement>("[data-services-final-copy]", section);

      if (!panels.length || !finalStage || !finalTrack) return;

      const panelWords = panels.map((panel) => gsap.utils.toArray<HTMLElement>("[data-service-copy-word]", panel));
      const panelCopyItems = panels.map((panel) => gsap.utils.toArray<HTMLElement>("[data-service-copy-item]", panel));
      const panelCurtains = panels.map((panel) => panel.querySelector<HTMLElement>("[data-service-curtain]"));
      const panelImages = panels.map((panel) => panel.querySelector<HTMLElement>("[data-service-image]"));
      const panelDepth = panels.map((panel) => gsap.utils.toArray<HTMLElement>("[data-service-depth]", panel));

      gsap.set(section, { force3D: true });
      gsap.set(introItems, { opacity: 0, y: 36, force3D: true });
      gsap.set(panels, {
        opacity: 0,
        xPercent: 42,
        scale: 0.93,
        rotateY: -9,
        clipPath: "inset(10% 10% round 8px)",
        transformPerspective: 1500,
        transformOrigin: "50% 54%",
        force3D: true,
        zIndex: (index) => 20 + index
      });
      gsap.set(cards, { y: 24, scale: 0.985, transformOrigin: "50% 58%", force3D: true });
      gsap.set(images, { scale: 1.22, xPercent: 0, yPercent: 0, filter: "saturate(0.78) contrast(1.08)", force3D: true });
      gsap.set(curtains, { xPercent: 0, force3D: true });
      gsap.set(depthLayers, { yPercent: 0, xPercent: 0, force3D: true });
      gsap.set(panelCopyItems.flat(), { opacity: 0, y: 28, force3D: true });
      gsap.set(panelWords.flat(), { opacity: 0, yPercent: 112, rotateX: -20, transformOrigin: "50% 100%", force3D: true });
      gsap.set(markerFills, { scaleX: 0, transformOrigin: "0% 50%", force3D: true });
      gsap.set(markerLabels, { opacity: 0.42, color: "rgba(239, 230, 214, 0.56)" });
      gsap.set(progressFill, { scaleX: 0, transformOrigin: "0% 50%", force3D: true });
      gsap.set(scrollProgressIndicator, { opacity: 0, y: -8, force3D: true });
      gsap.set(finalStage, { opacity: 0, y: 70, scale: 0.965, pointerEvents: "none", force3D: true });
      gsap.set(finalTrack, { xPercent: 12, force3D: true });
      gsap.set(finalCards, {
        opacity: 0,
        x: 180,
        scale: 0.94,
        clipPath: "inset(0% 36% 0% 0% round 8px)",
        transformOrigin: "50% 60%",
        force3D: true
      });
      gsap.set(finalImages, { scale: 1.16, xPercent: 7, force3D: true });
      gsap.set(finalCopy, { opacity: 0, y: 22, force3D: true });

      let currentProgressIndex = -1;

      const setScrollProgressIndex = (index: number) => {
        const safeIndex = Math.min(serviceDivisions.length - 1, Math.max(0, index));

        if (safeIndex === currentProgressIndex) return;

        currentProgressIndex = safeIndex;

        if (scrollProgressTitle) {
          scrollProgressTitle.textContent = serviceDivisions[safeIndex].title;
        }

        if (scrollProgressCount) {
          scrollProgressCount.textContent = `${String(safeIndex + 1).padStart(2, "0")} / ${String(serviceDivisions.length).padStart(2, "0")}`;
        }
      };

      const setScrollProgressVisibility = (visible: boolean) => {
        if (!scrollProgressIndicator) return;

        gsap.to(scrollProgressIndicator, {
          opacity: visible ? 1 : 0,
          y: visible ? 0 : -8,
          duration: 0.32,
          ease: "power2.out",
          overwrite: true
        });
      };

      const activateMarker = (index: number, at: string | number) => {
        const progress = (index + 1) / serviceDivisions.length;

        gsap.set(panels[index], { zIndex: 80 + index });
        setScrollProgressIndex(index);

        timeline.to(
          markerLabels,
          {
            opacity: (labelIndex) => (labelIndex === index ? 1 : labelIndex < index ? 0.76 : 0.42),
            color: (labelIndex) =>
              labelIndex === index ? "#f5d98d" : labelIndex < index ? "rgba(245, 217, 141, 0.72)" : "rgba(239, 230, 214, 0.56)",
            duration: 0.35,
            ease: "power2.out"
          },
          at
        );

        timeline.to(
          markerFills,
          {
            scaleX: (fillIndex) => (fillIndex <= index ? 1 : 0),
            duration: 0.65,
            ease: "power3.out"
          },
          at
        );

        if (progressFill) {
          timeline.to(
            progressFill,
            {
              scaleX: progress,
              duration: 0.72,
              ease: "power2.out"
            },
            at
          );
        }
      };

      const revealPanel = (index: number, at: string | number) => {
        const image = panelImages[index];
        const curtain = panelCurtains[index];

        timeline
          .to(
            panels[index],
            {
              opacity: 1,
              xPercent: 0,
              scale: 1,
              rotateY: 0,
              clipPath: "inset(0% 0% round 0px)",
              duration: 1.08,
              ease: "power4.out"
            },
            at
          )
          .to(
            cards[index],
            {
              y: 0,
              scale: 1,
              duration: 1.15,
              ease: "power4.out"
            },
            at
          )
          .to(
            image,
            {
              scale: 1.035,
              xPercent: -1.8,
              filter: "saturate(0.92) contrast(1.08)",
              duration: 1.42,
              ease: "power3.out"
            },
            at
          )
          .to(
            curtain,
            {
              xPercent: 104,
              duration: 0.92,
              ease: "power4.inOut"
            },
            typeof at === "number" ? at + 0.08 : `${at}+=0.08`
          )
          .to(
            panelCopyItems[index],
            {
              opacity: 1,
              y: 0,
              stagger: 0.08,
              duration: 0.74,
              ease: "power3.out"
            },
            typeof at === "number" ? at + 0.2 : `${at}+=0.2`
          )
          .to(
            panelWords[index],
            {
              opacity: 1,
              yPercent: 0,
              rotateX: 0,
              stagger: 0.035,
              duration: 0.72,
              ease: "power4.out"
            },
            typeof at === "number" ? at + 0.26 : `${at}+=0.26`
          );

        panelDepth[index].forEach((layer, layerIndex) => {
          timeline.to(
            layer,
            {
              xPercent: layerIndex % 2 === 0 ? -2.5 : 2.2,
              yPercent: layerIndex % 2 === 0 ? -5 : 4,
              duration: 1.3,
              ease: "power2.out"
            },
            at
          );
        });

        activateMarker(index, typeof at === "number" ? at + 0.08 : `${at}+=0.08`);
      };

      const exitPanel = (index: number, at: string | number) => {
        const image = panelImages[index];

        timeline
          .to(
            panels[index],
            {
              opacity: 0,
              xPercent: -34,
              scale: 0.945,
              rotateY: 8,
              clipPath: "inset(7% 42% 7% 0% round 8px)",
              duration: 1.02,
              ease: "power3.inOut"
            },
            at
          )
          .to(
            image,
            {
              scale: 1.15,
              xPercent: -7,
              filter: "saturate(0.74) contrast(1.08)",
              duration: 1.02,
              ease: "power3.inOut"
            },
            at
          )
          .to(
            panelCopyItems[index],
            {
              opacity: 0,
              y: -22,
              stagger: 0.035,
              duration: 0.45,
              ease: "power2.in"
            },
            at
          );
      };

      const timeline = gsap.timeline({
        defaults: { overwrite: "auto" },
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${Math.max(window.innerHeight * 7.4, 5400)}`,
          pin: true,
          scrub: 1.08,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onEnter: () => {
            setScrollProgressIndex(0);
            setScrollProgressVisibility(true);
          },
          onEnterBack: () => setScrollProgressVisibility(true),
          onLeave: () => setScrollProgressVisibility(false),
          onLeaveBack: () => setScrollProgressVisibility(false),
          onUpdate: (self) => {
            const currentTime = self.progress * timeline.duration();
            const activeIndex = serviceDivisions.reduce((latestIndex, _, index) => {
              const labelTime = timeline.labels[`division-${index}`] ?? 0;

              return currentTime + 0.04 >= labelTime ? index : latestIndex;
            }, 0);

            setScrollProgressIndex(activeIndex);
          }
        }
      });

      timeline
        .to(introItems, {
          opacity: 1,
          y: 0,
          stagger: 0.09,
          duration: 0.9,
          ease: "power4.out"
        })
        .to("[data-services-ambient='gold']", { opacity: 0.92, scale: 1.06, duration: 1.1, ease: "power2.out" }, 0)
        .to("[data-services-ambient='red']", { opacity: 0.86, xPercent: -4, duration: 1.1, ease: "power2.out" }, 0);

      serviceDivisions.forEach((_, index) => {
        const label = `division-${index}`;
        timeline.addLabel(label, index === 0 ? 0.78 : `division-${index - 1}+=1.62`);

        if (index > 0) {
          exitPanel(index - 1, `${label}-=0.78`);
        }

        revealPanel(index, label);
        timeline.to({}, { duration: 0.88 });
      });

      timeline
        .to(
          introItems,
          {
            opacity: 0,
            y: -28,
            duration: 0.68,
            ease: "power2.inOut"
          },
          "division-0+=1.08"
        )
        .addLabel("ecosystem-showcase", "+=0.1")
        .to(
          panels[serviceDivisions.length - 1],
          {
            opacity: 0,
            xPercent: -22,
            scale: 0.92,
            rotateY: 7,
            clipPath: "inset(8% 35% 8% 0% round 8px)",
            duration: 1,
            ease: "power3.inOut"
          },
          "ecosystem-showcase"
        )
        .to(
          finalStage,
          {
            opacity: 1,
            y: 0,
            scale: 1,
            pointerEvents: "auto",
            duration: 1.05,
            ease: "power4.out"
          },
          "ecosystem-showcase+=0.05"
        )
        .to(
          finalTrack,
          {
            xPercent: 0,
            duration: 1.3,
            ease: "power3.out"
          },
          "ecosystem-showcase+=0.05"
        )
        .to(
          finalCards,
          {
            opacity: 1,
            x: 0,
            scale: 1,
            clipPath: "inset(0% 0% 0% 0% round 8px)",
            stagger: 0.08,
            duration: 0.95,
            ease: "power4.out"
          },
          "ecosystem-showcase+=0.18"
        )
        .to(
          finalImages,
          {
            scale: 1.02,
            xPercent: 0,
            stagger: 0.06,
            duration: 1.1,
            ease: "power3.out"
          },
          "ecosystem-showcase+=0.22"
        )
        .to(
          finalCopy,
          {
            opacity: 1,
            y: 0,
            stagger: 0.05,
            duration: 0.72,
            ease: "power3.out"
          },
          "ecosystem-showcase+=0.42"
        )
        .to(
          progressFill,
          {
            scaleX: 1,
            duration: 0.65,
            ease: "power2.out"
          },
          "ecosystem-showcase+=0.2"
        )
        .to({}, { duration: 1.1 });

      gsap.to("[data-services-ambient='grid']", {
        xPercent: -8,
        yPercent: -6,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom top",
          scrub: 1.4
        }
      });
    }, section);

    const refreshId = requestAnimationFrame(() => {
      lenis?.resize?.();
      ScrollTrigger.refresh();
    });

    return () => {
      cancelAnimationFrame(refreshId);
      context.revert();
    };
  }, [lenis, shouldReduceMotion]);

  return (
    <section
      ref={sectionRef}
      id="services"
      className="relative isolate h-[100svh] min-h-[660px] overflow-hidden bg-[#070606] text-[#fffaf0] motion-reduce:h-auto motion-reduce:min-h-0 motion-reduce:overflow-visible motion-reduce:py-14 md:min-h-[760px]"
      style={themeStyle}
    >
      <div
        data-services-ambient="grid"
        className="pointer-events-none absolute inset-0 opacity-[0.18] [background-image:linear-gradient(rgba(255,250,240,0.14)_1px,transparent_1px),linear-gradient(90deg,rgba(214,180,95,0.12)_1px,transparent_1px)] [background-size:82px_82px] [mask-image:radial-gradient(ellipse_at_50%_48%,black_0%,rgba(0,0,0,0.5)_58%,transparent_88%)]"
        aria-hidden="true"
      />
      <div
        data-services-ambient="gold"
        className="pointer-events-none absolute -right-[14rem] top-[-10rem] h-[38rem] w-[38rem] rounded-full bg-[radial-gradient(circle,rgba(214,180,95,0.34),rgba(214,180,95,0.12)_42%,transparent_70%)] opacity-70 blur-3xl"
        aria-hidden="true"
      />
      <div
        data-services-ambient="red"
        className="pointer-events-none absolute -left-[16rem] bottom-[-16rem] h-[42rem] w-[42rem] rounded-full bg-[radial-gradient(circle,rgba(139,17,24,0.44),rgba(139,17,24,0.15)_46%,transparent_72%)] opacity-70 blur-3xl"
        aria-hidden="true"
      />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(7,6,6,0.34)_0%,rgba(7,6,6,0)_28%,rgba(7,6,6,0.62)_100%),radial-gradient(ellipse_at_50%_38%,rgba(255,250,240,0.08),transparent_48%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(214,180,95,0.8),transparent)]" />
      <div
        data-services-scroll-progress
        className="pointer-events-none fixed right-4 top-[5.25rem] z-[90] w-[10.25rem] rounded-[8px] border border-[#d6b45f]/28 bg-[#070606]/70 px-3 py-2.5 opacity-0 shadow-[0_18px_54px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-2xl sm:right-6 md:right-8 md:top-[6.25rem]"
        aria-hidden="true"
      >
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-[#8b1118] shadow-[0_0_18px_rgba(139,17,24,0.75)]" />
          <span className="text-[0.54rem] font-semibold uppercase leading-none tracking-[0.14em] text-[#d6b45f]">
            Scroll Progress
          </span>
        </div>
        <div className="mt-2 flex items-end justify-between gap-2">
          <span data-services-scroll-progress-title className="truncate text-[0.56rem] font-semibold uppercase leading-none tracking-[0.08em] text-[#fffaf0]/62">
            Architecture
          </span>
          <span data-services-scroll-progress-count className="whitespace-nowrap font-display text-[1.05rem] font-semibold leading-none tracking-[0] text-[#fffaf0]">
            01 / 05
          </span>
        </div>
      </div>

      <div className="absolute left-5 right-5 top-6 z-40 mx-auto max-w-[94rem] motion-reduce:relative motion-reduce:left-auto motion-reduce:right-auto motion-reduce:top-auto motion-reduce:px-5 md:left-8 md:right-8 md:top-8">
        <div className="grid gap-5 md:grid-cols-[minmax(0,0.8fr)_minmax(18rem,0.42fr)] md:items-start">
          <div>
            <p
              data-services-intro-item
              className="text-[0.76rem] font-semibold uppercase leading-none tracking-[0] text-[#d6b45f] motion-reduce:opacity-100"
            >
              Services Overview
            </p>
            <p
              data-services-intro-item
              className="mt-3 text-[0.68rem] font-semibold uppercase leading-none tracking-[0] text-[#fffaf0]/58 motion-reduce:opacity-100"
            >
              RACTYSH ENTERPRISE DIVISIONS
            </p>
            <h2
              data-services-intro-item
              className="mt-5 max-w-[52rem] font-display text-[clamp(2.45rem,6vw,5.8rem)] font-semibold leading-[0.94] tracking-[0] text-[#fffaf0] motion-reduce:opacity-100"
            >
              Five Enterprise Divisions.
              <br />
              One Operating Ecosystem.
            </h2>
          </div>

          <div
            data-services-intro-item
            className="hidden overflow-hidden rounded-[8px] border border-[#d6b45f]/26 bg-[#fffaf0]/[0.075] p-4 shadow-[0_22px_70px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.14)] backdrop-blur-2xl motion-reduce:opacity-100 md:block"
          >
            <div className="flex items-center justify-between gap-4">
              <span className="text-[0.66rem] font-semibold uppercase tracking-[0] text-[#d6b45f]">Pinned narrative</span>
              <span className="h-px flex-1 bg-[linear-gradient(90deg,rgba(214,180,95,0.65),transparent)]" />
              <span className="text-[0.66rem] font-semibold uppercase tracking-[0] text-[#fffaf0]/52">01-05</span>
            </div>
            <div className="mt-4 h-1 overflow-hidden rounded-full bg-[#fffaf0]/10">
              <span data-services-progress-fill className="block h-full origin-left scale-x-0 bg-[linear-gradient(90deg,#8b1118,#d6b45f,#fff2ba)]" />
            </div>
          </div>
        </div>
      </div>

      <div className="absolute inset-x-5 bottom-5 z-40 mx-auto hidden max-w-[94rem] motion-reduce:relative motion-reduce:inset-auto motion-reduce:mt-8 motion-reduce:flex motion-reduce:px-5 md:inset-x-8 md:flex">
        <div className="grid w-full grid-cols-5 overflow-hidden rounded-[8px] border border-[#fffaf0]/12 bg-[#080606]/70 shadow-[0_24px_70px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur-2xl">
          {serviceDivisions.map((division, index) => (
            <div key={division.title} className="relative min-w-0 border-r border-[#fffaf0]/10 px-3 py-3 last:border-r-0 lg:px-4">
              <span data-services-marker-fill className="absolute inset-x-0 top-0 h-[2px] origin-left scale-x-0 bg-[#d6b45f]" />
              <span className="block text-[0.62rem] font-semibold uppercase leading-none tracking-[0] text-[#d6b45f]/72">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span data-services-marker-label className="mt-2 block truncate text-[0.68rem] font-semibold uppercase leading-none tracking-[0]">
                {division.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute inset-0 z-20 motion-reduce:relative motion-reduce:inset-auto motion-reduce:mt-10 motion-reduce:grid motion-reduce:gap-5 motion-reduce:px-5">
        {serviceDivisions.map((division, index) => (
          <article
            key={division.title}
            data-service-panel
            className="pointer-events-none absolute inset-0 opacity-0 motion-reduce:relative motion-reduce:inset-auto motion-reduce:min-h-[70svh] motion-reduce:opacity-100"
          >
            <div data-service-card className="relative h-full w-full overflow-hidden bg-[#070606] motion-reduce:rounded-[8px]">
              <Image
                data-service-image
                src={division.image}
                alt=""
                fill
                sizes="100vw"
                priority={index === 0}
                quality={95}
                className={`object-cover opacity-[0.72] ${division.imageClassName}`}
                aria-hidden="true"
              />
              <span
                data-service-depth
                className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,6,6,0.88)_0%,rgba(7,6,6,0.58)_38%,rgba(7,6,6,0.16)_72%,rgba(7,6,6,0.74)_100%),radial-gradient(circle_at_24%_70%,rgba(139,17,24,0.36),transparent_34%),radial-gradient(circle_at_74%_20%,rgba(214,180,95,0.2),transparent_32%)]"
                aria-hidden="true"
              />
              <span
                data-service-depth
                className="absolute inset-0 opacity-50 [background-image:linear-gradient(115deg,transparent_0%,rgba(255,250,240,0.14)_43%,rgba(214,180,95,0.2)_50%,transparent_58%)]"
                aria-hidden="true"
              />
              <span
                data-service-depth
                className="absolute left-[7%] top-[21%] hidden h-[42vh] w-px bg-[linear-gradient(180deg,transparent,#d6b45f,transparent)] opacity-70 md:block"
                aria-hidden="true"
              />
              <div
                data-service-depth
                className="absolute right-[8%] top-[23%] z-10 hidden h-44 w-44 rounded-[8px] border border-[#d6b45f]/22 bg-[#fffaf0]/[0.045] p-4 shadow-[0_28px_90px_rgba(0,0,0,0.22),inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-xl md:block"
              >
                <span className="block text-[0.56rem] font-semibold uppercase leading-none tracking-[0] text-[#d6b45f]">
                  Capability Set
                </span>
                <div className="mt-4 grid gap-2">
                  {division.capabilities.map((capability) => (
                    <span
                      key={capability}
                      className="block rounded-[5px] border border-[#fffaf0]/10 bg-[#070606]/28 px-2.5 py-1.5 text-[0.58rem] font-semibold uppercase leading-none tracking-[0] text-[#fffaf0]/78"
                    >
                      {capability}
                    </span>
                  ))}
                </div>
              </div>
              <span
                data-service-curtain
                className="absolute inset-0 z-20 bg-[linear-gradient(115deg,#070606_0%,#8b1118_42%,#d6b45f_67%,#fffaf0_100%)]"
                aria-hidden="true"
              />

              <div className="absolute bottom-[12vh] left-5 z-30 max-w-[42rem] pr-5 md:left-12 lg:left-[8vw]">
                <p data-service-copy-item className="text-[0.72rem] font-semibold uppercase leading-none tracking-[0] text-[#d6b45f]">
                  {String(index + 1).padStart(2, "0")} / {division.code}
                </p>
                <h3
                  data-service-copy-item
                  className="mt-5 font-display text-[clamp(3rem,8vw,8.6rem)] font-semibold leading-[0.88] tracking-[0] text-[#fffaf0]"
                >
                  <StaggerWords text={division.title} />
                </h3>
                <p data-service-copy-item className="mt-6 max-w-[34rem] text-[clamp(1.05rem,2vw,1.65rem)] font-medium leading-[1.28] tracking-[0] text-[#fffaf0]/82">
                  {division.statement}
                </p>
              </div>

              <div
                data-service-copy-item
                className="absolute bottom-[12vh] right-5 z-30 hidden w-[17rem] rounded-[8px] border border-[#fffaf0]/14 bg-[#fffaf0]/[0.075] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.14)] backdrop-blur-2xl lg:block"
              >
                <span className="block text-[0.66rem] font-semibold uppercase tracking-[0] text-[#d6b45f]">Enterprise Division</span>
                <span className="mt-8 block font-display text-[5.6rem] font-semibold leading-none tracking-[0] text-[#fffaf0]/12">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="mt-4 block h-px bg-[linear-gradient(90deg,#d6b45f,transparent)]" />
              </div>
            </div>
          </article>
        ))}
      </div>

      <div
        data-services-final
        className="absolute inset-0 z-30 flex flex-col justify-end overflow-hidden bg-[#070606]/92 px-3 pb-[calc(4rem+2.5svh)] pt-[calc(8rem+2svh)] opacity-0 motion-reduce:relative motion-reduce:inset-auto motion-reduce:mt-10 motion-reduce:opacity-100 sm:px-5 md:px-8 md:pb-24 md:pt-32"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_22%,rgba(139,17,24,0.28),transparent_32%),radial-gradient(circle_at_78%_18%,rgba(214,180,95,0.2),transparent_36%),linear-gradient(180deg,rgba(7,6,6,0.34),rgba(7,6,6,0.92))]" />
        <div className="relative z-10 mx-auto mb-8 flex w-full max-w-[94rem] flex-col gap-3 md:mb-7 md:flex-row md:items-end md:justify-between">
          <div>
            <p data-services-final-copy className="text-[0.68rem] font-semibold uppercase leading-none tracking-[0] text-[#d6b45f]">
              Complete Operating Ecosystem
            </p>
            <h3
              data-services-final-copy
              className="mt-3 max-w-[42rem] font-display text-[clamp(2rem,4.2vw,4.8rem)] font-semibold leading-[0.95] tracking-[0] text-[#fffaf0]"
            >
              All five divisions in one executive view.
            </h3>
          </div>
          <p data-services-final-copy className="max-w-[34rem] text-sm leading-7 text-[#efe6d6]/68 md:text-right">
            Architecture | Construction | Real Estate | Import & Export | OTC Exchange
          </p>
        </div>

        <div data-services-final-track className="relative z-10 mx-auto flex h-[48vh] min-h-[20rem] w-full max-w-[94rem] overflow-hidden rounded-[8px] border border-[#d6b45f]/22 bg-[#fffaf0]/[0.035] shadow-[0_34px_110px_rgba(0,0,0,0.44),inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-xl">
          {serviceDivisions.map((division, index) => (
            <Link
              key={division.title}
              data-services-final-card
              href={division.href}
              prefetch={false}
              className="group relative min-w-0 flex-1 overflow-hidden border-r border-[#fffaf0]/12 last:border-r-0"
            >
              <Image
                data-services-final-image
                src={division.image}
                alt=""
                fill
                sizes="(min-width: 1280px) 32vw, (min-width: 768px) 42vw, 84vw"
                quality={95}
                className={`object-cover opacity-[0.76] transition duration-700 group-hover:scale-[1.04] group-hover:opacity-[0.9] ${division.imageClassName}`}
                aria-hidden="true"
              />
              <span className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,6,6,0.08)_0%,rgba(7,6,6,0.48)_45%,rgba(7,6,6,0.88)_100%),radial-gradient(circle_at_50%_20%,rgba(214,180,95,0.16),transparent_36%)] transition duration-500 group-hover:bg-[linear-gradient(180deg,rgba(7,6,6,0.02)_0%,rgba(7,6,6,0.34)_45%,rgba(7,6,6,0.82)_100%),radial-gradient(circle_at_50%_20%,rgba(214,180,95,0.22),transparent_36%)]" />
              <span className="absolute inset-x-4 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(214,180,95,0.82),transparent)] opacity-70" />
              <div className="absolute inset-x-2 bottom-3 z-10 md:inset-x-4 md:bottom-5">
                <p className="text-[0.58rem] font-semibold uppercase leading-none tracking-[0] text-[#d6b45f] md:text-[0.66rem]">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h4 className="mt-2 text-[0.82rem] font-semibold leading-[1.02] tracking-[0] text-[#fffaf0] sm:text-[1rem] md:text-[1.24rem] lg:text-[1.5rem]">
                  {division.title}
                </h4>
                <p className="mt-3 hidden max-w-[13rem] text-xs leading-5 text-[#efe6d6]/68 lg:block">{division.statement}</p>
                <span className="mt-4 hidden items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0] text-[#f5d98d] md:inline-flex">
                  View
                  <ArrowUpRight className="h-3.5 w-3.5 transition duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" strokeWidth={1.8} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
