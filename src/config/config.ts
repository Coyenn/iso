import { icons } from "@/src/config/icons";
import type { Config } from "@/src/schemas/config-schema";

export const configLocation = `${process.env.APP_DATA_PATH}/config.json`;

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
	locale: "en",
	pageLoadAnimation: true,
	theme: "neutral",
	greetings: [],
} satisfies Config;
