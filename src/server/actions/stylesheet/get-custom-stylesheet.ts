"use server";

import { customStylesheetLocation } from "@/src/config/stylesheet";

export async function getCustomStylesheet() {
	const file = Bun.file(customStylesheetLocation);

	if (!file.exists()) {
		await Bun.write(customStylesheetLocation, "");
	}

	return await file.text();
}
