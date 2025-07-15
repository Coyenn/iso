"use server";

import type { Service } from "@/src/config/config";
import { updateConfig } from "@/src/server/actions/config/update-config";
import { auth } from "@/src/server/auth";
import { getConfig } from "@/src/server/get-config";

export async function updateServices(newServices: Service[]) {
	const session = await auth();
	if (!session) {
		return { success: false, error: "Unauthorized" };
	}

	const config = await getConfig();

	config.services = newServices;

	const result = await updateConfig(config);

	return result;
}
