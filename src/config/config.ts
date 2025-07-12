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
			icon: "/images/camera.png",
			label: "Camera",
			href: "/camera",
		},
		{
			icon: "/images/headphones.png",
			label: "Headphones",
			href: "/headphones",
		},
		{
			icon: "/images/server.png",
			label: "Server",
			href: "/server",
		},
		{
			icon: "/images/tv.png",
			label: "TV",
			href: "/tv",
		},
	],
	locale: "en",
};
