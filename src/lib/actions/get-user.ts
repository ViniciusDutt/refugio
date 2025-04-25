"use server";

import { createClient } from "@/lib/supabase/server";

export const getUser = async () => {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return null;
  }

  const { data: profile, error } = await supabase
    .from("user")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error || !profile) {
    console.error("Erro ao buscar perfil:", error?.message);
    return null;
  }

  return profile;
};
