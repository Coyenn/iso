"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { X } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button } from "@/src/components/ui/button";
import { icons } from "@/src/config/icons";
import { cn } from "@/src/lib/utils";
import type { Service } from "@/src/schemas/service-schema";
import { removeService } from "@/src/server/actions/service/remove-service";
import { useCurrentServices } from "@/src/store/current-services-context";
import { useEditModeStore } from "@/src/store/edit-mode-store";

export interface ServiceIconProps {
	service: Service;
	index: number;
	pageLoadAnimation: boolean;
}

export function ServiceIcon(props: ServiceIconProps) {
	const { service, index, pageLoadAnimation } = props;
	const { label, href, icon } = service;
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({ id: label });
	const t = useTranslations("service");
	const { currentServices, setCurrentServices } = useCurrentServices();
	const { editMode } = useEditModeStore();
	const WrapperTag = editMode ? motion.div : motion.a;

	const onRemove = async (index: number) => {
		const result = await removeService(index);

		if (result.success) {
			setCurrentServices(currentServices.filter((_, i) => i !== index));
		} else {
			toast.error(result.error);
		}
	};

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		zIndex: isDragging ? 50 : undefined,
	} as React.CSSProperties;

	return (
		<WrapperTag
			{...(!editMode
				? { href, target: "_blank", rel: "noopener noreferrer" }
				: {})}
			{...attributes}
			{...listeners}
			ref={setNodeRef}
			style={style}
			className={cn(
				"group touch-none rounded-lg",
				editMode && "cursor-grab active:cursor-grabbing",
				!isDragging && "duration-200",
			)}
		>
			<div className="relative flex w-[150px] flex-col items-center overflow-hidden rounded-lg p-4 transition-colors duration-100 hover:bg-foreground/10 focus-visible:bg-foreground/10 group-focus-visible:bg-foreground/10 motion-reduce:duration-0 contrast-more:hover:underline sm:w-[175px] md:w-[225px] dark:group-focus-visible:bg-foreground/20 dark:focus-visible:bg-foreground/20 dark:hover:bg-foreground/20">
				{editMode && (
					<Button
						variant="ghost"
						size="icon"
						className="absolute top-2 right-2 z-10"
						aria-label={t("remove")}
						onClick={() => onRemove(index)}
					>
						<X />
					</Button>
				)}
				<motion.div
					animate={editMode ? { rotate: [-2, 2, -2] } : { rotate: 0 }}
					transition={{
						duration: pageLoadAnimation ? 0.4 : 0,
						ease: "easeInOut",
						repeat: Infinity,
						repeatType: "mirror",
					}}
					className="flex flex-col items-center gap-2"
				>
					{!icon || (!icon.startsWith("/") && !icons[icon]) ? (
						<div className="flex aspect-square w-[193px] items-center justify-center rounded-md bg-foreground/10">
							<p className="text-center text-sm">No icon</p>
						</div>
					) : (
						<Image
							src={icon.startsWith("/") ? icon : (icons[icon] ?? "")}
							alt={label}
							width={250}
							height={250}
							quality={90}
							loading="eager"
							draggable={false}
							className="aspect-square transition-transform duration-200 group-hover:scale-105 group-focus-visible:scale-105"
						/>
					)}
					<h3 className="text-center font-medium text-md sm:text-lg md:text-xl">
						{label}
					</h3>
				</motion.div>
			</div>
		</WrapperTag>
	);
}
