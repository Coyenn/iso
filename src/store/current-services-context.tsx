"use client";

import {
	createContext,
	type Dispatch,
	type PropsWithChildren,
	type SetStateAction,
	useContext,
	useMemo,
	useState,
} from "react";
import type { Service } from "@/src/schemas/service-schema";

type CurrentServicesContextValue = {
	currentServices: Service[];
	setCurrentServices: Dispatch<SetStateAction<Service[]>>;
};

const CurrentServicesContext = createContext<
	CurrentServicesContextValue | undefined
>(undefined);

export interface CurrentServicesProviderProps {
	initialServices: Service[];
}

export function CurrentServicesProvider({
	children,
	initialServices,
}: PropsWithChildren<CurrentServicesProviderProps>) {
	const [currentServices, setCurrentServices] =
		useState<Service[]>(initialServices);

	const value = useMemo<CurrentServicesContextValue>(
		() => ({ currentServices, setCurrentServices }),
		[currentServices],
	);

	return (
		<CurrentServicesContext.Provider value={value}>
			{children}
		</CurrentServicesContext.Provider>
	);
}

export function useCurrentServices() {
	const context = useContext(CurrentServicesContext);
	if (context === undefined) {
		throw new Error(
			"useCurrentServices must be used within CurrentServicesProvider",
		);
	}
	return context;
}
