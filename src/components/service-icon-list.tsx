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
import { motion, stagger, useAnimate } from "motion/react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { ServiceIcon } from "@/src/components/service-icon";
import type { Service } from "@/src/schemas/service-schema";
import { updateServices } from "@/src/server/actions/service/update-services";
import { useCurrentServicesStore } from "@/src/store/current-services-store";
import { useEditModeStore } from "@/src/store/edit-mode-store";

export interface ServiceIconListProps {
	services: Service[];
}

export function ServiceIconList(props: ServiceIconListProps) {
	const { services } = props;
	const [iconScope, iconAnimate] = useAnimate();
	const { currentServices, setCurrentServices } = useCurrentServicesStore();
	const t = useTranslations("service");
	const [isUpdating, setIsUpdating] = useState(false);
	const { editMode } = useEditModeStore();
	const sortedServices = useMemo(
		() => currentServices.sort((a, b) => (a?.order ?? 0) - (b?.order ?? 0)),
		[currentServices],
	);

	// biome-ignore lint/correctness/useExhaustiveDependencies: Set initial services
	useEffect(() => {
		setCurrentServices(services);
		iconAnimate([
			[
				".service-icon",
				{ opacity: [0, 1], scale: [0.9, 1], y: [10, 0] },
				{ duration: 0.2, delay: stagger(0.1) },
			],
		]);
	}, []);

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
				setCurrentServices(services);
			}
		} catch (error) {
			console.error(error);
			toast.error("Failed to update service order");
			setCurrentServices(services);
		} finally {
			setIsUpdating(false);
		}
	};

	return (
		<motion.div
			ref={iconScope}
			className="group/order flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8"
		>
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
					{sortedServices.map((service) => {
						const index = sortedServices.findIndex((s) => s === service);

						return (
							<ServiceIcon
								key={`${service.label}-${index}`}
								service={service}
								index={index}
							/>
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
		</motion.div>
	);
}
