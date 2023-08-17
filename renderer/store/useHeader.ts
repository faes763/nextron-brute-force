import { create } from "zustand";

interface stateHeader {
    isOpen: boolean
    open: () => void
    close: () => void
}

export const useHeader = create<stateHeader>((set) => ({
    isOpen: false,
    open: () => set({ isOpen: true }),
    close: () => set({ isOpen: false }),
}));