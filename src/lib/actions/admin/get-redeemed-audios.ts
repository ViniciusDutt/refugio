"use server";

import { createClient } from "@/lib/supabase/server";
import { RadioMessage } from "@/types/types";
import { PostgrestError } from "@supabase/supabase-js";

type UnlockedRadioMessages = {
  radio_messages: RadioMessage;
};

export const getRedeemedAudiosAdmin = async () => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("unlocked_radio_messages")
    .select(
      "radio_messages(id, created_at, title, file_path, category, available)"
    )
    .then(
      (res) =>
        res as {
          data: UnlockedRadioMessages[] | null;
          error: PostgrestError | null;
        }
    );

  if (error) {
    console.error("Erro ao buscar áudios resgatados:", error.message);
    return [];
  }

  if (!data) {
    return [];
  }

  return data.map((item) => ({
    id: item.radio_messages.id,
    created_at: item.radio_messages.created_at,
    title: item.radio_messages.title,
    file_path: item.radio_messages.file_path,
    url: supabase.storage
      .from("audios")
      .getPublicUrl(item.radio_messages.file_path).data.publicUrl,
    category: item.radio_messages.category,
    available: item.radio_messages.available,
  }));
};
