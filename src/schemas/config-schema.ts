import z from "zod";
import { greetingSchema } from "@/src/schemas/greeting-schema";
import { searchEngineSchema } from "@/src/schemas/search-engine-schema";
import { serviceSchema } from "@/src/schemas/service-schema";
import { themeSchema } from "@/src/schemas/theme-schema";

export const configSchema = z.object({
	title: z.string(),
	services: z.array(serviceSchema),
	locale: z.enum(["en", "es", "fr", "de"]),
	theme: themeSchema.default("neutral"),
	greetings: z.array(greetingSchema),
	pageLoadAnimation: z.boolean().default(true),
	search: z
		.object({
			enabled: z.boolean().default(false),
			engine: searchEngineSchema.default("google"),
			engineUrl: z.string().optional(),
			placeholder: z.string().optional(),
		})
		.default({ enabled: false, engine: "google" }),
});

export type Config = z.infer<typeof configSchema>;
