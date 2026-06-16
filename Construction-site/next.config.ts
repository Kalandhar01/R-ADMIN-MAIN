import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "10.185.136.238",
    "10.169.138.244",
    "10.48.213.238",
    "127.0.0.1",
  ],
  images: {
    formats: ["image/webp"],
    qualities: [48, 55, 70, 75, 80, 90]
  },
};

export default nextConfig;
