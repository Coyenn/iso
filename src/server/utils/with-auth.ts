export async function withAuth<T>(
	callback: () => Promise<T>,
): Promise<T | { success: false; error: "Unauthorized" }> {
	// Lazily import to avoid circular dependencies issues if any
	const { auth } = await import("@/src/server/auth");

	const session = await auth();
	if (!session) {
		return { success: false, error: "Unauthorized" } as const;
	}

	return callback();
}
