"use server";

import type { Service } from "@/src/schemas/service-schema";
import { updateConfig } from "@/src/server/actions/config/update-config";
import { getConfig } from "@/src/server/get-config";
import { withAuth } from "@/src/server/utils/with-auth";

export async function updateServices(newServices: Service[]) {
	return withAuth(async () => {
		const config = await getConfig();

		config.services = newServices;

		const result = await updateConfig(config);

		return result;
	});
}
