"use client";

import { AnimatePresence, motion } from "motion/react";
import type z from "zod";
import { ServiceIcon } from "@/src/components/service-icon";
import type { serviceSchema } from "@/src/config/config";

export interface ServiceIconListProps {
	services: z.infer<typeof serviceSchema>[];
}

// Motion container variants that stagger children
const containerVariants = {
	hidden: { opacity: 0 },
	show: {
		opacity: 1,
		transition: {
			staggerChildren: 0.1,
		},
	},
};

export function ServiceIconList(props: ServiceIconListProps) {
	const { services } = props;

	return (
		<AnimatePresence>
			<motion.div
				variants={containerVariants}
				initial="hidden"
				animate="show"
				exit="hidden"
				className="flex flex-wrap justify-center gap-8 sm:mb-16 md:mb-20"
			>
				{services.map((service) => (
					<ServiceIcon key={service.label} {...service} />
				))}
			</motion.div>
		</AnimatePresence>
	);
}
