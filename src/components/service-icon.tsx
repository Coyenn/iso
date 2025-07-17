"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { X } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Button } from "@/src/components/ui/button";
import { icons } from "@/src/config/icons";
import { cn } from "@/src/lib/utils";
import type { Service } from "@/src/schemas/service-schema";
import { useEditModeStore } from "@/src/store/edit-mode-store";

export const itemVariants = {
	hidden: { opacity: 0, scale: 0.9, y: 10 },
	show: { opacity: 1, scale: 1, y: 0 },
};

export type ServiceIconProps = Service & {
	index: number;
	onRemove: (index: number) => void;
};

export function ServiceIcon(props: ServiceIconProps) {
	const { icon, label, index, onRemove } = props;
	const { editMode } = useEditModeStore();
	const t = useTranslations("service");

	const content = (
		<motion.div
			animate={editMode ? { rotate: [-2, 2, -2] } : { rotate: 0 }}
			transition={{
				duration: editMode ? 0.4 : 0,
				ease: "easeInOut",
				repeat: Infinity,
				repeatType: "mirror",
			}}
			className="flex flex-col items-center"
		>
			<Image
				src={
					icon.startsWith("/")
						? icon
						: (icons[icon as keyof typeof icons] ?? icon)
				}
				alt={label}
				width={250}
				height={250}
				quality={90}
				loading="eager"
				draggable={false}
				className="aspect-square transition-transform duration-200 group-hover:scale-105 group-focus-visible:scale-105"
			/>
			<h3 className="text-center font-medium text-md sm:text-lg md:text-xl">
				{label}
			</h3>
		</motion.div>
	);

	return (
		<motion.div className="service-icon relative">
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
			<div
				className={
					"relative flex w-[150px] flex-col items-center overflow-hidden rounded-lg p-4 transition-colors duration-100 hover:bg-muted focus-visible:bg-muted group-focus-visible:bg-muted motion-reduce:duration-0 contrast-more:hover:underline sm:w-[175px] md:w-[225px]"
				}
			>
				{content}
			</div>
		</motion.div>
	);
}

export interface SortableServiceIconProps {
	service: Service;
	index: number;
	onRemove: (index: number) => void;
}

export function SortableServiceIcon(props: SortableServiceIconProps) {
	const { service, index, onRemove } = props;
	const { label, href } = service;
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({ id: label });

	const { editMode } = useEditModeStore();

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		zIndex: isDragging ? 50 : undefined,
	} as React.CSSProperties;

	const WrapperTag = editMode ? "div" : "a";

	return (
		<WrapperTag
			{...(!editMode
				? { href, target: "_blank", rel: "noopener noreferrer" }
				: {})}
			ref={setNodeRef}
			style={style}
			{...attributes}
			{...listeners}
			className={cn(
				"group touch-none rounded-lg",
				editMode && "cursor-grab active:cursor-grabbing",
			)}
		>
			<ServiceIcon {...service} index={index} onRemove={onRemove} />
		</WrapperTag>
	);
}
