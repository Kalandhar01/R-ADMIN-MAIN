"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { HeroSection } from "@/components/HeroSection";
import { WhoWeAreEnterpriseShowcase } from "@/components/WhoWeAreEnterpriseShowcase";
import { useLenis } from "@/components/providers/SmoothScrollProvider";
import type { Division, HeroContent } from "@/lib/types";

gsap.registerPlugin(ScrollTrigger);

interface HomeHeroWhoStoryFlowProps {
  hero: HeroContent;
  divisions: Division[];
}

export function HomeHeroWhoStoryFlow({ hero, divisions }: HomeHeroWhoStoryFlowProps) {
  const rootRef = useRef<HTMLElement | null>(null);
  const whoPanelVisibleRef = useRef(false);
  const [isWhoPanelVisible, setIsWhoPanelVisible] = useState(false);
  const reduceMotion = useReducedMotion();
  const lenis = useLenis();

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const context = gsap.context(() => {
      const heroPanel = root.querySelector<HTMLElement>("[data-home-story-panel='hero']");
      const whoPanel = root.querySelector<HTMLElement>("[data-home-story-panel='who']");

      if (!heroPanel || !whoPanel) return;

      const setWhoPanelVisibility = (visible: boolean) => {
        if (whoPanelVisibleRef.current === visible) return;

        whoPanelVisibleRef.current = visible;
        root.classList.toggle("is-who-active", visible);
        setIsWhoPanelVisible(visible);
      };

      if (reduceMotion) {
        root.classList.add("is-motion-reduced");
        setWhoPanelVisibility(true);
        gsap.set([heroPanel, whoPanel], {
          autoAlpha: 1,
          clearProps: "transform"
        });
        requestAnimationFrame(() => ScrollTrigger.refresh());
        return;
      }

      root.classList.remove("is-motion-reduced");
      setWhoPanelVisibility(false);
      gsap.set(heroPanel, {
        autoAlpha: 1,
        scale: 1,
        yPercent: 0,
        transformOrigin: "50% 36%"
      });
      gsap.set(whoPanel, {
        autoAlpha: 0,
        y: 32,
        scale: 1.018,
        transformOrigin: "50% 56%"
      });

      const timeline = gsap.timeline({
        defaults: { ease: "power2.inOut" },
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: () => `+=${Math.max(window.innerHeight, 620)}`,
          scrub: 0.85,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            setWhoPanelVisibility(self.progress > 0.58);
          }
        }
      });

      timeline
        .to(
          heroPanel,
          {
            autoAlpha: 0,
            yPercent: -7,
            scale: 0.972,
            duration: 0.9
          },
          0
        )
        .to(
          whoPanel,
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.9
          },
          0.08
        );

      requestAnimationFrame(() => {
        lenis?.resize?.();
        ScrollTrigger.refresh();
      });
    }, root);

    return () => {
      root.classList.remove("is-who-active", "is-motion-reduced");
      whoPanelVisibleRef.current = false;
      setIsWhoPanelVisible(false);
      context.revert();
    };
  }, [lenis, reduceMotion]);

  return (
    <section
      ref={rootRef}
      className="home-hero-story-flow relative isolate"
      aria-label="Homepage hero to who we are cinematic story"
    >
      <span id="who-we-are" className="home-hero-story-anchor" aria-hidden="true" />
      <div className="home-hero-story-pin sticky top-0 h-[100svh] min-h-[620px] overflow-hidden">
        <div data-home-story-panel="hero" className="home-hero-story-panel home-hero-story-hero">
          <HeroSection hero={hero} divisions={divisions} />
        </div>
        <div data-home-story-panel="who" className="home-hero-story-panel home-hero-story-who">
          <WhoWeAreEnterpriseShowcase
            sectionId="who-we-are-section"
            anchorId="who-we-are-visual-anchor"
            className="who-homepage-section home-hero-story-who-section"
            isActive={isWhoPanelVisible}
          />
        </div>
      </div>
    </section>
  );
}
