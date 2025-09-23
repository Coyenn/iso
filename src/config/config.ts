import { icons } from "@/src/config/icons";
import { env } from "@/src/env";
import type { Config } from "@/src/schemas/config-schema";

export const configLocation = `${env.APP_DATA_PATH}/config.json`;

export const defaultConfig = {
	title: "Iso Dashboard",
	services: [
		{
			order: 1,
			icon: icons.recordPlayer as string,
			label: "Audiobooks",
			href: "https://audiobooks.iso.com",
		},
		{
			order: 2,
			icon: icons.beamer as string,
			label: "Images & Videos",
			href: "https://images-videos.iso.com",
		},
		{
			order: 3,
			icon: icons.popcornBucket as string,
			label: "Movies & TV Shows",
			href: "https://movies-tv-shows.iso.com",
		},
		{
			order: 4,
			icon: icons.lock as string,
			label: "Backup & Restore",
			href: "https://backup-restore.iso.com",
		},
		{
			order: 5,
			icon: icons.keychain as string,
			label: "Account",
			href: "https://account.iso.com",
		},
	],
	openServicesIn: "new-tab",
	locale: "en",
	pageLoadAnimation: true,
	theme: "neutral",
	greetings: [],
	search: {
		enabled: false,
		engine: "google",
		engineUrl: "",
		placeholder: "",
	},
	backgroundImage: {
		light: "",
		dark: "",
		opacity: 50,
		blur: "xs",
	},
} satisfies Config;
