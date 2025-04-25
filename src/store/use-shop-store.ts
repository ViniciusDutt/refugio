import { create } from "zustand";
import { ShopItem } from "@/types/types";

interface StoreState {
  items: ShopItem[];
  setItems: (items: ShopItem[]) => void;
  clearItems: () => void;
  loading: boolean;
  setLoading: (value: boolean) => void;
}

export const useShopStore = create<StoreState>((set) => ({
  items: [],
  loading: true,
  setItems: (items) => set({ items }),
  clearItems: () => set({ items: [] }),
  setLoading: (loading) => set({ loading }),
}));
