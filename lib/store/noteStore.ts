import { create } from "zustand";
import { persist } from "zustand/middleware";

const initialDraft = {
  title: "",
  content: "",
  tag: "Todo",
};

interface Draft {
  title: string;
  content: string;
  tag: string;
}

interface NoteStore {
  draft: Draft;
  setDraft: (fields: Partial<Draft>) => void;
  clearDraft: () => void;
}

export const useNoteStore = create<NoteStore>()(
  persist(
    (set) => ({
      draft: initialDraft,
      setDraft: (fields) =>
        set((state) => ({ draft: { ...state.draft, ...fields } })),
      clearDraft: () => set({ draft: initialDraft }),
    }),
    { name: "note-draft-storage" },
  ),
);
