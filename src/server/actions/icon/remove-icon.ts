import { auth } from "@/src/server/auth";

export async function removeIcon(icon: string) {
	const session = await auth();
	if (!session) {
		return { success: false, error: "Unauthorized" };
	}

	try {
		const dataFile = Bun.file(`${process.env.APP_DATA_PATH}${icon}`);
		const publicFile = Bun.file(`public${icon}`);

		await dataFile.delete();
		await publicFile.delete();

		return { success: true };
	} catch (error) {
		console.error(error);
		return { success: false, error: "Failed to delete icon" };
	}
}
