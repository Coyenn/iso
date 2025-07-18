import z from "zod";

export const themeSchema = z.enum([
	"neutral",
	"lime",
	"amethyst",
	"amber",
	"ocean",
	"sunshine",
]);

export type Theme = z.infer<typeof themeSchema>;
