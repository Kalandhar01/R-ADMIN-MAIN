"use client";

import dynamic from "next/dynamic";
import { motion } from "motion/react";

const World = dynamic(
  () => import("@/components/ui/globe").then((module) => module.World),
  {
    ssr: false,
  },
);

const globeConfig = {
  pointSize: 4,
  globeColor: "#062056",
  showAtmosphere: true,
  atmosphereColor: "#ffffff",
  atmosphereAltitude: 0.1,
  emissive: "#062056",
  emissiveIntensity: 0.1,
  shininess: 0.9,
  polygonColor: "rgba(255,255,255,0.7)",
  ambientLight: "#38bdf8",
  directionalLeftLight: "#ffffff",
  directionalTopLight: "#ffffff",
  pointLight: "#ffffff",
  arcTime: 1000,
  arcLength: 0.9,
  rings: 1,
  maxRings: 3,
  initialPosition: { lat: 13.0827, lng: 80.2707 },
  autoRotate: true,
  autoRotateSpeed: 0.5,
};

const arcs = [
  {
    order: 1,
    startLat: 13.0827,
    startLng: 80.2707,
    endLat: 12.9716,
    endLng: 77.5946,
    arcAlt: 0.18,
    color: "#06b6d4",
  },
  {
    order: 1,
    startLat: 13.0827,
    startLng: 80.2707,
    endLat: 11.0168,
    endLng: 76.9558,
    arcAlt: 0.14,
    color: "#3b82f6",
  },
  {
    order: 2,
    startLat: 28.6139,
    startLng: 77.209,
    endLat: 13.0827,
    endLng: 80.2707,
    arcAlt: 0.24,
    color: "#6366f1",
  },
  {
    order: 2,
    startLat: 1.3521,
    startLng: 103.8198,
    endLat: 13.0827,
    endLng: 80.2707,
    arcAlt: 0.32,
    color: "#06b6d4",
  },
  {
    order: 3,
    startLat: 25.2048,
    startLng: 55.2708,
    endLat: 13.0827,
    endLng: 80.2707,
    arcAlt: 0.36,
    color: "#3b82f6",
  },
];

export default function GlobeDemo() {
  return (
    <div className="relative flex h-screen w-full flex-row items-center justify-center bg-white py-20 dark:bg-black md:h-auto">
      <div className="relative mx-auto h-full w-full max-w-7xl overflow-hidden px-4 md:h-[40rem]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h2 className="text-center text-xl font-bold tracking-tight text-black dark:text-white md:text-4xl">
            Ractysh project intelligence
          </h2>
          <p className="mx-auto mt-2 max-w-md text-center text-base font-normal text-neutral-700 dark:text-neutral-200 md:text-lg">
            Live visibility across owners, partners, vendors, and active
            project zones.
          </p>
        </motion.div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-40 h-40 select-none bg-gradient-to-b from-transparent to-white dark:to-black" />
        <div className="absolute -bottom-20 z-10 h-72 w-full md:h-full">
          <World data={arcs} globeConfig={globeConfig} />
        </div>
      </div>
    </div>
  );
}
