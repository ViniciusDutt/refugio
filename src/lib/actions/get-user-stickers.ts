"use server";

import { createClient } from "@/lib/supabase/server";
import { UserStickerEntry } from "@/types/types";

export const getUserStickers = async (): Promise<UserStickerEntry[]> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("user_stickers")
    .select("sticker_id, is_pasted, source")
    .eq("user_id", process.env.USER_ID);

  if (error || !data) {
    console.error("Erro ao buscar user_stickers:", error?.message);
    return [];
  }
  return data as UserStickerEntry[];
};
