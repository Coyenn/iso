import { z } from "zod";
import { icons } from "@/src/config/icons";

export const serviceSchema = z.object({
	order: z
		.number()
		.min(0, { message: "Service order must be greater than 0" })
		.optional(),
	icon: z.string().min(1, { message: "Service icon cannot be empty" }),
	label: z.string().min(1, { message: "Service label cannot be empty" }),
	href: z.url({ message: "Service href must be a valid URL" }),
});

export const greetingSchema = z.object({
	message: z.string().min(1, { message: "Greeting message cannot be empty" }),
});

export type Greeting = z.infer<typeof greetingSchema>;

export type Service = z.infer<typeof serviceSchema>;

export const defaultConfig = {
	title: "Iso Dashboard",
	services: [
		{
			order: 1,
			icon: icons.recordPlayer,
			label: "Audiobooks",
			href: "https://audiobooks.iso.com",
		},
		{
			order: 2,
			icon: icons.beamer,
			label: "Images & Videos",
			href: "https://images-videos.iso.com",
		},
		{
			order: 3,
			icon: icons.popcornBucket,
			label: "Movies & TV Shows",
			href: "https://movies-tv-shows.iso.com",
		},
		{
			order: 4,
			icon: icons.lock,
			label: "Backup & Restore",
			href: "https://backup-restore.iso.com",
		},
		{
			order: 5,
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

export const configLocation = `${process.env.APP_DATA_PATH}/config.json`;
