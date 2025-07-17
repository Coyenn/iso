import z from "zod";
import { greetingSchema } from "@/src/schemas/greeting-schema";
import { serviceSchema } from "@/src/schemas/service-schema";

export const configSchema = z.object({
	title: z.string(),
	services: z.array(serviceSchema),
	locale: z.enum(["en", "es", "fr", "de"]),
	greetings: z.array(greetingSchema),
});

export type Config = z.infer<typeof configSchema>;
