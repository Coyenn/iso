import { create } from "zustand";

export interface OpenIframeStoreState {
	openIframe: string | null;
}

export interface OpenIframeStoreActions {
	setOpenIframe: (openIframe: string | null) => void;
}

export type OpenIframeStore = OpenIframeStoreState & OpenIframeStoreActions;

export const useOpenIframeStore = create<OpenIframeStore>((set) => ({
	openIframe: null,
	setOpenIframe: (openIframe) => set({ openIframe }),
}));
