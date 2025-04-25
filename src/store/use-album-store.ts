import { create } from "zustand";
import { AlbumPage } from "@/types/types";

interface AlbumStoreState {
  pages: AlbumPage[];
  setPages: (pages: AlbumPage[]) => void;
  clearPages: () => void;
}

export const useAlbumStore = create<AlbumStoreState>((set) => ({
  pages: [],
  setPages: (pages) => set({ pages }),
  clearPages: () => set({ pages: [] }),
}));
