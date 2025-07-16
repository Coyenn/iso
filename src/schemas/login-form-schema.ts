import { z } from "zod";

export const loginFormSchema = z.object({
	password: z
		.string()
		.min(3, { message: "Password must be at least 3 characters long" })
		.regex(/[a-zA-Z0-9]/, { message: "Password must be alphanumeric" }),
});
