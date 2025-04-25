"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export const redeemShopItem = async (itemId: number) => {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, message: "Usuário não autenticado." };
  }

  const { data: profile, error: profileError } = await supabase
    .from("user")
    .select("points")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    return { success: false, message: "Erro ao buscar pontos do perfil." };
  }

  const { data: item, error: itemError } = await supabase
    .from("shop")
    .select("*")
    .eq("id", itemId)
    .single();

  if (itemError || !item) {
    return { success: false, message: "Item da loja não encontrado." };
  }

  if (item.category === "audios") {
    const { data: alreadyUnlocked } = await supabase
      .from("unlocked_radio_messages")
      .select("id")
      .eq("user_id", user.id)
      .eq("audio_id", item.ref_id)
      .maybeSingle();

    if (alreadyUnlocked) {
      return { success: false, message: "Áudio já resgatado." };
    }
  } else {
    const { data: alreadyRedeemed } = await supabase
      .from("redeemed_items")
      .select("id")
      .eq("user_id", user.id)
      .eq("shop_id", item.id)
      .maybeSingle();

    if (alreadyRedeemed) {
      return { success: false, message: "Item já resgatado." };
    }
  }

  if (profile.points < item.cost) {
    return { success: false, message: "Pontos insuficientes." };
  }

  const { error: updateError } = await supabase
    .from("user")
    .update({ points: profile.points - item.cost })
    .eq("id", user.id);

  if (updateError) {
    return { success: false, message: "Erro ao debitar pontos." };
  }

  if (item.category === "audios") {
    const { error: unlockError } = await supabase
      .from("unlocked_radio_messages")
      .insert({
        user_id: user.id,
        audio_id: item.ref_id,
        shop_item_id: item.id,
      });

    if (unlockError) {
      return { success: false, message: "Erro ao desbloquear o áudio." };
    }
  } else {
    const { error: redeemError } = await supabase
      .from("redeemed_items")
      .insert({
        user_id: user.id,
        shop_id: item.id,
      });

    if (redeemError) {
      return { success: false, message: "Erro ao registrar item resgatado." };
    }
  }

  revalidatePath("/");
  return {
    success: true,
    message: "Item resgatado com sucesso!",
    redeemedId: item.id,
  };
};
