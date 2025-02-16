import { create } from "zustand";
import { Editor } from "@/features/designs/types";
import { Design } from "@/types";

interface EditorsState {
  editors: { [key: number]: Editor };
  pageIds: { [key: number]: string };
  currentPage: number;
  initialData: Design | null;
  isGenerating: boolean;

  setEditor: (pageIndex: number, editor: Editor) => void;
  setPageId: (pageIndex: number, pageId: string) => void;
  setCurrentPage: (pageIndex: number) => void;
  setInitialData: (data: Design) => void;
  getCurrentEditor: () => Editor | undefined;
  getPageId: (pageIndex: number) => string | undefined;
  updatePages: (pages: Design["pages"]) => void;
  setIsGenerating: (isGenerating: boolean) => void;
}

export const useEditorsStore = create<EditorsState>((set, get) => ({
  editors: {},
  pageIds: {},
  currentPage: 0,
  initialData: null,
  isGenerating: false,

  setEditor: (pageIndex, editor) =>
    set((state) => {
      console.log(state.editors);
      return { editors: { ...state.editors, [pageIndex]: editor } };
    }),

  setPageId: (pageIndex, pageId) =>
    set((state) => ({ pageIds: { ...state.pageIds, [pageIndex]: pageId } })),

  setCurrentPage: (pageIndex) => set({ currentPage: pageIndex }),

  setInitialData: (data) => set({ initialData: data }),

  getCurrentEditor: () => get().editors[get().currentPage],

  getPageId: (pageIndex) => get().pageIds[pageIndex],

  updatePages: (pages) =>
    set((state) => {
      if (!state.initialData) return state;
      return {
        initialData: {
          ...state.initialData,
          pages,
        },
      };
    }),

  setIsGenerating: (isGenerating) => set({ isGenerating }),
}));
