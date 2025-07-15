"use server";

import { customStylesheetLocation } from "@/src/config/stylesheet";

export async function getCustomStylesheet() {
	try {
		const file = Bun.file(customStylesheetLocation);

		if (!file.exists()) {
			await Bun.write(customStylesheetLocation, "");
		}

		return await file.text();
	} catch (error) {
		console.error(error);

		return "";
	}
}
