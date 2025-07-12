import { z } from "zod";

export const serviceSchema = z.object({
	icon: z.string().min(1, { message: "Service icon cannot be empty" }),
	label: z.string().min(1, { message: "Service label cannot be empty" }),
	href: z.string().url({ message: "Service href must be a valid URL" }),
});

export const configSchema = z.object({
	services: z.array(serviceSchema).default([]),
	locale: z.enum(["en", "es", "fr", "de"]),
});

export type Config = z.infer<typeof configSchema>;

export const defaultConfig: Config = {
	services: [
		{
			icon: "/images/record-player.png",
			label: "Audiobooks",
			href: "/audiobooks",
		},
		{
			icon: "/images/beamer.png",
			label: "Images & Videos",
			href: "/images-videos",
		},
		{
			icon: "/images/popcorn-bucket.png",
			label: "Movies & TV Shows",
			href: "/movies-tv-shows",
		},
		{
			icon: "/images/lock.png",
			label: "Backup & Restore",
			href: "/backup-restore",
		},
		{
			icon: "/images/keychain.png",
			label: "Account",
			href: "/account",
		},
	],
	locale: "en",
};
