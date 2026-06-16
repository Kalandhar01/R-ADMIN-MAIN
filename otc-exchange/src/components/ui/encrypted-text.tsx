"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { cn } from "@/lib/utils";

type EncryptedTextProps = {
  text: string;
  className?: string;
  /** Reveal opens from encrypted to clear text. Conceal closes back into encrypted text. */
  direction?: "reveal" | "conceal";
  /**
   * Time in milliseconds between revealing each subsequent real character.
   * Lower is faster. Defaults to 50ms per character.
   */
  revealDelayMs?: number;
  /** Optional custom character set to use for the gibberish effect. */
  charset?: string;
  /**
   * Time in milliseconds between gibberish flips for unrevealed characters.
   * Lower is more jittery. Defaults to 50ms.
   */
  flipDelayMs?: number;
  /** CSS class for styling the encrypted/scrambled characters */
  encryptedClassName?: string;
  /** CSS class for styling the revealed characters */
  revealedClassName?: string;
  /** When false, animation starts on mount instead of waiting for viewport entry. */
  animateOnView?: boolean;
};

const DEFAULT_CHARSET =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-={}[];:,.<>/?";

function generateRandomCharacter(charset: string): string {
  const index = Math.floor(Math.random() * charset.length);
  return charset.charAt(index);
}

function generateStableCharacter(charset: string, index: number): string {
  const stableIndex = (index * 31 + 17) % charset.length;
  return charset.charAt(stableIndex);
}

function generateGibberishPreservingSpaces(
  original: string,
  charset: string,
): string {
  if (!original) return "";
  let result = "";
  for (let i = 0; i < original.length; i += 1) {
    const ch = original[i];
    result += ch === " " ? " " : generateStableCharacter(charset, i);
  }
  return result;
}

export const EncryptedText: React.FC<EncryptedTextProps> = ({
  text,
  className,
  direction = "reveal",
  revealDelayMs = 50,
  charset = DEFAULT_CHARSET,
  flipDelayMs = 50,
  encryptedClassName,
  revealedClassName,
  animateOnView = true,
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const shouldAnimate = !animateOnView || isInView;

  const [animationState, setAnimationState] = useState<{
    text: string;
    direction: "reveal" | "conceal";
    revealCount: number;
    chars: string[];
  }>(() => ({
    text,
    direction,
    revealCount: direction === "reveal" ? 0 : text.length,
    chars: text
      ? (direction === "reveal"
          ? generateGibberishPreservingSpaces(text, charset)
          : text
        ).split("")
      : [],
  }));

  useEffect(() => {
    if (!shouldAnimate) return;

    const initial = text
      ? direction === "reveal"
        ? generateGibberishPreservingSpaces(text, charset)
        : text
      : "";
    let currentChars = initial.split("");
    const startTime = performance.now();
    let lastFlipTime = startTime;
    let lastRevealCount = direction === "reveal" ? 0 : text.length;
    let animationFrameId: number | null = null;

    let isCancelled = false;
    setAnimationState({
      text,
      direction,
      revealCount: direction === "reveal" ? 0 : text.length,
      chars: currentChars,
    });

    const update = (now: number) => {
      if (isCancelled) return;

      const elapsedMs = now - startTime;
      const totalLength = text.length;
      const animationStep = Math.min(
        totalLength,
        Math.floor(elapsedMs / Math.max(1, revealDelayMs)),
      );
      const currentRevealCount =
        direction === "reveal"
          ? animationStep
          : Math.max(0, totalLength - animationStep);

      const timeSinceLastFlip = now - lastFlipTime;
      const shouldFlip = timeSinceLastFlip >= Math.max(0, flipDelayMs);
      const nextChars = currentChars.slice();
      let hasChanged = currentRevealCount !== lastRevealCount;

      for (let index = 0; index < totalLength; index += 1) {
        if (index < currentRevealCount) {
          nextChars[index] = text[index];
        } else if (shouldFlip) {
          nextChars[index] =
            text[index] === " " ? " " : generateRandomCharacter(charset);
          hasChanged = true;
        }
      }

      if (hasChanged) {
        currentChars = nextChars;
        lastRevealCount = currentRevealCount;
        setAnimationState({
          text,
          direction,
          revealCount: currentRevealCount,
          chars: nextChars,
        });
      }

      if (
        (direction === "reveal" && currentRevealCount >= totalLength) ||
        (direction === "conceal" && currentRevealCount <= 0)
      ) {
        return;
      }

      if (shouldFlip) {
        lastFlipTime = now;
      }

      animationFrameId = requestAnimationFrame(update);
    };

    animationFrameId = requestAnimationFrame(update);

    return () => {
      isCancelled = true;
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [shouldAnimate, text, direction, revealDelayMs, charset, flipDelayMs]);

  if (!text) return null;

  const currentState =
    animationState.text === text && animationState.direction === direction
      ? animationState
      : {
          text,
          direction,
          revealCount: direction === "reveal" ? 0 : text.length,
          chars: (direction === "reveal"
            ? generateGibberishPreservingSpaces(text, charset)
            : text
          ).split(""),
        };

  return (
    <motion.span
      ref={ref}
      className={cn(className)}
      aria-label={text}
      role="text"
    >
      {text.split("").map((char, index) => {
        const isRevealed = index < currentState.revealCount;
        const displayChar = isRevealed
          ? char
          : char === " "
            ? " "
            : (currentState.chars[index] ??
              generateStableCharacter(charset, index));

        return (
          <span
            key={index}
            className={cn(isRevealed ? revealedClassName : encryptedClassName)}
          >
            {displayChar}
          </span>
        );
      })}
    </motion.span>
  );
};
