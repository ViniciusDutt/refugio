import { create } from "zustand";
import { Mission } from "@/types/types";

interface MissionsState {
  missions: Mission[];
  setMissions: (missions: Mission[]) => void;
  clearMissions: () => void;
  loading: boolean;
  setLoading: (value: boolean) => void;
}

export const useMissionsStore = create<MissionsState>((set) => ({
  missions: [],
  loading: true,
  setMissions: (missions) => set({ missions }),
  clearMissions: () => set({ missions: [] }),
  setLoading: (loading) => set({ loading }),
}));
