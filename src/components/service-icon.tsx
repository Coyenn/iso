import { motion } from "motion/react";
import Image from "next/image";
import type z from "zod";
import type { serviceSchema } from "@/src/config/config";

// Variants for each service item – used by the parent container for staggering
const itemVariants = {
	hidden: { opacity: 0, scale: 0.9, y: 10 },
	show: { opacity: 1, scale: 1, y: 0 },
};

export type ServiceIconProps = z.infer<typeof serviceSchema>;

export function ServiceIcon(props: ServiceIconProps) {
	const { icon, label, href } = props;

	return (
		<motion.a
			href={href}
			target="_blank"
			variants={itemVariants}
			className="group flex aspect-square w-[125px] flex-col items-center rounded-lg p-4 transition-colors duration-100 hover:bg-muted focus-visible:bg-muted motion-reduce:duration-0 contrast-more:hover:underline sm:w-[175px] md:w-[225px]"
		>
			<Image
				src={icon}
				alt={label}
				width={225}
				height={225}
				className="transition-transform duration-200 group-hover:scale-105 group-focus-visible:scale-105"
			/>
			<h3 className="font-medium text-lg text-center sm:text-xl">{label}</h3>
		</motion.a>
	);
}
