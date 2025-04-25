"use server";

import { createClient } from "@/lib/supabase/server";
import { NewShopItem } from "@/types/types";
import { revalidatePath } from "next/cache";

export const addShopItem = async ({
  name,
  cost,
  description = "",
  image_url = "/icons/default-item.png",
  category = "outros",
}: NewShopItem) => {
  if (!name || isNaN(cost) || !image_url || !category) {
    return { success: false, message: "Dados incompletos." };
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("shop")
    .insert({
      name,
      cost,
      description,
      image_url,
      category,
      available: true,
    })
    .select()
    .single();

  if (error || !data) {
    return { success: false, message: "Erro ao adicionar item." };
  }

  revalidatePath("/admin/dashboard");
  return { success: true, message: "Item adicionado com sucesso!", item: data };
};

export const editShopItem = async (
  id: number,
  updates: {
    name?: string;
    cost?: number;
    image_url?: string;
    category?: string;
    description?: string;
  }
) => {
  const supabase = await createClient();

  const { error } = await supabase.from("shop").update(updates).eq("id", id);

  if (error) {
    return { success: false, message: "Erro ao editar o item." };
  }

  revalidatePath("/admin/dashboard");
  return { success: true, message: "Item atualizado com sucesso." };
};

export const toggleShopItemStatus = async (id: number, available: boolean) => {
  const supabase = await createClient();

  const { error } = await supabase
    .from("shop")
    .update({ available })
    .eq("id", id);

  if (error) {
    return {
      success: false,
      message: "Erro ao atualizar disponibilidade do item.",
    };
  }

  revalidatePath("/admin/dashboard");
  return {
    success: true,
    message: `Item ${available ? "ativado" : "desativado"} com sucesso.`,
  };
};

export const deleteShopItem = async (id: number) => {
  const supabase = await createClient();

  const { error } = await supabase.from("shop").delete().eq("id", id);

  if (error) {
    return { success: false, message: "Erro ao excluir o item." };
  }

  revalidatePath("/admin/dashboard");
  return { success: true, message: "Item excluído com sucesso." };
};
