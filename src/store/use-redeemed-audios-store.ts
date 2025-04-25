import { create } from "zustand";
import { RadioMessage } from "@/types/types";

interface RedeemedAudiosStoreState {
  redeemedAudios: RadioMessage[];
  setRedeemedAudios: (audios: RadioMessage[]) => void;
  clearRedeemedAudios: () => void;
}

export const useRedeemedAudiosStore = create<RedeemedAudiosStoreState>(
  (set) => ({
    redeemedAudios: [],
    setRedeemedAudios: (audios) => set({ redeemedAudios: audios }),
    clearRedeemedAudios: () => set({ redeemedAudios: [] }),
  })
);
