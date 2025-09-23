"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Searchbar } from "@/src/components/searchbar";
import { ServiceIconList } from "@/src/components/service-icon-list";
import { cn } from "@/src/lib/utils";
import type { Config } from "@/src/schemas/config-schema";
import type { Greeting } from "@/src/schemas/greeting-schema";

export interface MainSectionProps {
	config: Config;
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
		<section
			className={cn(
				"container flex flex-1 flex-col items-center justify-center gap-6 py-16 sm:gap-10 md:gap-16",
				config.search?.enabled && "pb-0 md:gap-12",
			)}
		>
			<motion.h1
				initial={{ opacity: 0, y: 10, scale: 0.9 }}
				animate={{ opacity: 1, y: 0, scale: 1 }}
				transition={{
					duration: config.pageLoadAnimation ? 0.2 : 0,
					ease: "easeInOut",
				}}
				className="font-instrument-serif text-4xl sm:text-5xl md:text-6xl"
			>
				{randomGreeting ?? t("defaultGreeting")}
			</motion.h1>
			{config.search?.enabled && (
				<Searchbar config={config} className="mb-4 md:mb-8" />
			)}
			<ServiceIconList
				pageLoadAnimation={config.pageLoadAnimation}
				config={config}
			/>
		</section>
	);
}
