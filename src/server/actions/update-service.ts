"use server";

import { z } from "zod";
import { serviceSchema } from "@/src/config/config";
import { updateConfig } from "@/src/server/actions/update-config";
import { auth } from "@/src/server/auth";
import { getConfig } from "@/src/server/get-config";

const payloadSchema = z.object({
	index: z.number().int().nonnegative(),
	service: serviceSchema,
});

export async function updateService(values: unknown) {
	const session = await auth();
	if (!session) {
		return { success: false, error: "Unauthorized" };
	}

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
}
