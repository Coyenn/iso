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
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import type z from "zod";
import { SortableServiceIcon } from "@/src/components/service-icon";
import type { Service, serviceSchema } from "@/src/config/config";
import { removeService } from "@/src/server/actions/remove-service";
import { updateServices } from "@/src/server/actions/update-services";
import { useEditModeStore } from "@/src/store/edit-mode-store";

export interface ServiceIconListProps {
	services: z.infer<typeof serviceSchema>[];
}

const containerVariants = {
	hidden: {},
	show: {
		transition: {
			staggerChildren: 0.1,
		},
	},
};

export function ServiceIconList(props: ServiceIconListProps) {
	const { services } = props;
	const [currentServices, setCurrentServices] = useState<Service[]>(services);
	const [isUpdating, setIsUpdating] = useState(false);
	const { editMode } = useEditModeStore();
	const sortedServices = useMemo(
		() => currentServices.sort((a, b) => (a?.order ?? 0) - (b?.order ?? 0)),
		[currentServices],
	);

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

	const onServiceRemove = async (index: number) => {
		const result = await removeService(index);

		if (result.success) {
			setCurrentServices(currentServices.filter((_, i) => i !== index));
		} else {
			toast.error(result.error);
		}
	};

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
		<AnimatePresence>
			<motion.div
				variants={containerVariants}
				initial="hidden"
				animate="show"
				exit="hidden"
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
						<div className="group/order flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8">
							{sortedServices.map((service, index) => (
								<SortableServiceIcon
									key={service.label}
									service={service}
									index={index}
									onRemove={onServiceRemove}
								/>
							))}
						</div>
					</SortableContext>
				</DndContext>
			</motion.div>
		</AnimatePresence>
	);
}
