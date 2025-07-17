import z from "zod";

export const serviceSchema = z.object({
	order: z
		.number()
		.min(0, { message: "Service order must be greater than 0" })
		.optional(),
	icon: z.string().min(1, { message: "Service icon cannot be empty" }),
	label: z.string().min(1, { message: "Service label cannot be empty" }),
	href: z.url({ message: "Service href must be a valid URL" }),
});

export type Service = z.infer<typeof serviceSchema>;
