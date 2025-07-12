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
			className="group relative flex w-[150px] flex-col items-center overflow-hidden rounded-lg p-4 transition-colors duration-100 hover:bg-muted focus-visible:bg-muted motion-reduce:duration-0 contrast-more:hover:underline sm:w-[175px] md:w-[225px]"
		>
			<Image
				src={icon}
				alt={label}
				width={250}
				height={250}
				quality={90}
				loading="eager"
				className="aspect-square transition-transform duration-200 group-hover:scale-105 group-focus-visible:scale-105"
			/>
			<h3 className="text-center font-medium text-md sm:text-lg md:text-xl">
				{label}
			</h3>
		</motion.a>
	);
}
