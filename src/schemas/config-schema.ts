import z from "zod";
import { greetingSchema } from "@/src/schemas/greeting-schema";
import { serviceSchema } from "@/src/schemas/service-schema";
import { themeSchema } from "@/src/schemas/theme-schema";

export const configSchema = z.object({
	title: z.string(),
	services: z.array(serviceSchema),
	locale: z.enum(["en", "es", "fr", "de"]),
	theme: themeSchema.default("neutral"),
	greetings: z.array(greetingSchema),
	pageLoadAnimation: z.boolean().default(true),
});

export type Config = z.infer<typeof configSchema>;
