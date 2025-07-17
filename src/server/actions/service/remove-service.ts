"use server";

import { z } from "zod";
import { updateConfig } from "@/src/server/actions/config/update-config";
import { removeIcon } from "@/src/server/actions/icon/remove-icon";
import { getConfig } from "@/src/server/get-config";
import { withAuth } from "@/src/server/utils/with-auth";

export async function removeService(index: unknown) {
	return withAuth(async () => {
		const config = await getConfig();

		const indexSchema = z.number().int().nonnegative();
		const parsedIndex = indexSchema.safeParse(index);

		if (!parsedIndex.success) {
			return { success: false, error: "Invalid index supplied" };
		}

		const service = config.services[parsedIndex.data];

		if (service?.icon?.startsWith("/images/")) {
			await removeIcon(service.icon);
		}

		config.services = config.services.filter((_, i) => i !== parsedIndex.data);

		const result = await updateConfig(config);

		return result;
	});
}
