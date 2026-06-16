"use client";

import { useEffect, useState, type CSSProperties } from "react";
import Link from "next/link";
import type { HeroContent } from "@/lib/types";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeroHeadingProps {
  hero: HeroContent;
  isReady: boolean;
  onTypingComplete?: () => void;
}

const headlineLines = [
  [
    { text: "Architecture, Construction,", highlight: false }
  ],
  [
    { text: "Real Estate, Trade", highlight: true },
    { text: " and OTC Exchange", highlight: false }
  ]
];

const headlineCharacterCount = headlineLines.reduce(
  (lineTotal, line) => lineTotal + line.reduce((partTotal, part) => partTotal + part.text.length, 0),
  0
);

export function HeroHeading({ hero, isReady, onTypingComplete }: HeroHeadingProps) {
  void hero;

  const [visibleCharacters, setVisibleCharacters] = useState(0);
  const [hasTyped, setHasTyped] = useState(false);
  const [useCompositorReveal, setUseCompositorReveal] = useState(false);
  const isTyping = isReady && !hasTyped;
  let characterIndex = 0;

  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");
    const updateRevealMode = () => setUseCompositorReveal(media.matches);

    updateRevealMode();
    media.addEventListener("change", updateRevealMode);
    return () => media.removeEventListener("change", updateRevealMode);
  }, []);

  useEffect(() => {
    if (!isReady) {
      setVisibleCharacters(0);
      setHasTyped(false);
      return;
    }

    if (useCompositorReveal) {
      setVisibleCharacters(headlineCharacterCount);
      setHasTyped(true);
      return;
    }

    let currentCharacter = 0;
    let timeoutId: number | undefined;

    const typeNextCharacter = () => {
      currentCharacter += 1;
      setVisibleCharacters(currentCharacter);

      if (currentCharacter >= headlineCharacterCount) {
        setHasTyped(true);
        return;
      }

      const cadence = currentCharacter % 11 === 0 ? 68 : currentCharacter % 5 === 0 ? 48 : 34;
      timeoutId = window.setTimeout(typeNextCharacter, cadence);
    };

    timeoutId = window.setTimeout(typeNextCharacter, 180);

    return () => {
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [isReady, useCompositorReveal]);

  useEffect(() => {
    const root = document.documentElement;

    if (!isReady || !hasTyped) {
      root.classList.remove("is-landing-background-visible");
      return undefined;
    }

    const frameId = window.requestAnimationFrame(() => {
      root.classList.add("is-landing-background-visible");
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [hasTyped, isReady]);

  useEffect(() => {
    if (isReady && hasTyped) {
      onTypingComplete?.();
    }
  }, [hasTyped, isReady, onTypingComplete]);

  useEffect(() => {
    return () => document.documentElement.classList.remove("is-landing-background-visible");
  }, []);

  return (
    <div className={cn("hero-copy mx-auto max-w-[72rem] text-center", isReady ? "opacity-100" : "opacity-0", useCompositorReveal && "hero-copy-mobile-reveal")}>
      <div
        data-hero-eyebrow
        className="mb-6 inline-flex items-center gap-4 text-[0.88rem] font-medium text-[#343434]"
      >
        <span>Ractysh Group Enterprise Ecosystem</span>
        <span className="h-5 w-px bg-[#c9c7c1]" />
        <Link href="/about" className="inline-flex items-center gap-1.5">
          Know More
          <ChevronRight className="h-4 w-4" strokeWidth={2.4} />
        </Link>
      </div>

      <h1
        aria-label={headlineLines.flat().map((part) => part.text).join("")}
        className="mx-auto max-w-[72rem] [--ractysh-body-font:var(--font-cormorant)] [--ractysh-heading-tracking:-0.04em] !font-display text-[clamp(2.75rem,5.6vw,5.2rem)] !font-bold !leading-[0.92] !tracking-[-0.04em] text-[#17120f]"
      >
        {headlineLines.map((line, lineIndex) => (
          <span key={lineIndex} className="block overflow-visible pb-[0.035em]">
            <span data-hero-word className="inline-block lg:whitespace-nowrap">
              {lineIndex === 0 && visibleCharacters === 0 && isTyping ? (
                <span className="hero-boot-cursor" aria-hidden="true" />
              ) : null}
              {line.map((part) => (
                <span key={part.text} className={part.highlight ? "audit-blue-text" : undefined}>
                  {hasTyped
                    ? part.text
                    : Array.from(part.text).map((character, partCharacterIndex) => {
                        const currentIndex = characterIndex;
                        const isCharacterVisible = visibleCharacters > currentIndex;
                        const isCursorTarget = visibleCharacters === currentIndex + 1 && isTyping;
                        const isGlitching =
                          isTyping && isCharacterVisible && currentIndex >= Math.max(visibleCharacters - 3, 0);
                        const characterStyle = {
                          "--hero-glitch-delay": `${(currentIndex % 4) * 18}ms`
                        } as CSSProperties;

                        characterIndex += 1;

                        return (
                          <span
                            key={`${part.text}-${partCharacterIndex}`}
                            aria-hidden="true"
                            className={cn(
                              "hero-boot-char",
                              isCharacterVisible && "is-visible",
                              isGlitching && "is-glitching"
                            )}
                            style={characterStyle}
                          >
                            {character}
                            {isCursorTarget ? <span className="hero-boot-cursor" aria-hidden="true" /> : null}
                          </span>
                        );
                      })}
                </span>
              ))}
            </span>
          </span>
        ))}
      </h1>

      <p
        data-hero-copy
        className={cn(
          "mx-auto mt-8 max-w-[46rem] text-[1rem] leading-7 text-[#3f3f3f] md:text-[1.06rem]",
          hasTyped ? "opacity-100" : "opacity-0"
        )}
      >
        <span className="block">Ractysh Group operates across five private enterprise pillars.</span>
        <span className="block">One premium ecosystem for spatial, delivery, asset, Trade and Private Exchange workflows.</span>
      </p>
    </div>
  );
}
