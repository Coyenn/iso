import type z from "zod";
import { create } from "zustand";
import type { serviceSchema } from "@/src/config/config";

export interface CurrentServicesStoreState {
	currentServices: z.infer<typeof serviceSchema>[];
}

export interface CurrentServicesStoreActions {
	setCurrentServices: (services: z.infer<typeof serviceSchema>[]) => void;
}

export type CurrentServicesStore = CurrentServicesStoreState &
	CurrentServicesStoreActions;

export const useCurrentServicesStore = create<CurrentServicesStore>((set) => ({
	currentServices: [],
	setCurrentServices: (currentServices) => set({ currentServices }),
}));
