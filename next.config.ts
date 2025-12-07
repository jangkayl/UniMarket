import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
	images: {
		unoptimized: true,
		remotePatterns: [
			{
				protocol: "http",
				hostname: "localhost",
				port: "8080", // Allow images from Spring Boot
				pathname: "/**", // Allow all paths
			},
		],
	},
};

export default nextConfig;
