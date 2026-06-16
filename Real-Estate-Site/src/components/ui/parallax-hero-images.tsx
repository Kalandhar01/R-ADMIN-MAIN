"use client";

import React, { memo, useEffect, useMemo, useState } from "react";
import {
  motion,
  useReducedMotion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue
} from "framer-motion";
import { cn } from "@/lib/utils";

type ImagePosition = {
  src: string;
  position:
    | "top-left"
    | "top-right"
    | "mid-left"
    | "mid-right"
    | "bottom-left"
    | "bottom-right"
    | "far-left"
    | "far-right";
  depth: number;
  delay: number;
  floatDuration: number;
};

const positionStyles: Record<
  ImagePosition["position"],
  { top: string; left?: string; right?: string }
> = {
  "top-left": { top: "8%", left: "4%" },
  "top-right": { top: "8%", right: "4%" },
  "mid-left": { top: "38%", left: "6%" },
  "mid-right": { top: "38%", right: "6%" },
  "bottom-left": { top: "68%", left: "4%" },
  "bottom-right": { top: "68%", right: "4%" },
  "far-left": { top: "52%", left: "2%" },
  "far-right": { top: "52%", right: "2%" }
};

const positionOrder: ImagePosition["position"][] = [
  "top-left",
  "top-right",
  "mid-left",
  "mid-right",
  "bottom-left",
  "bottom-right",
  "far-left",
  "far-right"
];

type DepthVariant = "default" | "edge-focus";

const depthValuesByVariant: Record<DepthVariant, number[]> = {
  default: [0.3, 0.35, 0.9, 0.85, 0.4, 0.45, 0.25, 0.2],
  "edge-focus": [0.85, 0.9, 0.3, 0.35, 0.8, 0.85, 0.4, 0.45]
};

const SPRING_CONFIG = { damping: 25, stiffness: 120 };

export interface ParallaxHeroImagesProps {
  images: string[];
  className?: string;
  imageClassName?: string;
  variant?: DepthVariant;
}

export const ParallaxHeroImages = ({
  images,
  className,
  imageClassName,
  variant = "default"
}: ParallaxHeroImagesProps) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const prefersReducedMotion = useReducedMotion();
  const [isMobileGallery, setIsMobileGallery] = useState(false);

  const smoothMouseX = useSpring(mouseX, SPRING_CONFIG);
  const smoothMouseY = useSpring(mouseY, SPRING_CONFIG);

  const positions = useMemo(() => {
    const limitedImages = images.slice(0, 8);
    const depthValues = depthValuesByVariant[variant];

    return limitedImages.map((src, index) => ({
      src,
      position: positionOrder[index],
      depth: depthValues[index],
      delay: index * 0.12,
      floatDuration: 6 + index * 0.38
    }));
  }, [images, variant]);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = (event.clientY / window.innerHeight) * 2 - 1;
      mouseX.set(x);
      mouseY.set(y);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 900px)");
    const syncGalleryMode = () => setIsMobileGallery(mediaQuery.matches);

    syncGalleryMode();
    mediaQuery.addEventListener("change", syncGalleryMode);

    return () => mediaQuery.removeEventListener("change", syncGalleryMode);
  }, []);

  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className
      )}
    >
      {positions.map((pos, index) => (
        <ParallaxImage
          key={`${pos.src}-${index}`}
          src={pos.src}
          position={pos.position}
          depth={pos.depth}
          delay={pos.delay}
          floatDuration={pos.floatDuration}
          imageClassName={imageClassName}
          isMobileGallery={isMobileGallery}
          prefersReducedMotion={Boolean(prefersReducedMotion)}
          smoothMouseX={smoothMouseX}
          smoothMouseY={smoothMouseY}
        />
      ))}
    </div>
  );
};

interface ParallaxImageProps extends ImagePosition {
  imageClassName?: string;
  isMobileGallery: boolean;
  prefersReducedMotion: boolean;
  smoothMouseX: MotionValue<number>;
  smoothMouseY: MotionValue<number>;
}

const ParallaxImage = memo(function ParallaxImage({
  src,
  position,
  depth,
  delay,
  floatDuration,
  imageClassName,
  isMobileGallery,
  prefersReducedMotion,
  smoothMouseX,
  smoothMouseY
}: ParallaxImageProps) {
  const maxOffset = 40;

  const translateX = useTransform(
    smoothMouseX,
    [-1, 1],
    [-maxOffset * depth, maxOffset * depth]
  );

  const translateY = useTransform(
    smoothMouseY,
    [-1, 1],
    [-maxOffset * depth, maxOffset * depth]
  );

  const posStyle = positionStyles[position];

  return (
    <motion.div
      className={cn(
        "pointer-events-auto absolute re-parallax-image",
        `re-parallax-image-${position}`
      )}
      data-position={position}
      style={{
        top: posStyle.top,
        left: posStyle.left,
        right: posStyle.right,
        x: translateX,
        y: translateY,
        zIndex: Math.round(depth * 10)
      }}
      initial={{ opacity: 0, filter: "blur(18px)", scale: 0.92 }}
      animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.25, 0.1, 0.25, 1]
      }}
    >
      <motion.div
        animate={
          prefersReducedMotion
            ? { y: 0 }
            : isMobileGallery
              ? { y: [0, -8, 0] }
              : { y: [-10, 10, -10] }
        }
        transition={{
          duration: isMobileGallery ? 6 : floatDuration,
          delay: isMobileGallery ? delay * 1.25 : 0,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <motion.img
          src={src}
          alt=""
          loading="lazy"
          decoding="async"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className={cn(
            "aspect-[4/3] h-20 w-32 rounded-[24px] object-cover shadow-[0_28px_80px_rgba(62,43,36,0.24)] ring-1 ring-[#c4b693]/35 [filter:sepia(0.16)_saturate(0.82)_brightness(0.95)_contrast(1.04)] sm:h-40 sm:w-56 md:h-52 md:w-80",
            imageClassName
          )}
        />
      </motion.div>
    </motion.div>
  );
});
