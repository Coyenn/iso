"use server";

import { customStylesheetLocation } from "@/src/config/stylesheet";
import { stylesheetSchema } from "@/src/schemas/stylesheet-schema";
import { withAuth } from "@/src/server/utils/with-auth";

export async function updateCustomStylesheet(values: unknown) {
	return withAuth(async () => {
		const parsedPayload = stylesheetSchema.safeParse(values);
		if (!parsedPayload.success) {
			return { success: false, error: "Invalid data supplied" };
		}

		const file = Bun.file(customStylesheetLocation);

		if (!(await file.exists())) {
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
