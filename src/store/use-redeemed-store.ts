import { create } from "zustand";
import { RedeemedStoreState } from "@/types/types";

export const useRedeemedStore = create<RedeemedStoreState>((set) => ({
  redeemedItems: [],
  setRedeemedItems: (items) => set({ redeemedItems: items }),
  clearRedeemedItems: () => set({ redeemedItems: [] }),
}));
