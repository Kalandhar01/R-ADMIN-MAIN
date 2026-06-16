"use client";

import { type ReactNode, useEffect, useRef } from "react";
import type { HTMLAttributes } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface GsapSectionProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
}

export function GsapSection({ children, className, ...props }: GsapSectionProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const targets = element.querySelectorAll("[data-gsap-reveal]");
    const context = gsap.context(() => {
      gsap.from(targets, {
        opacity: 0,
        y: 32,
        duration: 0.85,
        ease: "power3.out",
        stagger: 0.08,
        scrollTrigger: {
          trigger: element,
          start: "top 72%"
        }
      });
    }, element);

    return () => context.revert();
  }, []);

  return (
    <section ref={ref} className={className} {...props}>
      {children}
    </section>
  );
}
