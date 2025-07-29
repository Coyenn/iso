/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const config: NextConfig = {
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
		serverActions: {
			bodySizeLimit: "25mb",
		},
	},
};

export default withNextIntl(config);
