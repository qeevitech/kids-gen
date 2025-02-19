import { create } from "zustand";

type ImageGenerationModalState = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const useImageGenerationModal = create<ImageGenerationModalState>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
