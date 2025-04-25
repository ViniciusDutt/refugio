import { create } from "zustand";
import { AdminStoreState } from "@/types/types";

export const useAdminStore = create<AdminStoreState>((set) => ({
  missions: [],
  shop: [],
  audios: [],
  setMissions: (missions) => set({ missions }),
  setShop: (shop) => set({ shop }),
  setAudios: (audios) => set({ audios }),
}));
