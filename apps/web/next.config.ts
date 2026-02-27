import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	transpilePackages: [
		"@workspace/ui",
		"@workspace/auth",
		"@workspace/db",
		"better-auth",
	],
};

export default nextConfig;
