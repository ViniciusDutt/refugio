"use server";

import { createClient } from "@/lib/supabase/server";

export const getUserMissions = async () => {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return [];
  }

  const { data, error } = await supabase
    .from("user_missions")
    .select(
      `
      *,
      missions:missions (
        id,
        title,
        description,
        reward
      )
    `
    )
    .eq("user_id", user.id)
    .order("id", { ascending: false });

  if (error) {
    console.error("Erro ao buscar missões:", error.message);
    return [];
  }

  return data;
};
