"use server";

import { createClient } from "@/lib/supabase/server";

export const updateStickerPasted = async (
  stickerId: string
): Promise<boolean> => {
  const supabase = await createClient();

  const { error } = await supabase
    .from("user_stickers")
    .update({ is_pasted: true })
    .eq("user_id", process.env.USER_ID)
    .eq("sticker_id", stickerId);

  if (error) {
    console.error("Erro ao colar figurinha:", error.message);
    return false;
  }

  return true;
};
