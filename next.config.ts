import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@ractysh/auth", "@ractysh/db", "@ractysh/types"]
};

export default nextConfig;
