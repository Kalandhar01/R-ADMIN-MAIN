import type { NextConfig } from "next";
import { resolve } from "node:path";

const nextConfig: NextConfig = {
  outputFileTracingRoot: resolve(process.cwd(), "../"),
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [70, 75, 78, 84, 90]
  },
  optimizePackageImports: ["lucide-react", "framer-motion", "three"],
  allowedDevOrigins: ["10.177.149.172"]
};

export default nextConfig;
