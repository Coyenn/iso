/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
	reactStrictMode: true,
	output: "standalone",
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "**",
			},
		],
	},
	experimental: {
		scrollRestoration: true,
		reactCompiler: true,
	},
};

export default config;
