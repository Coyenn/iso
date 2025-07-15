"use server";

import {
	customStylesheetLocation,
	stylesheetSchema,
} from "@/src/config/stylesheet";
import { auth } from "@/src/server/auth";

export async function updateCustomStylesheet(values: unknown) {
	const session = await auth();

	if (!session) {
		return {
			success: false,
			error: "Unauthorized",
		};
	}

	const parsedPayload = stylesheetSchema.safeParse(values);
	if (!parsedPayload.success) {
		return { success: false, error: "Invalid data supplied" };
	}

	const file = Bun.file(customStylesheetLocation);

	if (!file.exists()) {
		await Bun.write(
			customStylesheetLocation,
			parsedPayload.data.customStylesheet,
		);
	} else {
		await file.write(parsedPayload.data.customStylesheet);
	}

	return {
		success: true,
	};
}
