import { existsSync } from "node:fs";
import { cp, mkdir, rm } from "node:fs/promises";
import { env } from "@/src/env";

export const setupData = async () => {
	const appDataPath = env.APP_DATA_PATH;
	const imagesPath = `${appDataPath}/images`;
	const cssPath = `${appDataPath}/css`;

	if (!appDataPath) {
		throw new Error("APP_DATA_PATH is not set");
	}

	if (existsSync("public/images")) {
		await rm("public/images", { recursive: true });
	}
	if (existsSync("public/css")) {
		await rm("public/css", { recursive: true });
	}

	await mkdir(imagesPath, { recursive: true });
	await mkdir(cssPath, { recursive: true });

	await cp(imagesPath, "public/images", { recursive: true });
	await cp(cssPath, "public/css", { recursive: true });
};
