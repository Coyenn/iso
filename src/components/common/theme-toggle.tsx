"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@/src/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/src/components/ui/tooltip";

export function ThemeToggle() {
	const { theme, setTheme } = useTheme();
	const [isClient, setIsClient] = useState(false);
	const t = useTranslations("tooltips");

	useEffect(() => {
		setIsClient(true);
	}, []);

	if (!isClient) return null;

	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<Button
					variant="ghost"
					size="icon"
					onClick={() => {
						if (theme === "light") setTheme("dark");
						else if (theme === "dark") setTheme("system");
						else setTheme("light");
					}}
					aria-label={`Toggle theme to ${theme === "light" ? "dark" : theme === "dark" ? "system" : "light"}. Current theme is ${theme}.`}
				>
					<AnimatePresence mode="wait">
						{theme === "light" && (
							<motion.div
								initial={{ scale: 0.75, opacity: 0 }}
								animate={{ scale: 1, opacity: 1 }}
								exit={{ scale: 0.75, opacity: 0 }}
								transition={{ duration: 0.15, ease: "easeInOut" }}
								key="light"
							>
								<Sun />
							</motion.div>
						)}
						{theme === "dark" && (
							<motion.div
								initial={{ scale: 0.75, opacity: 0 }}
								animate={{ scale: 1, opacity: 1 }}
								exit={{ scale: 0.75, opacity: 0 }}
								transition={{ duration: 0.15, ease: "easeInOut" }}
								key="dark"
							>
								<Moon />
							</motion.div>
						)}
						{theme === "system" && (
							<motion.div
								initial={{ scale: 0.75, opacity: 0 }}
								animate={{ scale: 1, opacity: 1 }}
								exit={{ scale: 0.75, opacity: 0 }}
								transition={{ duration: 0.15, ease: "easeInOut" }}
								key="system"
							>
								<Monitor />
							</motion.div>
						)}
					</AnimatePresence>
				</Button>
			</TooltipTrigger>
			<TooltipContent>{t("toggleTheme")}</TooltipContent>
		</Tooltip>
	);
}
