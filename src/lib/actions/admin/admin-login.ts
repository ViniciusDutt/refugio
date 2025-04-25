"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const loginAdmin = async (formData: FormData) => {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { data: authData, error: authError } =
    await supabase.auth.signInWithPassword({
      email,
      password,
    });

  if (authError || !authData.user) {
    return { error: "E-mail ou senha inválidos." };
  }

  const { data: profile } = await supabase
    .from("user")
    .select("role")
    .eq("id", authData.user.id)
    .single();

  if (!profile || profile.role !== "admin") {
    return { error: "Acesso negado." };
  }

  redirect("/admin/dashboard");
};

export const logoutAdmin = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
};
