"use server";

import { createClient } from "@/lib/supabase/server";

export async function validateLogin(pass: string) {
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: "refugio@vinieju.com",
    password: pass,
  });

  if (error) return { success: false };

  return { success: true };
}
