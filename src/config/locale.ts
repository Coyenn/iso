import type { Greeting } from "@/src/schemas/greeting-schema";

export type LocaleCode = "en" | "es" | "fr" | "de";

export interface Locale {
	code: LocaleCode;
	name: string;
	greetings: Array<Greeting>;
}

export const locales: Locale[] = [
	{
		code: "en",
		name: "English",
		greetings: [{ message: "Welcome!" }],
	},
	{
		code: "es",
		name: "Español",
		greetings: [{ message: "Bienvenido!" }],
	},
	{
		code: "fr",
		name: "Français",
		greetings: [{ message: "Bienvenue!" }],
	},
	{
		code: "de",
		name: "Deutsch",
		greetings: [{ message: "Willkommen!" }],
	},
];
