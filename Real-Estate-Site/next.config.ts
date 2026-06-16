import type { NextConfig } from "next";

const ractyshGroupOrigin = process.env.RACTYSH_GROUP_ORIGIN?.replace(/\/$/, "");

const nextConfig: NextConfig = {
  devIndicators: false,
  transpilePackages: ["@ractysh/db"],
  images: {
    deviceSizes: [640, 750, 828, 1080, 1200, 1600, 1920, 2400],
    formats: ["image/avif", "image/webp"],
    qualities: [70, 78, 84, 88, 90],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  async rewrites() {
    if (!ractyshGroupOrigin) return [];

    return [
      {
        source: "/api/newsletter/:path*",
        destination: `${ractyshGroupOrigin}/api/newsletter/:path*`
      }
    ];
  }
};

export default nextConfig;
