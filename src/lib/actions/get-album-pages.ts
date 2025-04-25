"use server";

import { createClient } from "@/lib/supabase/server";
import { AlbumPage } from "@/types/types";

export const getAlbumPages = async () => {
  const supabase = await createClient();

  const { data: places, error: placeError } = await supabase
    .from("places")
    .select("*")
    .eq("user_id", process.env.USER_ID);

  const { data: stickers, error: stickerError } = await supabase
    .from("stickers")
    .select("*");

  if (placeError || stickerError || !places || !stickers) {
    console.error(
      "Erro ao buscar places ou stickers:",
      placeError || stickerError
    );
    return [];
  }

  const unlockedPlaces = places
    .filter((p) => p.unlocked_at)
    .sort(
      (a, b) =>
        new Date(a.unlocked_at!).getTime() - new Date(b.unlocked_at!).getTime()
    );

  const albumPages: AlbumPage[] = unlockedPlaces.map((place, index) => ({
    placeId: place.id,
    title: place.title,
    pageNumber: index + 1,
    stickers: stickers.filter((s) => s.place_id === place.id),
  }));

  return albumPages;
};
