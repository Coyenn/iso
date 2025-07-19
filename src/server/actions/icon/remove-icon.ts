import { env } from "@/src/env";
import { withAuth } from "@/src/server/utils/with-auth";

export async function removeIcon(icon: string) {
	return withAuth(async () => {
		try {
			const dataFile = Bun.file(`${env.APP_DATA_PATH}${icon}`);
			const publicFile = Bun.file(`public${icon}`);

			await dataFile.delete();
			await publicFile.delete();

			return { success: true };
		} catch (error) {
			console.error(error);
			return { success: false, error: "Failed to delete icon" };
		}
	});
}
