"use server";

import { serviceSchema } from "@/src/config/config";
import { updateConfig } from "@/src/server/actions/config/update-config";
import { auth } from "@/src/server/auth";
import { getConfig } from "@/src/server/get-config";

const payloadSchema = serviceSchema;

export async function addService(values: unknown) {
	const session = await auth();
	if (!session) {
		return { success: false, error: "Unauthorized" };
	}

	const parsedPayload = payloadSchema.safeParse(values);
	if (!parsedPayload.success) {
		return { success: false, error: "Invalid payload" };
	}

	const config = await getConfig();
	const service = parsedPayload.data;

	if (config.services.find((s) => s.label === service.label)) {
		return { success: false, error: "Service already exists" };
	}

	config.services.push(service);

	const result = await updateConfig(config);

	return result;
}
