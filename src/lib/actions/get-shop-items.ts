"use server";

import { createClient } from "@/lib/supabase/server";

export const getShopItems = async () => {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return [];
  }

  const { data: unlocked, error: unlockError } = await supabase
    .from("unlocked_radio_messages")
    .select("audio_id")
    .eq("user_id", user.id);

  const unlockedAudioIds =
    unlockError || !unlocked ? [] : unlocked.map((r) => r.audio_id);

  const { data: rawItems, error } = await supabase
    .from("shop")
    .select("*")
    .eq("available", true)
    .order("cost", { ascending: true });

  if (error || !rawItems) {
    console.error("Erro ao buscar itens da loja:", error?.message);
    return [];
  }

  const finalItems = await Promise.all(
    rawItems.map(async (item) => {
      if (item.category === "audio") {
        if (unlockedAudioIds.includes(item.ref_id)) return null;

        const { data: audio } = await supabase
          .from("radio_messages")
          .select("*")
          .eq("id", item.ref_id)
          .single();

        if (!audio) return null;

        return {
          ...item,
          audio,
        };
      }

      return item;
    })
  );

  return finalItems.filter(Boolean);
};
