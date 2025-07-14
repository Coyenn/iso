"use client";

import { Cog } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Button } from "@/src/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/src/components/ui/tooltip";

export function SettingsButton() {
	const t = useTranslations("tooltips");
	const [isClient, setIsClient] = useState(false);

	useEffect(() => {
		setIsClient(true);
	}, []);

	if (!isClient) return null;

	return (
		<Tooltip>
			<AnimatePresence mode="wait">
				<TooltipTrigger asChild>
					<motion.div
						initial={{ scale: 0.75, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						exit={{ scale: 0.75, opacity: 0 }}
						transition={{ duration: 0.15, ease: "easeInOut" }}
						key="settings"
					>
						<Button variant="ghost" size="icon" asChild>
							<Link href="/settings">
								<Cog />
							</Link>
						</Button>
					</motion.div>
				</TooltipTrigger>
			</AnimatePresence>
			<TooltipContent>{t("settings")}</TooltipContent>
		</Tooltip>
	);
}
