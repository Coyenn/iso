"use client";

import { Plus } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { AddServiceForm } from "@/src/components/forms/add-service-form";
import { Button } from "@/src/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/src/components/ui/dialog";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/src/components/ui/tooltip";

export function AddServiceButton() {
	const t = useTranslations("tooltips");
	const [isClient, setIsClient] = useState(false);
	const pathname = usePathname();

	useEffect(() => {
		setIsClient(true);
	}, []);

	if (!isClient || pathname !== "/") return null;

	return (
		<Dialog>
			<Tooltip>
				<AnimatePresence mode="wait">
					<TooltipTrigger asChild>
						<DialogTrigger asChild>
							<motion.div
								initial={{ scale: 0.75, opacity: 0 }}
								animate={{ scale: 1, opacity: 1 }}
								exit={{ scale: 0.75, opacity: 0 }}
								transition={{ duration: 0.15, ease: "easeInOut" }}
								key="settings"
							>
								<Button variant="ghost" size="icon">
									<Plus />
								</Button>
							</motion.div>
						</DialogTrigger>
					</TooltipTrigger>
				</AnimatePresence>
				<TooltipContent>{t("addService")}</TooltipContent>
			</Tooltip>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader className="mb-2">
					<DialogTitle>Add Service</DialogTitle>
					<DialogDescription>
						Add a new service to your website.
					</DialogDescription>
				</DialogHeader>
				<AddServiceForm />
			</DialogContent>
		</Dialog>
	);
}
