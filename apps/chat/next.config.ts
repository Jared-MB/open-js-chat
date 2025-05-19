import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    viewTransition: true,
    ppr: true,
    reactCompiler: true
  },
};

export default nextConfig;
