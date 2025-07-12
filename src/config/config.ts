import { z } from "zod";
import { icons } from "@/src/config/icons";

export const serviceSchema = z.object({
	icon: z.string().min(1, { message: "Service icon cannot be empty" }),
	label: z.string().min(1, { message: "Service label cannot be empty" }),
	href: z.string().url({ message: "Service href must be a valid URL" }),
});

export const customGreetingsSchema = z
	.object({
		morning: z.string().optional(),
		afternoon: z.string().optional(),
		evening: z.string().optional(),
		night: z.string().optional(),
	})
	.partial();

export const configSchema = z.object({
	title: z.string().default("Iso Dashboard"),
	services: z.array(serviceSchema).default([]),
	locale: z.enum(["en", "es", "fr", "de"]).default("en"),
	customGreetings: customGreetingsSchema.optional(),
});

export type Config = z.infer<typeof configSchema>;

export const defaultConfig: Config = {
	title: "Iso Dashboard",
	services: [
		{
			icon: icons.recordPlayer,
			label: "Audiobooks",
			href: "/audiobooks",
		},
		{
			icon: icons.beamer,
			label: "Images & Videos",
			href: "/images-videos",
		},
		{
			icon: icons.popcornBucket,
			label: "Movies & TV Shows",
			href: "/movies-tv-shows",
		},
		{
			icon: icons.lock,
			label: "Backup & Restore",
			href: "/backup-restore",
		},
		{
			icon: icons.keychain,
			label: "Account",
			href: "/account",
		},
	],
	locale: "en",
};
