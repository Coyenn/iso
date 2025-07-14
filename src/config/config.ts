import { z } from "zod";
import { icons } from "@/src/config/icons";

export const serviceSchema = z.object({
	icon: z.string().min(1, { message: "Service icon cannot be empty" }),
	label: z.string().min(1, { message: "Service label cannot be empty" }),
	href: z.url({ message: "Service href must be a valid URL" }),
});

export const greetingSchema = z.object({
	message: z.string().min(1, { message: "Greeting message cannot be empty" }),
});

export type Greeting = z.infer<typeof greetingSchema>;

export const defaultConfig = {
	title: "Iso Dashboard",
	services: [
		{
			icon: icons.recordPlayer,
			label: "Audiobooks",
			href: "https://audiobooks.iso.com",
		},
		{
			icon: icons.beamer,
			label: "Images & Videos",
			href: "https://images-videos.iso.com",
		},
		{
			icon: icons.popcornBucket,
			label: "Movies & TV Shows",
			href: "https://movies-tv-shows.iso.com",
		},
		{
			icon: icons.lock,
			label: "Backup & Restore",
			href: "https://backup-restore.iso.com",
		},
		{
			icon: icons.keychain,
			label: "Account",
			href: "https://account.iso.com",
		},
	],
	locale: "en" as const,
	greetings: [],
};

export const configSchema = z.object({
	title: z.string(),
	services: z.array(serviceSchema),
	locale: z.enum(["en", "es", "fr", "de"]),
	greetings: z.array(greetingSchema),
});

export type Config = z.infer<typeof configSchema>;
