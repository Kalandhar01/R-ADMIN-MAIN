import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@ractysh/auth", "@ractysh/db"],
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com"
      }
    ]
  },
  serverActions: {
    bodySizeLimit: "50mb"
  },
  experimental: {
    proxyClientMaxBodySize: "50mb"
  }
};

export default nextConfig;
