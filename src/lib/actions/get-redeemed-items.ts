"use server";

import { createClient } from "@/lib/supabase/server";

export const getRedeemedItems = async (): Promise<number[]> => {
  const supabase = await createClient();

  const { data: unlockedAudios } = await supabase
    .from("unlocked_radio_messages")
    .select("shop_item_id")
    .eq("user_id", process.env.USER_ID)
    .not("shop_item_id", "is", null);

  const { data: redeemedDirectly } = await supabase
    .from("redeemed_items")
    .select("shop_id")
    .eq("user_id", process.env.USER_ID);

  const audioIds = unlockedAudios?.map((i) => i.shop_item_id) ?? [];
  const directIds = redeemedDirectly?.map((i) => i.shop_id) ?? [];

  const allIds = [...new Set([...audioIds, ...directIds])];

  return allIds;
};
