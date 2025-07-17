"use server";

import { z } from "zod";
import { serviceSchema } from "@/src/schemas/service-schema";
import { updateConfig } from "@/src/server/actions/config/update-config";
import { getConfig } from "@/src/server/get-config";
import { withAuth } from "@/src/server/utils/with-auth";

const payloadSchema = z.object({
	index: z.number().int().nonnegative(),
	service: serviceSchema,
});

export async function updateService(values: unknown) {
	return withAuth(async () => {
		const config = await getConfig();

		const parsedPayload = payloadSchema.safeParse(values);
		if (!parsedPayload.success) {
			return { success: false, error: "Invalid data supplied" };
		}

		if (parsedPayload.data.index >= config.services.length) {
			return { success: false, error: "Service index out of range" };
		}

		config.services[parsedPayload.data.index] = parsedPayload.data.service;

		const result = await updateConfig(config);

		return result;
	});
}
