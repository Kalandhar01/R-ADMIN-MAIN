"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

type MotionRevealProps = {
  as?: "div" | "section";
  children: ReactNode;
  className?: string;
  id?: string;
  delay?: number;
  amount?: number;
};

const ease = [0.22, 1, 0.36, 1] as const;

export default function MotionReveal({
  as = "section",
  children,
  className,
  id,
  delay = 0,
  amount = 0.16,
}: MotionRevealProps) {
  const shouldReduceMotion = useReducedMotion();
  const initial = shouldReduceMotion
    ? { opacity: 1 }
    : { opacity: 0, y: 76, filter: "blur(14px)" };
  const animate = shouldReduceMotion
    ? { opacity: 1 }
    : { opacity: 1, y: 0, filter: "blur(0px)" };
  const transition = {
    duration: shouldReduceMotion ? 0.01 : 1.08,
    delay,
    ease,
  };

  if (as === "div") {
    return (
      <motion.div
        id={id}
        className={className}
        initial={initial}
        whileInView={animate}
        viewport={{ once: true, amount }}
        transition={transition}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.section
      id={id}
      className={className}
      initial={initial}
      whileInView={animate}
      viewport={{ once: true, amount }}
      transition={transition}
    >
      {children}
    </motion.section>
  );
}
