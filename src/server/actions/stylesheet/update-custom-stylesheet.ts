"use server";

import z from "zod";
import { customStylesheetLocation } from "@/src/config/stylesheet";
import { auth } from "@/src/server/auth";

const payloadSchema = z.object({
	stylesheet: z.string().min(1).max(10000),
});

export async function updateCustomStylesheet(values: unknown) {
	const session = await auth();

	if (!session) {
		return {
			success: false,
			error: "Unauthorized",
		};
	}

	const parsedPayload = payloadSchema.safeParse(values);
	if (!parsedPayload.success) {
		return { success: false, error: "Invalid data supplied" };
	}

	const file = Bun.file(customStylesheetLocation);

	if (!file.exists()) {
		await Bun.write(customStylesheetLocation, parsedPayload.data.stylesheet);
	} else {
		await file.write(parsedPayload.data.stylesheet);
	}

	return {
		success: true,
	};
}
