import { auth } from "@/src/server/auth";

export async function uploadIcon(icon: File) {
	const session = await auth();
	if (!session) {
		return { success: false, error: "Unauthorized" };
	}

	try {
		const dataFile = Bun.file(
			`${process.env.APP_DATA_PATH}/images/${icon.name}`,
		);
		const publicFile = Bun.file(`public/images/${icon.name}`);

		await Bun.write(dataFile, icon);
		await Bun.write(publicFile, icon);

		return { success: true, icon: `/images/${icon.name}` };
	} catch (error) {
		console.error(error);
		return { success: false, error: "Failed to upload icon" };
	}
}
