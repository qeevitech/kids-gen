import { create } from "zustand";

interface CreditsState {
  imageGenerationCount: number;
  modelTrainingCount: number;
  setImageGenerationCount: (count: number) => void;
  setModelTrainingCount: (count: number) => void;
  decrementImageGenerationCount: () => void;
  decrementModelTrainingCount: () => void;
}

export const useCreditsStore = create<CreditsState>((set) => ({
  imageGenerationCount: 0,
  modelTrainingCount: 0,
  setImageGenerationCount: (count) => set({ imageGenerationCount: count }),
  setModelTrainingCount: (count) => set({ modelTrainingCount: count }),
  decrementImageGenerationCount: () =>
    set((state) => ({
      imageGenerationCount: Math.max(0, state.imageGenerationCount - 1),
    })),
  decrementModelTrainingCount: () =>
    set((state) => ({
      modelTrainingCount: Math.max(0, state.modelTrainingCount - 1),
    })),
}));
