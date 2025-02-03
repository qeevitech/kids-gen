import { create } from "zustand";
import { Editor } from "@/features/designs/types";

interface EditorsState {
  editors: { [key: number]: Editor };
  currentPage: number;
  setEditor: (pageIndex: number, editor: Editor) => void;
  setCurrentPage: (pageIndex: number) => void;
  getCurrentEditor: () => Editor | undefined;
}

export const useEditorsStore = create<EditorsState>((set, get) => ({
  editors: {},
  currentPage: 0,
  setEditor: (pageIndex, editor) =>
    set((state) => ({ editors: { ...state.editors, [pageIndex]: editor } })),
  setCurrentPage: (pageIndex) => set({ currentPage: pageIndex }),
  getCurrentEditor: () => get().editors[get().currentPage],
}));
