"use server";

import { createClient } from "@/lib/supabase/server";

export const getStickersByIds = async (ids: number[]) => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("stickers")
    .select("id, place_id, name, image_url, rarity")
    .in("id", ids);

  if (error) {
    console.error("❌ Supabase error fetching stickers:", error);
    throw new Error(error.message || "Erro desconhecido ao buscar figurinhas");
  }

  if (!data) {
    throw new Error("Nenhum dado retornado da tabela stickers.");
  }

  return data;
};
