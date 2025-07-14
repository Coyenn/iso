"use server";

import {
	type Config,
	configLocation,
	configSchema,
	defaultConfig,
} from "@/src/config/config";

export const getConfig = async (): Promise<Config> => {
	try {
		const file = Bun.file(configLocation);
		const rawConfig = await file.json();
		const parsed = configSchema.safeParse(rawConfig);

		if (!parsed.success) {
			console.error("Config validation failed:", parsed.error.format());

			return defaultConfig;
		}

		return {
			...defaultConfig,
			...parsed.data,
		};
	} catch (_) {
		console.log("Error reading config, falling back to default config");

		return defaultConfig;
	}
};
