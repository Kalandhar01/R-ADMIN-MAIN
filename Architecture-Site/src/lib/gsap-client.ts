"use client";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import ScrollToPlugin from "gsap/ScrollToPlugin";

export const registerGsapPlugins = () => {
  if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
  }
};

export { gsap, ScrollTrigger, ScrollToPlugin };
