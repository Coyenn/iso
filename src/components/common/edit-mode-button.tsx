"use client";

import { Pencil, PencilOff } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Button } from "@/src/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/src/components/ui/tooltip";
import { useEditModeStore } from "@/src/store/edit-mode-store";

export function EditModeButton() {
	const [isClient, setIsClient] = useState(false);
	const t = useTranslations("tooltips.editMode");
	const { editMode, setEditMode } = useEditModeStore();
	const pathname = usePathname();

	useEffect(() => {
		setIsClient(true);
	}, []);

	if (!isClient || pathname !== "/") return null;

	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<Button
					variant="ghost"
					size="icon"
					onClick={() => {
						setEditMode(!editMode);
					}}
					aria-label={t("title")}
				>
					<AnimatePresence mode="wait">
						{editMode ? (
							<motion.div
								initial={{ scale: 0.75, opacity: 0 }}
								animate={{ scale: 1, opacity: 1 }}
								exit={{ scale: 0.75, opacity: 0 }}
								transition={{ duration: 0.15, ease: "easeInOut" }}
								key="editOff"
							>
								<PencilOff />
							</motion.div>
						) : (
							<motion.div
								initial={{ scale: 0.75, opacity: 0 }}
								animate={{ scale: 1, opacity: 1 }}
								exit={{ scale: 0.75, opacity: 0 }}
								transition={{ duration: 0.15, ease: "easeInOut" }}
								key="editOn"
							>
								<Pencil />
							</motion.div>
						)}
					</AnimatePresence>
				</Button>
			</TooltipTrigger>
			<TooltipContent>
				{editMode ? t("deactivate") : t("activate")}
			</TooltipContent>
		</Tooltip>
	);
}
