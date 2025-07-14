"use client";

import { useAutoAnimate } from "@formkit/auto-animate/react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type z from "zod";
import { ServiceIcon } from "@/src/components/service-icon";
import type { Service, serviceSchema } from "@/src/config/config";
import { removeService } from "@/src/server/actions/remove-service";

export interface ServiceIconListProps {
	services: z.infer<typeof serviceSchema>[];
}

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
	const [parent] = useAutoAnimate();
	const [currentServices, setCurrentServices] = useState<Service[]>(services);

	const onServiceRemove = async (index: number) => {
		const result = await removeService(index);

		if (result.success) {
			setCurrentServices(currentServices.filter((_, i) => i !== index));
		} else {
			toast.error(result.error);
		}
	};

	return (
		<AnimatePresence>
			<motion.div
				variants={containerVariants}
				initial="hidden"
				animate="show"
				exit="hidden"
				ref={parent}
				className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8"
			>
				<AnimatePresence>
					{currentServices
						.sort((a, b) => (a?.order ?? 0) - (b?.order ?? 0))
						.map((service, index) => (
							<ServiceIcon
								key={service.label}
								{...service}
								index={index}
								onRemove={onServiceRemove}
							/>
						))}
				</AnimatePresence>
			</motion.div>
		</AnimatePresence>
	);
}
