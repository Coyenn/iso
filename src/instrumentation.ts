export async function register() {
	if (process.env.NEXT_RUNTIME === "nodejs") {
		await import("./server/setup-data").then(async (module) => {
			await module.setupData();
		});
	}
}
