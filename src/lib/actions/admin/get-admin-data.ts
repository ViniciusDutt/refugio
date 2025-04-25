"use server";

import { createClient } from "@/lib/supabase/server";
import { AdminShopItem } from "@/types/types";

export const getAdminData = async () => {
  const supabase = await createClient();

  const { data: missions, error: missionsError } = await supabase
    .from("user_missions")
    .select("*, missions(*)");

  const { data: shopItems, error: shopError } = await supabase
    .from("shop")
    .select("*")
    .order("id", { ascending: false });

  const { data: audioMessages, error: audioError } = await supabase
    .from("radio_messages")
    .select("*")
    .order("id", { ascending: false });

  return {
    missions: missions || [],
    shop: shopItems || [],
    audios: audioMessages || [],
    errors: {
      missions: missionsError?.message || null,
      shop: shopError?.message || null,
      audios: audioError?.message || null,
    },
  };
};

export const getRedeemedAdminItems = async (): Promise<AdminShopItem[]> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("redeemed_items")
    .select("shop:id, shop(name, description, cost, category, image_url)")
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  const formatted: AdminShopItem[] = data.map((entry) => ({
    id: entry.shop.id,
    name: entry.shop.name,
    description: entry.shop.description,
    cost: entry.shop.cost,
    category: entry.shop.category,
    image_url: entry.shop.image_url,
    available: entry.shop.available,
  }));

  return formatted;
};
