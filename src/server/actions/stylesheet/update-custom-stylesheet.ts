"use server";

import {
	customStylesheetLocation,
	stylesheetSchema,
} from "@/src/config/stylesheet";
import { withAuth } from "@/src/server/utils/with-auth";

export async function updateCustomStylesheet(values: unknown) {
	return withAuth(async () => {
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
	});
}
