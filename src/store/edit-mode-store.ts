import { create } from "zustand";

export interface EditModeStoreState {
	editMode: boolean;
}

export interface EditModeStoreActions {
	setEditMode: (editMode: boolean) => void;
}

export type EditModeStore = EditModeStoreState & EditModeStoreActions;

export const useEditModeStore = create<EditModeStore>((set) => ({
	editMode: false,
	setEditMode: (editMode) => set({ editMode }),
}));
