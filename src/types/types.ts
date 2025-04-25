export type UserProfile = {
  id: string;
  name: string;
  role?: string;
  points: number;
  contract_accepted: boolean;
};

export type RadioMessage = {
  id: number;
  created_at: string;
  title: string;
  url: string;
  file_path: string;
  category: string;
  available: boolean;
};

export type Mission = {
  id: string;
  user_id: string;
  mission_id: string;
  status: "pendente" | "concluida" | "expirada";
  completed_at: string | null;
  note?: string | null;
  missions: {
    id: string;
    title: string;
    description: string;
    reward: number;
    is_active: boolean;
  };
};

export type ShopItem = {
  id: number;
  name: string;
  description: string;
  image_url: string;
  cost: number;
  available: boolean;
  category: string;
  ref_id?: number | string | null;
  audio?: {
    id: number;
    title: string;
    file_path: string;
    created_at: string;
  };
};

export type RedeemedStoreState = {
  redeemedItems: number[];
  setRedeemedItems: (items: number[]) => void;
  clearRedeemedItems: () => void;
};

export type AdminMission = {
  id: number;
  created_at: string;
  mission_id: number;
  user_id: string;
  status: string;
  missions: {
    id: number;
    title: string;
    description: string;
    reward: number;
    is_active: boolean;
  };
};

export interface AdminShopItem {
  id: number;
  name: string;
  description: string;
  cost: number;
  category: string;
  image_url: string;
  available: boolean;
  ref_id?: number | null;
}

export interface AdminAudio {
  id: number;
  title: string;
  file_path: string;
  created_at: string;
  available: boolean;
}

export interface AdminStoreState {
  missions: AdminMission[];
  shop: AdminShopItem[];
  audios: AdminAudio[];
  setMissions: (missions: AdminMission[]) => void;
  setShop: (shop: AdminShopItem[]) => void;
  setAudios: (audios: AdminAudio[]) => void;
}

export type AddAudioResult = {
  success: boolean;
  message: string;
  audio?: AdminAudio;
  shop?: AdminShopItem;
};

export interface NewShopItem {
  name: string;
  cost: number;
  description?: string;
  image_url?: string;
  category?: string;
}

export interface Sticker {
  id: string;
  place_id: string;
  image_url: string | null;
  rarity: "common" | "rare" | "epic" | "legendary";
  name: string;
}

export interface Place {
  id: string;
  user_id: string;
  title: string;
  cover_image: string | null;
  description?: string | null;
  coord?: {
    lat: number;
    lng: number;
  } | null;
  class: "S" | "A" | "B" | "C";
  unlocked_at: string | null;
}

export interface AlbumPage {
  placeId: string;
  title: string;
  pageNumber: number;
  stickers: Sticker[];
}

export interface UserStickerEntry {
  sticker_id: string;
  is_pasted: boolean;
  source: string | null;
}

export interface DailyPack {
  id: number;
  stickers: Sticker[];
}
