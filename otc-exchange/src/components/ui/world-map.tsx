"use client";

import { useMemo, useRef } from "react";
import DottedMap from "dotted-map";
import Image from "next/image";

interface MapProps {
  dots?: Array<{
    start: { lat: number; lng: number; label?: string };
    end: { lat: number; lng: number; label?: string };
  }>;
  lineColor?: string;
  mapColorMode?: "dark" | "light";
}

export default function WorldMap({
  dots = [],
  lineColor = "#16b893",
  mapColorMode,
}: MapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const isDark = mapColorMode !== "light";

  const svgMap = useMemo(() => {
    const map = new DottedMap({ height: 100, grid: "diagonal" });

    return map.getSVG({
      radius: 0.22,
      color: isDark ? "#FFFFFF40" : "#00000040",
      shape: "circle",
      backgroundColor: isDark ? "black" : "white",
    });
  }, [isDark]);

  const projectPoint = (lat: number, lng: number) => {
    const x = (lng + 180) * (800 / 360);
    const y = (90 - lat) * (400 / 180);
    return { x, y };
  };

  const createCurvedPath = (
    start: { x: number; y: number },
    end: { x: number; y: number },
  ) => {
    const midX = (start.x + end.x) / 2;
    const midY = Math.min(start.y, end.y) - 50;
    return `M ${start.x} ${start.y} Q ${midX} ${midY} ${end.x} ${end.y}`;
  };

  return (
    <div className="relative aspect-[2/1] w-full overflow-hidden rounded-lg bg-black font-sans">
      <Image
        src={`data:image/svg+xml;utf8,${encodeURIComponent(svgMap)}`}
        className="pointer-events-none h-full w-full select-none opacity-80 [mask-image:linear-gradient(to_bottom,transparent,white_10%,white_90%,transparent)]"
        alt="world map"
        height="495"
        width="1056"
        unoptimized
        draggable={false}
        loading="lazy"
      />
      <svg
        ref={svgRef}
        viewBox="0 0 800 400"
        className="pointer-events-none absolute inset-0 h-full w-full select-none"
      >
        {dots.map((dot, i) => {
          const startPoint = projectPoint(dot.start.lat, dot.start.lng);
          const endPoint = projectPoint(dot.end.lat, dot.end.lng);

          return (
            <g key={`path-group-${i}`}>
              <path
                d={createCurvedPath(startPoint, endPoint)}
                fill="none"
                stroke="url(#path-gradient)"
                strokeWidth="1"
              />
            </g>
          );
        })}

        <defs>
          <linearGradient id="path-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="white" stopOpacity="0" />
            <stop offset="5%" stopColor={lineColor} stopOpacity="1" />
            <stop offset="95%" stopColor={lineColor} stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
        </defs>

        {dots.map((dot, i) => (
          <g key={`points-group-${i}`}>
            <circle
              cx={projectPoint(dot.start.lat, dot.start.lng).x}
              cy={projectPoint(dot.start.lat, dot.start.lng).y}
              r="2"
              fill={lineColor}
            />
            <circle
              cx={projectPoint(dot.end.lat, dot.end.lng).x}
              cy={projectPoint(dot.end.lat, dot.end.lng).y}
              r="2"
              fill={lineColor}
            />
          </g>
        ))}
      </svg>
    </div>
  );
}
