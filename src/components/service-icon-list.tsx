"use client";

import {
	closestCorners,
	DndContext,
	type DragEndEvent,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import {
	arrayMove,
	rectSortingStrategy,
	SortableContext,
	sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { motion } from "motion/react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { ServiceIcon } from "@/src/components/service-icon";
import type { Config } from "@/src/schemas/config-schema";
import { updateServices } from "@/src/server/actions/service/update-services";
import { useCurrentServices } from "@/src/store/current-services-context";
import { useEditModeStore } from "@/src/store/edit-mode-store";

export const itemVariants = {
	hidden: { opacity: 0, scale: 0.8, y: 10 },
	show: { opacity: 1, scale: 1, y: 0 },
	exit: { opacity: 0, scale: 0, y: 10, width: 0 },
};

export interface ServiceIconListProps {
	pageLoadAnimation: boolean;
	config: Config;
}

export function ServiceIconList(props: ServiceIconListProps) {
	const { pageLoadAnimation, config } = props;
	const { currentServices, setCurrentServices } = useCurrentServices();
	const t = useTranslations("service");
	const [isUpdating, setIsUpdating] = useState(false);
	const { editMode } = useEditModeStore();
	const sortedServices = useMemo(
		() => currentServices.sort((a, b) => (a?.order ?? 0) - (b?.order ?? 0)),
		[currentServices],
	);

	const hasAnimatedRef = useRef(false);

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 8,
			},
		}),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	);

	const handleDragEnd = async (event: DragEndEvent) => {
		const { active, over } = event;

		if (!over || active.id === over.id || isUpdating) {
			return;
		}

		setIsUpdating(true);

		const oldIndex = sortedServices.findIndex(
			(service) => service.label === active.id,
		);
		const newIndex = sortedServices.findIndex(
			(service) => service.label === over.id,
		);

		const newOrder = arrayMove(sortedServices, oldIndex, newIndex).map(
			(service, index) => ({
				...service,
				order: index + 1,
			}),
		);

		setCurrentServices(newOrder);

		try {
			const result = await updateServices(newOrder);

			if (!result.success) {
				toast.error(result.error || "Failed to update service order");
			}
		} catch (error) {
			console.error(error);
			toast.error("Failed to update service order");
		} finally {
			setIsUpdating(false);
		}
	};

	return (
		<div className="group/order flex flex-wrap justify-center gap-4 pb-8 sm:gap-6 md:gap-8">
			<DndContext
				sensors={sensors}
				collisionDetection={closestCorners}
				onDragEnd={handleDragEnd}
			>
				<SortableContext
					items={sortedServices.map((service) => service.label)}
					disabled={!editMode}
					strategy={rectSortingStrategy}
				>
					{sortedServices.map((service, index) => {
						return (
							<motion.div
								variants={itemVariants}
								key={`${service.label}-${index}`}
								initial={hasAnimatedRef.current ? false : "hidden"}
								animate="show"
								exit="exit"
								transition={{
									duration: pageLoadAnimation ? 0.2 : 0,
									delay: pageLoadAnimation
										? hasAnimatedRef.current
											? 0
											: index * 0.1
										: 0,
								}}
								onAnimationComplete={() => {
									hasAnimatedRef.current = true;
								}}
							>
								<ServiceIcon
									key={`${service.label}-${index}`}
									service={service}
									index={index}
									pageLoadAnimation={pageLoadAnimation}
									config={config}
								/>
							</motion.div>
						);
					})}
				</SortableContext>
			</DndContext>
			{sortedServices.length === 0 && (
				<motion.div className="service-icon relative">
					<div
						className={
							"relative flex w-[150px] flex-col items-center overflow-hidden rounded-lg p-4 transition-colors sm:w-[175px] md:w-[225px]"
						}
					>
						<div className="flex flex-col items-center">
							<Image
								src={"/icons/blueprint.png"}
								alt={t("emptyState")}
								width={250}
								height={250}
								quality={90}
								loading="eager"
								draggable={false}
								className="aspect-square grayscale-100 transition-transform duration-200 group-hover:scale-105 group-focus-visible:scale-105"
							/>
							<h3 className="text-center font-medium text-md sm:text-lg md:text-xl">
								{t("emptyState")}
							</h3>
						</div>
					</div>
				</motion.div>
			)}
		</div>
	);
}
