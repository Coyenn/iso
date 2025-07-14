"use server";

import fs from "node:fs";
import { type Config, configLocation, configSchema } from "@/src/config/config";
import { auth } from "@/src/server/auth";

export async function updateConfig(values: Config) {
	const session = await auth();

	if (!session) {
		return {
			success: false,
			error: "Unauthorized",
		};
	}

	const parsed = configSchema.safeParse(values);

	if (!parsed.success) {
		return {
			success: false,
			error: "Invalid configuration supplied",
		};
	}

	if (!fs.existsSync(configLocation)) {
		return {
			success: false,
			error: "Config file not found",
		};
	}

	await Bun.write(configLocation, JSON.stringify(parsed.data, null, 2));

	return {
		success: true,
	};
}
