"use client";

import { motion } from "framer-motion";
import type z from "zod";
import { ServiceIconList } from "@/src/components/service-icon-list";
import type { configSchema, Greeting } from "@/src/config/config";

export interface MainSectionProps {
	config: z.infer<typeof configSchema>;
}

export function MainSection(props: MainSectionProps) {
	const { config } = props;
	const greetings: Array<Greeting> = config.greetings ?? [];
	const randomGreeting =
		greetings[Math.floor(Math.random() * greetings.length)]?.message ?? "";

	return (
		<section className="sm:-mt-16 md:-mt-20 container flex flex-1 flex-col items-center justify-center gap-10 py-16 sm:gap-12 md:gap-16">
			<motion.h1
				initial={{ opacity: 0, y: 10, scale: 0.9 }}
				animate={{ opacity: 1, y: 0, scale: 1 }}
				transition={{ duration: 0.2, ease: "easeInOut" }}
				className="font-instrument-serif text-4xl sm:text-5xl md:text-6xl"
			>
				{randomGreeting}
			</motion.h1>
			<ServiceIconList services={config.services} />
		</section>
	);
}
