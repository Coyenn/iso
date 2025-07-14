"use client";

import { X } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import type z from "zod";
import { Button } from "@/src/components/ui/button";
import type { serviceSchema } from "@/src/config/config";
import { icons } from "@/src/config/icons";
import { cn } from "@/src/lib/utils";
import { useEditModeStore } from "@/src/store/edit-mode-store";

const itemVariants = {
	hidden: { opacity: 0, scale: 0.9, y: 10 },
	show: { opacity: 1, scale: 1, y: 0 },
};

export type ServiceIconProps = z.infer<typeof serviceSchema> & {
	index: number;
	onRemove: (index: number) => void;
};

export function ServiceIcon(props: ServiceIconProps) {
	const { icon, label, href, index, onRemove } = props;
	const { editMode } = useEditModeStore();
	const t = useTranslations("service");

	const wrapperClasses =
		"group relative flex w-[150px] flex-col items-center overflow-hidden rounded-lg p-4 transition-colors duration-100 hover:bg-muted focus-visible:bg-muted motion-reduce:duration-0 contrast-more:hover:underline sm:w-[175px] md:w-[225px]";

	const content = (
		<motion.div
			animate={editMode ? { rotate: [-2, 2, -2] } : { rotate: 0 }}
			transition={{
				duration: 0.4,
				ease: "easeInOut",
				repeat: Infinity,
				repeatType: "mirror",
			}}
			className="flex flex-col items-center"
		>
			<Image
				src={icon.startsWith("/") ? icon : icons[icon as keyof typeof icons]}
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

	return editMode ? (
		<motion.div
			variants={itemVariants}
			initial="hidden"
			animate="show"
			exit="hidden"
			className="relative"
		>
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
			<motion.button
				variants={itemVariants}
				className={cn(wrapperClasses, "!cursor-grab active:!cursor-grabbing")}
			>
				{content}
			</motion.button>
		</motion.div>
	) : (
		<motion.a
			href={href}
			target="_blank"
			variants={itemVariants}
			className={wrapperClasses}
		>
			{content}
		</motion.a>
	);
}
