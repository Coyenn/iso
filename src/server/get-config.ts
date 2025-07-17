"use server";

import z from "zod";
import { configLocation, defaultConfig } from "@/src/config/config";
import type { Config } from "@/src/schemas/config-schema";
import { configSchema } from "@/src/schemas/config-schema";

export const getConfig = async (): Promise<Config> => {
	try {
		const file = Bun.file(configLocation);

		if (!file.exists()) {
			await Bun.write(configLocation, JSON.stringify(defaultConfig, null, 2));
		}

		const rawConfig = await file.json();
		const parsed = configSchema.safeParse(rawConfig);

		if (!parsed.success) {
			console.error("Config validation failed:", z.treeifyError(parsed.error));

			return defaultConfig;
		}

		return {
			...defaultConfig,
			...parsed.data,
		};
	} catch (_) {
		return defaultConfig;
	}
};
