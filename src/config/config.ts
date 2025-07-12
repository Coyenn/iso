import { z } from "zod";

import camera from "@/public/images/camera.png";
import headphones from "@/public/images/headphones.png";
import server from "@/public/images/server.png";
import tv from "@/public/images/tv.png";

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

export const defaultIcons = {
	camera,
	headphones,
	server,
	tv,
};

export const defaultConfig: Config = {
	services: [
		{
			icon: defaultIcons.camera.src,
			label: "Camera",
			href: "/camera",
		},
		{
			icon: defaultIcons.headphones.src,
			label: "Headphones",
			href: "/headphones",
		},
		{
			icon: defaultIcons.server.src,
			label: "Server",
			href: "/server",
		},
		{
			icon: defaultIcons.tv.src,
			label: "TV",
			href: "/tv",
		},
	],
	locale: "en",
};
