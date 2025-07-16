import { readdirSync } from "node:fs";
import { auth } from "@/src/server/auth";

export async function getUploadedIcons() {
	const session = await auth();
	if (!session) {
		return {
			success: false,
			error: "Unauthorized",
		};
	}

	try {
		const files: [string, string][] = [];

		for (const file of readdirSync("public/images")) {
			files.push([file, `/images/${file}`]);
		}

		return {
			success: true,
			icons: files,
		};
	} catch (error) {
		console.error(error);
		return {
			success: false,
			error: "Failed to get uploaded icons",
		};
	}
}
