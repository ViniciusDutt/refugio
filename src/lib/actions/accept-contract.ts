"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export const acceptContract = async () => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { success: false };

  const { error } = await supabase
    .from("user")
    .update({ contract_accepted: true })
    .eq("id", user.id);

  if (error) return { success: false };

  revalidatePath("/", "layout");
  return { success: true };
};
