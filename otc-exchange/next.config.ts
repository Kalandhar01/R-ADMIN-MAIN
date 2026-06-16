import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  turbopack: {
    root: process.cwd(),
  },
  optimizePackageImports: ["lucide-react", "motion", "three"],
};

export default nextConfig;
