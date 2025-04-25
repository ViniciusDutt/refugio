"use server";

import { createClient } from "../supabase/server";

export async function addUserStickersToDB(
  stickers: {
    sticker_id: number;
    source: string;
  }[]
) {
  const supabase = await createClient();

  const userId = process.env.USER_ID;
  if (!userId) return { error: "Missing user ID" };

  if (stickers.length === 0) return { success: true };

  const { error } = await supabase
    .from("user_stickers")
    .insert(stickers.map((s) => ({ ...s, user_id: userId })));

  if (error) {
    console.error("Erro ao adicionar figurinhas ao banco:", error);
    return { error: true };
  }

  return { success: true };
}
