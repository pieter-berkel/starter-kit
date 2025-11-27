import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  transpilePackages: ["@workspace/ui", "@workspace/auth", "@workspace/mailer"],
};

export default nextConfig;
