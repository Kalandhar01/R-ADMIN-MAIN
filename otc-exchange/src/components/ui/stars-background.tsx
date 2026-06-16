"use client";

import { cn } from "@/lib/utils";
import React, { useCallback, useEffect, useRef } from "react";

interface StarProps {
  x: number;
  y: number;
  radius: number;
  opacity: number;
  twinkleSpeed: number | null;
}

interface StarBackgroundProps {
  starDensity?: number;
  allStarsTwinkle?: boolean;
  twinkleProbability?: number;
  minTwinkleSpeed?: number;
  maxTwinkleSpeed?: number;
  className?: string;
  maxStarCount?: number;
  maxFps?: number;
}

export const StarsBackground: React.FC<StarBackgroundProps> = ({
  starDensity = 0.00015,
  allStarsTwinkle = true,
  twinkleProbability = 0.7,
  minTwinkleSpeed = 0.5,
  maxTwinkleSpeed = 1,
  className,
  maxStarCount = 900,
  maxFps = 24,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<StarProps[]>([]);
  const canvasSizeRef = useRef({ width: 0, height: 0 });

  const generateStars = useCallback(
    (width: number, height: number): StarProps[] => {
      const area = width * height;
      const numStars = Math.min(
        Math.floor(area * starDensity),
        maxStarCount,
      );

      return Array.from({ length: numStars }, () => {
        const shouldTwinkle =
          allStarsTwinkle || Math.random() < twinkleProbability;

        return {
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 0.05 + 0.5,
          opacity: Math.random() * 0.5 + 0.5,
          twinkleSpeed: shouldTwinkle
            ? minTwinkleSpeed +
              Math.random() * (maxTwinkleSpeed - minTwinkleSpeed)
            : null,
        };
      });
    },
    [
      allStarsTwinkle,
      maxTwinkleSpeed,
      minTwinkleSpeed,
      maxStarCount,
      starDensity,
      twinkleProbability,
    ],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const updateStars = () => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const rect = canvas.getBoundingClientRect();
      const width = Math.max(1, Math.floor(rect.width));
      const height = Math.max(1, Math.floor(rect.height));
      const dpr = Math.min(window.devicePixelRatio || 1, 1.25);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvasSizeRef.current = { width, height };
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      starsRef.current = generateStars(width, height);
    };

    updateStars();

    const resizeObserver = new ResizeObserver(updateStars);
    resizeObserver.observe(canvas);

    return () => {
      resizeObserver.disconnect();
    };
  }, [generateStars]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let lastFrame = 0;
    const frameInterval = 1000 / Math.max(1, maxFps);

    const render = (now: number) => {
      if (!document.hidden && now - lastFrame >= frameInterval) {
        lastFrame = now;
        const { width, height } = canvasSizeRef.current;

        ctx.clearRect(0, 0, width, height);
        starsRef.current.forEach((star) => {
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
          ctx.fill();

          if (star.twinkleSpeed !== null) {
            star.opacity =
              0.5 +
              Math.abs(
                Math.sin((Date.now() * 0.001) / star.twinkleSpeed) * 0.5,
              );
          }
        });
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [maxFps]);

  return (
    <canvas
      ref={canvasRef}
      className={cn("absolute inset-0 h-full w-full", className)}
    />
  );
};
