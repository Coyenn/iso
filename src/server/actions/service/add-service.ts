"use server";

import { addServiceSchema } from "@/src/schemas/add-service-schema";
import { serviceSchema } from "@/src/schemas/service-schema";
import { updateConfig } from "@/src/server/actions/config/update-config";
import { uploadIcon } from "@/src/server/actions/icon/upload-icon";
import { auth } from "@/src/server/auth";
import { getConfig } from "@/src/server/get-config";

export async function addService(values: unknown) {
	try {
		const session = await auth();
		if (!session) {
			return { success: false, error: "Unauthorized" };
		}

		const parsedPayload = addServiceSchema.safeParse(values);
		if (!parsedPayload.success) {
			return { success: false, error: "Invalid payload" };
		}

		const config = await getConfig();
		const service = parsedPayload.data;

		if (config.services.find((s) => s.label === service.label)) {
			return { success: false, error: "Service already exists" };
		}

		if (service.icon instanceof File) {
			const result = await uploadIcon(service.icon);

			if (!result.success || !result.icon) {
				return { success: false, error: result.error };
			} else {
				service.icon = result.icon;
			}
		}

		const createdService = serviceSchema.parse(service);

		config.services.push(createdService);

		const result = await updateConfig(config);

		if (result.success) {
			return { success: true, data: serviceSchema.parse(createdService) };
		} else {
			return { success: false, error: result.error };
		}
	} catch (error) {
		console.error(error);
		return { success: false, error: "Failed to add service" };
	}
}
