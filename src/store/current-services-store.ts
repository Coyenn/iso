import { create } from "zustand";
import type { Service } from "@/src/schemas/service-schema";

export interface CurrentServicesStoreState {
	currentServices: Service[];
}

export interface CurrentServicesStoreActions {
	setCurrentServices: (services: Service[]) => void;
}

export type CurrentServicesStore = CurrentServicesStoreState &
	CurrentServicesStoreActions;

export const useCurrentServicesStore = create<CurrentServicesStore>((set) => ({
	currentServices: [],
	setCurrentServices: (currentServices) => set({ currentServices }),
}));
