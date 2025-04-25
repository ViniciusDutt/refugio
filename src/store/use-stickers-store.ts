import { create } from "zustand";
import { DailyPack } from "@/types/types";

export interface UserStickerEntry {
  sticker_id: string;
  is_pasted: boolean;
  source: string | null;
}

interface UseStickerStore {
  userStickers: UserStickerEntry[];
  setUserStickers: (stickers: UserStickerEntry[]) => void;
  appendUserStickers: (stickers: UserStickerEntry[]) => void;
  addPastedSticker: (id: string) => void;
  isStickerPasted: (id: string) => boolean;

  activeDraggingId: string | null;
  setActiveDraggingId: (id: string | null) => void;

  lastPastedId: string | null;
  setLastPastedId: (id: string | null) => void;

  dailyPacks: DailyPack[];
  setDailyPacks: (packs: DailyPack[]) => void;
  removePackByIndex: (index: number) => void;
}

export const useStickerStore = create<UseStickerStore>((set, get) => ({
  userStickers: [],
  activeDraggingId: null,
  lastPastedId: null,
  dailyPacks: [],

  setActiveDraggingId: (id) => set({ activeDraggingId: id }),

  setLastPastedId: (id) => set({ lastPastedId: id }),

  setUserStickers: (stickers) => set({ userStickers: stickers }),

  appendUserStickers: (newStickers) =>
    set((state) => ({
      userStickers: [...state.userStickers, ...newStickers],
    })),

  addPastedSticker: (id) => {
    const updated = get().userStickers.map((s) =>
      String(s.sticker_id) === String(id) ? { ...s, is_pasted: true } : s
    );
    set({ userStickers: updated, lastPastedId: id });
    setTimeout(() => {
      if (get().lastPastedId === id) {
        set({ lastPastedId: null });
      }
    }, 1000);
  },

  isStickerPasted: (id) =>
    get().userStickers.some(
      (s) => String(s.sticker_id) === String(id) && s.is_pasted
    ),

  setDailyPacks: (packs) => set({ dailyPacks: packs }),

  removePackByIndex: (index) => {
    set((state) => {
      const packs = [...state.dailyPacks];
      packs.splice(index, 1);
      return { dailyPacks: packs };
    });
  },
}));
