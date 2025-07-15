"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import type z from "zod";
import { ServiceIconList } from "@/src/components/service-icon-list";
import type { configSchema, Greeting } from "@/src/config/config";

export interface MainSectionProps {
	config: z.infer<typeof configSchema>;
}

export function MainSection(props: MainSectionProps) {
	const [mounted, setMounted] = useState(false);
	const { config } = props;
	const t = useTranslations();
	const greetings: Array<Greeting> = config.greetings ?? [];
	const randomGreeting =
		greetings.length > 0
			? greetings[Math.floor(Math.random() * greetings.length)]?.message
			: t("defaultGreeting");

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return null;
	}

	return (
		<section className="container flex flex-1 flex-col items-center justify-center gap-6 py-16 sm:gap-10 md:gap-16">
			<motion.h1
				initial={{ opacity: 0, y: 10, scale: 0.9 }}
				animate={{ opacity: 1, y: 0, scale: 1 }}
				transition={{ duration: 0.2, ease: "easeInOut" }}
				className="font-instrument-serif text-4xl sm:text-5xl md:text-6xl"
			>
				{randomGreeting ?? t("defaultGreeting")}
			</motion.h1>
			<ServiceIconList services={config.services} />
		</section>
	);
}
