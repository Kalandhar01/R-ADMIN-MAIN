"use client";

import { motion } from "motion/react";
import WorldMap from "@/components/ui/world-map";

const otcRoutes = [
  {
    start: { lat: 25.2048, lng: 55.2708, label: "Dubai" },
    end: { lat: 28.6139, lng: 77.209, label: "New Delhi" },
  },
  {
    start: { lat: 1.3521, lng: 103.8198, label: "Singapore" },
    end: { lat: 28.6139, lng: 77.209, label: "New Delhi" },
  },
  {
    start: { lat: 51.5074, lng: -0.1278, label: "London" },
    end: { lat: 25.2048, lng: 55.2708, label: "Dubai" },
  },
  {
    start: { lat: 40.7128, lng: -74.006, label: "New York" },
    end: { lat: 51.5074, lng: -0.1278, label: "London" },
  },
  {
    start: { lat: 35.6762, lng: 139.6503, label: "Tokyo" },
    end: { lat: 1.3521, lng: 103.8198, label: "Singapore" },
  },
  {
    start: { lat: -26.2041, lng: 28.0473, label: "Johannesburg" },
    end: { lat: 25.2048, lng: 55.2708, label: "Dubai" },
  },
];

export default function WorldMapDemo() {
  return (
    <section
      className="relative z-20 overflow-hidden bg-transparent px-5 py-20 text-white sm:px-8 lg:px-10 lg:py-28"
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(189,121,29,0.025),rgba(4,7,6,0)_44%)]" />

      <div className="relative mx-auto max-w-[96rem]">
        <div className="mx-auto mb-8 max-w-4xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-200">
            Ractysh routing layer
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Global OTC routing for private exchange mandates
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-white/58 sm:text-base sm:leading-7">
            Verified liquidity paths across key desks, structured for private
            mandate review, quote discipline, corridor control, and clean
            settlement reporting.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 28, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.65, ease: "easeOut" }}
          className="relative -mx-3 overflow-hidden border border-white/10 bg-black/38 p-2 shadow-[0_34px_120px_rgba(0,0,0,0.36)] backdrop-blur-md sm:mx-0 sm:p-4 lg:-mx-8 lg:p-5"
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_52%_42%,rgba(22,184,147,0.16),transparent_35%),radial-gradient(circle_at_68%_76%,rgba(189,121,29,0.15),transparent_28%)]" />
          <div className="relative">
            <WorldMap dots={otcRoutes} lineColor="#16b893" mapColorMode="dark" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
