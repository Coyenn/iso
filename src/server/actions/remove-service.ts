"use server";

import { z } from "zod";
import { updateConfig } from "@/src/server/actions/update-config";
import { auth } from "@/src/server/auth";
import { getConfig } from "@/src/server/get-config";

export async function removeService(index: unknown) {
	const session = await auth();
	if (!session) {
		return { success: false, error: "Unauthorized" };
	}

	const config = await getConfig();

	const indexSchema = z.number().int().nonnegative();
	const parsedIndex = indexSchema.safeParse(index);

	if (!parsedIndex.success) {
		return { success: false, error: "Invalid index supplied" };
	}

	if (parsedIndex.data >= config.services.length) {
		return { success: false, error: "Service index out of range" };
	}

	config.services.splice(parsedIndex.data, 1);

	const result = await updateConfig(config);

	return result;
}
