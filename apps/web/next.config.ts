import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: false,
  transpilePackages: ["@workspace/ui", "@workspace/auth"],
};

export default nextConfig;
