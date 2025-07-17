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

export interface AddServiceButtonProps {
	serviceCount: number;
	allUploadedIcons: [string, string][];
}

export function AddServiceButton(props: AddServiceButtonProps) {
	const { serviceCount, allUploadedIcons } = props;
	const tTooltip = useTranslations("tooltips");
	const tForm = useTranslations("forms.addService");
	const [isClient, setIsClient] = useState(false);
	const pathname = usePathname();
	const [modalIsOpen, setModalIsOpen] = useState(false);

	useEffect(() => {
		setIsClient(true);
	}, []);

	if (!isClient || pathname !== "/") return null;

	return (
		<Dialog open={modalIsOpen} onOpenChange={setModalIsOpen}>
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
				<TooltipContent>{tTooltip("addService")}</TooltipContent>
			</Tooltip>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader className="mb-2">
					<DialogTitle>{tForm("dialogTitle")}</DialogTitle>
					<DialogDescription>{tForm("dialogDescription")}</DialogDescription>
				</DialogHeader>
				<AddServiceForm
					currentServiceCount={serviceCount}
					allUploadedIcons={allUploadedIcons}
					onSuccess={() => {
						setModalIsOpen(false);
					}}
				/>
			</DialogContent>
		</Dialog>
	);
}
