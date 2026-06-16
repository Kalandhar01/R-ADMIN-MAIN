"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

const premiumEase = [0.22, 1, 0.36, 1] as const;

interface PageTransitionProps {
  children: ReactNode;
  exiting: boolean;
}

export function PageTransition({ children, exiting }: PageTransitionProps) {
  const reduceMotion = useReducedMotion();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setReady(true));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  return (
    <motion.div
      data-page-transition-root
      initial={false}
      animate={
        reduceMotion
          ? { opacity: 1 }
          : exiting
            ? { opacity: 0, y: 20, scale: 0.996 }
            : ready
              ? { opacity: 1, y: 0, scale: 1 }
              : { opacity: 0, y: 20, scale: 0.996 }
      }
      transition={{
        duration: reduceMotion ? 0 : ready || exiting ? (exiting ? 0.42 : 0.8) : 0,
        ease: premiumEase
      }}
      style={{
        transformOrigin: "50% 0%",
        willChange: exiting || !ready ? "opacity, transform" : "auto"
      }}
    >
      {children}
    </motion.div>
  );
}
