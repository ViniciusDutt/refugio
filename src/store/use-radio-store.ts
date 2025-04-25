import { create } from "zustand";
import { RadioMessage } from "@/types/types";
import { getUnlockedAudios } from "@/lib/actions/get-unlocked-audios";

interface RadioState {
  audios: RadioMessage[];
  setAudios: (audios: RadioMessage[]) => void;
  clearAudios: () => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  reload: () => Promise<void>;
}

export const useRadioStore = create<RadioState>((set) => ({
  audios: [],
  loading: true,
  setAudios: (audios) => set({ audios }),
  clearAudios: () => set({ audios: [] }),
  setLoading: (loading) => set({ loading }),
  reload: async () => {
    set({ loading: true });
    const audios = await getUnlockedAudios();
    set({ audios, loading: false });
  },
}));
