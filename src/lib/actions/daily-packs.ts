"use server";

import { createClient } from "@/lib/supabase/server";
import { DailyPack } from "@/types/types";

export const getAvailableDailyPacks = async (): Promise<DailyPack[]> => {
  const supabase = await createClient();

  const { data: userPacks, error: packsError } = await supabase
    .from("user_packs")
    .select("id, sticker_ids")
    .eq("user_id", process.env.USER_ID)
    .eq("claimed", false);

  if (packsError) {
    console.error("Error fetching available packs:", packsError);
    return [];
  }

  const allStickerIds = userPacks.flatMap((p) => p.sticker_ids);
  const uniqueStickerIds = Array.from(new Set(allStickerIds));

  const { data: stickersData, error: stickersError } = await supabase
    .from("stickers")
    .select("*")
    .in("id", uniqueStickerIds);

  if (stickersError) {
    console.error("Error fetching sticker data:", stickersError);
    return [];
  }

  const packs: DailyPack[] = userPacks.map((pack) => {
    const fullStickers = stickersData.filter((s) =>
      pack.sticker_ids.includes(s.id)
    );
    return {
      id: pack.id,
      stickers: fullStickers,
    };
  });

  return packs;
};

export const markDailyPackAsClaimed = async (packId: number) => {
  const supabase = await createClient();

  const { error } = await supabase
    .from("user_packs")
    .update({ claimed: true })
    .eq("id", packId);

  if (error) {
    console.error("Erro ao marcar pack como aberto:", error);
    return false;
  }

  return true;
};

export const generateDailyPackIfNeeded = async (): Promise<void> => {
  const supabase = await createClient();

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  const { data: existingPacks, error: checkError } = await supabase
    .from("user_packs")
    .select("created_at")
    .eq("user_id", process.env.USER_ID)
    .gte("created_at", startOfDay.toISOString())
    .lte("created_at", endOfDay.toISOString());

  if (checkError) {
    console.error("Erro ao verificar packs do dia:", checkError);
    return;
  }

  if (existingPacks.length > 0) {
    return;
  }

  const { data: allStickers, error: stickerError } = await supabase
    .from("stickers")
    .select("id");

  if (stickerError || !allStickers || allStickers.length < 3) {
    console.error("Erro ao buscar figurinhas:", stickerError);
    return;
  }

  const shuffled = allStickers.sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, 3).map((s) => s.id);

  const { error: insertError } = await supabase.from("user_packs").insert({
    user_id: process.env.USER_ID,
    sticker_ids: selected,
    claimed: false,
  });

  if (insertError) {
    console.error("Erro ao criar novo pack diário:", insertError);
  }
};
