export type LocaleName = "en" | "es" | "fr" | "de";

export interface Locale {
	name: LocaleName;
	dayTime: {
		morning: string;
		afternoon: string;
		evening: string;
		night: string;
	};
}

export const locales: Locale[] = [
	{
		name: "en",
		dayTime: {
			morning: "Good morning",
			afternoon: "Good afternoon",
			evening: "Good evening",
			night: "Good night",
		},
	},
	{
		name: "es",
		dayTime: {
			morning: "Buenos días",
			afternoon: "Buenas tardes",
			evening: "Buenas noches",
			night: "Buenas noches",
		},
	},
	{
		name: "fr",
		dayTime: {
			morning: "Bonjour",
			afternoon: "Bonsoir",
			evening: "Bonsoir",
			night: "Bonsoir",
		},
	},
	{
		name: "de",
		dayTime: {
			morning: "Guten Morgen",
			afternoon: "Guten Tag",
			evening: "Guten Abend",
			night: "Guten Abend",
		},
	},
];
