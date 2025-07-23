"use server";

import { readdir, unlink } from "node:fs/promises";
import { join } from "node:path";
import { env } from "@/src/env";
import { withAuth } from "@/src/server/utils/with-auth";

const uploadImage = async (file: File, prefix: string): Promise<string> => {
	const extMatch = /\.([^.]+)$/.exec(file.name);
	const ext = extMatch ? `.${extMatch[1]}` : "";
	const timestamp = Date.now();
	const filename = `${prefix}-${timestamp}${ext}`;
	const dataFile = Bun.file(`${env.APP_DATA_PATH}/images/${filename}`);
	const publicFile = Bun.file(`${env.APP_PATH}/public/images/${filename}`);

	await Bun.write(dataFile, file);
	await Bun.write(publicFile, file);

	return `/images/${filename}`;
};

const deletePreviousBackgroundImages = async (): Promise<void> => {
	try {
		const dataImagesDir = `${env.APP_DATA_PATH}/images`;
		const publicImagesDir = `${env.APP_PATH}/public/images`;

		// Delete from data directory
		const dataFiles = await readdir(dataImagesDir);
		for (const file of dataFiles) {
			if (file.startsWith("bg-light-") || file.startsWith("bg-dark-")) {
				await unlink(join(dataImagesDir, file));
			}
		}

		// Delete from public directory
		const publicFiles = await readdir(publicImagesDir);
		for (const file of publicFiles) {
			if (file.startsWith("bg-light-") || file.startsWith("bg-dark-")) {
				await unlink(join(publicImagesDir, file));
			}
		}
	} catch (error) {
		console.error("Error deleting previous background images:", error);
	}
};

export async function uploadBackgroundImages(backgroundImages: {
	light?: File | string;
	dark?: File | string;
}) {
	return withAuth(async () => {
		try {
			const result = { light: "", dark: "" };

			// Delete previous background images if new ones are being uploaded
			if (
				backgroundImages.light instanceof File ||
				backgroundImages.dark instanceof File
			) {
				await deletePreviousBackgroundImages();
			}

			if (backgroundImages.light instanceof File) {
				result.light = await uploadImage(backgroundImages.light, "bg-light");
			} else if (typeof backgroundImages.light === "string") {
				result.light = backgroundImages.light;
			}

			if (backgroundImages.dark instanceof File) {
				result.dark = await uploadImage(backgroundImages.dark, "bg-dark");
			} else if (typeof backgroundImages.dark === "string") {
				result.dark = backgroundImages.dark;
			}

			return { success: true, images: result };
		} catch (error) {
			console.error(error);
			return { success: false, error: "Failed to upload background images" };
		}
	});
}
