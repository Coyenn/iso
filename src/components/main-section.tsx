"use client";

import { motion } from "framer-motion";
import type z from "zod";
import { ServiceIconList } from "@/src/components/service-icon-list";
import type { configSchema } from "@/src/config/config";
import { locales } from "@/src/config/locale";

export interface MainSectionProps {
	config: z.infer<typeof configSchema>;
}

export function MainSection(props: MainSectionProps) {
	const { config } = props;
	const localeStrings = locales.find((locale) => locale.name === config.locale);
	const messages = {
		...localeStrings?.dayTime,
		...(config.customGreetings ?? {}),
	} as Record<string, string | undefined>;

	const hour = new Date().getHours();
	const dayTimeString =
		hour > 5 && hour < 12
			? messages.morning
			: hour < 18
				? messages.afternoon
				: hour < 22
					? messages.evening
					: messages.night;

	return (
		<section className="sm:-mt-16 md:-mt-20 container flex flex-1 flex-col items-center justify-center gap-10 py-16 sm:gap-12 md:gap-16">
			<motion.h1
				initial={{ opacity: 0, y: 10, scale: 0.9 }}
				animate={{ opacity: 1, y: 0, scale: 1 }}
				transition={{ duration: 0.2, ease: "easeInOut" }}
				className="font-instrument-serif text-4xl sm:text-5xl md:text-6xl"
			>
				{dayTimeString}
			</motion.h1>
			<ServiceIconList services={config.services} />
		</section>
	);
}
