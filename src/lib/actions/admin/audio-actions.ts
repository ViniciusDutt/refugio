"use server";

import { createClient } from "@/lib/supabase/server";
import { AddAudioResult } from "@/types/types";
import { revalidatePath } from "next/cache";

export const editAudio = async (
  id: number,
  updates: { title?: string; file_path?: string }
) => {
  const supabase = await createClient();

  const { error } = await supabase
    .from("radio_messages")
    .update(updates)
    .eq("id", id);

  if (error) {
    console.error("Erro ao editar áudio:", error.message);
    return { success: false, message: "Erro ao editar áudio." };
  }

  revalidatePath("/admin/dashboard");
  return { success: true, message: "Áudio atualizado com sucesso." };
};

export const deleteAudio = async (id: number, file_path: string) => {
  const supabase = await createClient();

  const { error: dbError } = await supabase
    .from("radio_messages")
    .delete()
    .eq("id", id);

  const { error: storageError } = await supabase.storage
    .from("audios")
    .remove([file_path]);

  if (dbError || storageError) {
    console.error(
      "Erro ao excluir áudio:",
      dbError?.message || storageError?.message
    );
    return { success: false, message: "Erro ao excluir áudio." };
  }

  revalidatePath("/admin/dashboard");
  return { success: true, message: "Áudio excluído com sucesso." };
};

export const toggleAudioStatus = async (id: number, available: boolean) => {
  const supabase = await createClient();

  const { error } = await supabase
    .from("radio_messages")
    .update({ available })
    .eq("id", id);

  if (error) {
    console.error("Erro ao atualizar status do áudio:", error.message);
    return {
      success: false,
      message: "Erro ao atualizar disponibilidade do áudio.",
    };
  }

  revalidatePath("/admin/dashboard");
  return {
    success: true,
    message: `Áudio ${available ? "ativado" : "desativado"} com sucesso.`,
  };
};

export const addAudio = async (formData: FormData): Promise<AddAudioResult> => {
  const supabase = await createClient();

  const title = formData.get("title") as string;
  const cost = Number(formData.get("cost"));
  const file = formData.get("file") as File;
  const category = formData.get("category") as string;

  if (!file || !title || isNaN(cost)) {
    return { success: false, message: "Dados incompletos." };
  }

  const file_path = `${Date.now()}_${file.name}`;

  const { error: uploadError } = await supabase.storage
    .from("audios")
    .upload(file_path, file);

  if (uploadError) {
    return { success: false, message: "Erro ao fazer upload do áudio." };
  }

  const { data: audioData, error: audioError } = await supabase
    .from("radio_messages")
    .insert({ title, file_path, available: true, category })
    .select()
    .single();

  if (audioError || !audioData) {
    return { success: false, message: "Erro ao salvar o áudio." };
  }

  const { data: shopData, error: shopError } = await supabase
    .from("shop")
    .insert({
      name: title,
      cost,
      category: "audios",
      ref_id: audioData.id,
      available: true,
    })
    .select()
    .single();

  if (shopError || !shopData) {
    return { success: false, message: "Erro ao registrar o áudio na loja." };
  }

  revalidatePath("/admin/dashboard");

  return {
    success: true,
    message: "Áudio adicionado com sucesso!",
    audio: audioData,
    shop: shopData,
  };
};
