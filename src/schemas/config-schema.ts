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
	showSearchbar: z.boolean().default(false),
	searchEngine: searchEngineSchema.default("google"),
	searchEngineUrl: z.string().optional(),
	searchPlaceholder: z.string().optional(),
});

export type Config = z.infer<typeof configSchema>;
