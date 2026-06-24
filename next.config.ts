import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@ractysh/auth", "@ractysh/db", "@ractysh/types"],
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com"
      }
    ]
  }
};

export default nextConfig;
