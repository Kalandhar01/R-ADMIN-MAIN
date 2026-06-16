"use client";

import { motion } from "framer-motion";
import { ParallaxHeroImages } from "@/components/ui/parallax-hero-images";

const images = [
  "/images/hero/luxury-villa-golden-hour.webp",
  "/real-estate/parallax/commercial-tower.webp",
  "/images/real-estate/laterite-court.webp",
  "/images/real-estate/stone-residence.webp",
  "/images/la-perla/sky-living.webp",
  "/images/hero/commercial-investment-evening.webp"
];

export default function ParallaxHeroImagesDemo() {
  return (
    <div className="re-floating-cover relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#f1ecea] text-[#3e2b24]">
      <ParallaxHeroImages images={images} imageClassName="re-floating-cover-image" />
      <div className="re-floating-cover-copy-desktop relative z-10 mx-auto flex max-w-4xl flex-col items-center gap-4 px-4 text-center">
        <p className="font-sans text-xs uppercase tracking-[0.16em] text-[#645941]">
          Ractysh Real Estate
        </p>
        <h1 className="text-4xl font-semibold tracking-normal text-[#3e2b24] drop-shadow-[0_0_20px_rgba(241,236,234,0.88)] md:text-6xl">
          A private acquisition platform for premium residences, commercial assets and investment-led spaces across South India.
        </h1>
      </div>
      <motion.div
        className="re-floating-cover-mobile-card"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
      >
        <p>Ractysh Real Estate</p>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.58, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
        >
          A private acquisition platform for premium residences, commercial assets and investment-led spaces across South India.
        </motion.h1>
      </motion.div>
    </div>
  );
}
