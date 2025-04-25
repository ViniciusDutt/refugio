"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export const addMission = async (
  title: string,
  description: string,
  reward: number
) => {
  const supabase = await createClient();

  const { data: mission, error: missionError } = await supabase
    .from("missions")
    .insert({ title, description, reward, is_active: true })
    .select()
    .single();

  if (missionError || !mission) {
    return { success: false, message: "Erro ao criar a missão." };
  }

  const userId = process.env.USER_ID!;

  const { error: userMissionError } = await supabase
    .from("user_missions")
    .insert([
      {
        user_id: userId,
        mission_id: mission.id,
        status: "pendente",
        completed_at: null,
      },
    ]);

  if (userMissionError) {
    return {
      success: false,
      message: "Missão criada, mas erro ao associar ao usuário.",
    };
  }

  revalidatePath("/admin/dashboard");

  return {
    success: true,
    message: "Missão criada com sucesso!",
    mission,
  };
};

export const deleteMission = async (id: number) => {
  const supabase = await createClient();

  const { error } = await supabase.from("missions").delete().eq("id", id);

  if (error) {
    return { success: false, message: "Erro ao excluir a missão." };
  }

  revalidatePath("/admin/dashboard");
  return { success: true, message: "Missão excluída com sucesso." };
};

export const editMission = async (
  id: number,
  updates: {
    title?: string;
    description?: string;
    reward?: number;
  }
) => {
  const supabase = await createClient();

  const { error } = await supabase
    .from("missions")
    .update(updates)
    .eq("id", id);

  if (error) {
    return { success: false, message: "Erro ao editar a missão." };
  }

  revalidatePath("/admin/dashboard");
  return { success: true, message: "Missão atualizada com sucesso." };
};

export const completeMission = async (
  user_id: string,
  mission_id: number,
  reward: number
): Promise<{ success: boolean; message: string }> => {
  const supabase = await createClient();

  const { error: missionError } = await supabase
    .from("user_missions")
    .update({
      status: "concluida",
      completed_at: new Date().toISOString(),
    })
    .eq("user_id", user_id)
    .eq("mission_id", mission_id);

  if (missionError) {
    console.error("Erro ao concluir missão:", missionError.message);
    return { success: false, message: "Erro ao concluir missão." };
  }

  const { data: user, error: fetchError } = await supabase
    .from("user")
    .select("points")
    .eq("id", user_id)
    .single();

  if (fetchError || !user) {
    console.error("Erro ao buscar usuário:", fetchError?.message);
    return { success: false, message: "Erro ao buscar pontos do usuário." };
  }

  const { error: updateError } = await supabase
    .from("user")
    .update({ points: user.points + reward })
    .eq("id", user_id);

  if (updateError) {
    console.error("Erro ao atualizar pontos:", updateError.message);
    return { success: false, message: "Erro ao atualizar pontos do usuário." };
  }

  revalidatePath("/admin/dashboard");
  return { success: true, message: "Missão concluída e pontos atribuídos!" };
};
