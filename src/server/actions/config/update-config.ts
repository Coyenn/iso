"use server";

import { configLocation } from "@/src/config/config";
import type { Config } from "@/src/schemas/config-schema";
import { configSchema } from "@/src/schemas/config-schema";
import { withAuth } from "@/src/server/utils/with-auth";

export async function updateConfig(values: Config) {
	return withAuth(async () => {
		const parsed = configSchema.safeParse(values);

		if (!parsed.success) {
			return {
				success: false,
				error: "Invalid configuration supplied",
			};
		}

		await Bun.write(configLocation, JSON.stringify(parsed.data, null, 2));

		return {
			success: true,
		};
	});
}
