import { cn } from "@/lib/utils";
import React from "react";

interface GridBackgroundProps {
  children: React.ReactNode;
  className?: string;
  light?: boolean;
}

export default function GridBackground({ children, className, light }: GridBackgroundProps) {
  return (
    <div
      className={cn(
        "relative w-full",
        light
          ? "bg-white"
          : "bg-black",
        className,
      )}
    >
      <div
        className={cn(
          "absolute inset-0",
          "[background-size:40px_40px]",
          light
            ? "[background-image:linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]"
            : "[background-image:linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)]",
        )}
      />
      {light && (
        <div className="pointer-events-none absolute inset-0 bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_30%,black)]" />
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
