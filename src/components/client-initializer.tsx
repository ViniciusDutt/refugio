"use client";

import { useEffect } from "react";
import { useAdminStore } from "@/store/use-admin-store";
import { useMissionsStore } from "@/store/use-missions-store";
import { useRadioStore } from "@/store/use-radio-store";
import { useRedeemedAudiosStore } from "@/store/use-redeemed-audios-store";
import { useRedeemedStore } from "@/store/use-redeemed-store";
import { useShopStore } from "@/store/use-shop-store";
import { useUserStore } from "@/store/use-user-store";
import { useAlbumStore } from "@/store/use-album-store";
import { useStickerStore } from "@/store/use-stickers-store";

import {
  AdminAudio,
  AdminMission,
  AdminShopItem,
  Mission,
  RadioMessage,
  ShopItem,
  UserProfile,
  AlbumPage,
  UserStickerEntry,
  DailyPack,
} from "@/types/types";

interface Props {
  admin: {
    missions: AdminMission[];
    shop: AdminShopItem[];
    audios: AdminAudio[];
  };
  user: UserProfile | null;
  userMissions: Mission[];
  redeemedAudios: RadioMessage[];
  redeemedItems: number[];
  shop: ShopItem[];
  unlockedAudios: RadioMessage[];
  albumPages: AlbumPage[];
  userStickers: UserStickerEntry[];
  dailyPacks: DailyPack[];
}

export const ClientInitializer = ({
  admin,
  user,
  userMissions,
  redeemedAudios,
  redeemedItems,
  shop,
  unlockedAudios,
  albumPages,
  userStickers,
  dailyPacks,
}: Props) => {
  const { setMissions, setShop, setAudios } = useAdminStore();
  const { setMissions: setUserMissions } = useMissionsStore();
  const { setAudios: setRadioAudios } = useRadioStore();
  const { setRedeemedAudios } = useRedeemedAudiosStore();
  const { setRedeemedItems } = useRedeemedStore();
  const { setItems } = useShopStore();
  const { setUser } = useUserStore();
  const { setPages } = useAlbumStore();
  const { setUserStickers, setDailyPacks } = useStickerStore();

  useEffect(() => {
    setMissions(admin.missions);
    setShop(admin.shop);
    setAudios(admin.audios);

    setUserMissions(userMissions);
    setRadioAudios(unlockedAudios);
    setRedeemedAudios(redeemedAudios);
    setRedeemedItems(redeemedItems);
    setItems(shop);
    setPages(albumPages);
    setUserStickers(userStickers);
    setDailyPacks(dailyPacks);

    if (user) {
      setUser(user);
    }
  }, [
    admin,
    user,
    userMissions,
    unlockedAudios,
    redeemedAudios,
    redeemedItems,
    shop,
    albumPages,
    userStickers,
    dailyPacks,
    setMissions,
    setShop,
    setAudios,
    setUserMissions,
    setRadioAudios,
    setRedeemedAudios,
    setRedeemedItems,
    setItems,
    setUser,
    setPages,
    setUserStickers,
    setDailyPacks,
  ]);

  return null;
};
