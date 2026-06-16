"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useId, useRef, useState } from "react";

interface ShootingStar {
  id: number;
  x: number;
  y: number;
  angle: number;
  scale: number;
  speed: number;
  distance: number;
}

interface ShootingStarsProps {
  minSpeed?: number;
  maxSpeed?: number;
  minDelay?: number;
  maxDelay?: number;
  starColor?: string;
  trailColor?: string;
  starWidth?: number;
  starHeight?: number;
  starCount?: number;
  className?: string;
  maxFps?: number;
}

const getRandomStartPoint = () => {
  const side = Math.floor(Math.random() * 4);
  const xOffset = Math.random() * window.innerWidth;
  const yOffset = Math.random() * window.innerHeight;

  switch (side) {
    case 0:
      return { x: xOffset, y: -20, angle: 45 };
    case 1:
      return { x: window.innerWidth + 20, y: yOffset, angle: 135 };
    case 2:
      return { x: xOffset, y: window.innerHeight + 20, angle: 225 };
    case 3:
      return { x: -20, y: yOffset, angle: 315 };
    default:
      return { x: 0, y: 0, angle: 45 };
  }
};

export const ShootingStars: React.FC<ShootingStarsProps> = ({
  minSpeed = 10,
  maxSpeed = 30,
  minDelay = 1200,
  maxDelay = 4200,
  starColor = "#9E00FF",
  trailColor = "#2EB9DF",
  starWidth = 10,
  starHeight = 1,
  starCount = 1,
  className,
  maxFps = 30,
}) => {
  const [stars, setStars] = useState<ShootingStar[]>([]);
  const timeoutRefs = useRef<number[]>([]);
  const starIdRef = useRef(0);
  const svgRef = useRef<SVGSVGElement>(null);
  const gradientId = useId().replace(/:/g, "");
  const documentVisibleRef = useRef(true);

  useEffect(() => {
    const updateVisibility = () => {
      documentVisibleRef.current = !document.hidden;
    };

    updateVisibility();
    document.addEventListener("visibilitychange", updateVisibility);
    return () =>
      document.removeEventListener("visibilitychange", updateVisibility);
  }, []);

  useEffect(() => {
    const activeStarCount = Math.max(1, Math.floor(starCount));

    const createStar = (laneIndex: number) => {
      if (!documentVisibleRef.current) {
        const hiddenDelay = Math.random() * (maxDelay - minDelay) + minDelay;
        timeoutRefs.current[laneIndex] = window.setTimeout(
          () => createStar(laneIndex),
          hiddenDelay,
        );
        return;
      }

      const { x, y, angle } = getRandomStartPoint();
      const newStar: ShootingStar = {
        id: Date.now() + starIdRef.current++,
        x,
        y,
        angle,
        scale: 1,
        speed: Math.random() * (maxSpeed - minSpeed) + minSpeed,
        distance: 0,
      };

      setStars((currentStars) => [
        ...currentStars.slice(-(activeStarCount * 3)),
        newStar,
      ]);

      const randomDelay = Math.random() * (maxDelay - minDelay) + minDelay;
      timeoutRefs.current[laneIndex] = window.setTimeout(
        () => createStar(laneIndex),
        randomDelay,
      );
    };

    timeoutRefs.current = Array.from({ length: activeStarCount }, (_, index) =>
      window.setTimeout(() => createStar(index), index * 180),
    );

    return () => {
      timeoutRefs.current.forEach((timeoutId) => window.clearTimeout(timeoutId));
      timeoutRefs.current = [];
    };
  }, [minSpeed, maxSpeed, minDelay, maxDelay, starCount]);

  useEffect(() => {
    let animationFrame: number;
    let lastFrame = 0;
    const frameInterval = 1000 / Math.max(1, maxFps);

    const moveStars = (now: number) => {
      if (documentVisibleRef.current && now - lastFrame >= frameInterval) {
        lastFrame = now;
        setStars((currentStars) => {
          if (currentStars.length === 0) {
            return currentStars;
          }

          return currentStars
            .map((star) => {
              const newX =
                star.x + star.speed * Math.cos((star.angle * Math.PI) / 180);
              const newY =
                star.y + star.speed * Math.sin((star.angle * Math.PI) / 180);
              const newDistance = star.distance + star.speed;
              const newScale = 1 + newDistance / 100;

              return {
                ...star,
                x: newX,
                y: newY,
                distance: newDistance,
                scale: newScale,
              };
            })
            .filter(
              (star) =>
                star.x >= -40 &&
                star.x <= window.innerWidth + 40 &&
                star.y >= -40 &&
                star.y <= window.innerHeight + 40,
            );
        });
      }

      animationFrame = requestAnimationFrame(moveStars);
    };

    animationFrame = requestAnimationFrame(moveStars);

    return () => cancelAnimationFrame(animationFrame);
  }, [maxFps]);

  return (
    <svg
      ref={svgRef}
      className={cn("absolute inset-0 h-full w-full", className)}
    >
      {stars.map((star) => (
        <rect
          key={star.id}
          x={star.x}
          y={star.y}
          width={starWidth * star.scale}
          height={starHeight}
          fill={`url(#${gradientId})`}
          transform={`rotate(${star.angle}, ${
            star.x + (starWidth * star.scale) / 2
          }, ${star.y + starHeight / 2})`}
        />
      ))}
      <defs>
        <linearGradient
          id={gradientId}
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" style={{ stopColor: trailColor, stopOpacity: 0 }} />
          <stop
            offset="100%"
            style={{ stopColor: starColor, stopOpacity: 1 }}
          />
        </linearGradient>
      </defs>
    </svg>
  );
};
