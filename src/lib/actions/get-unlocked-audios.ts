"use server";

import { createClient } from "@/lib/supabase/server";

export const getUnlockedAudios = async () => {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return [];
  }

  const { data: unlocked, error: unlockedError } = await supabase
    .from("unlocked_radio_messages")
    .select("audio_id")
    .eq("user_id", user.id);

  if (unlockedError || !unlocked || unlocked.length === 0) {
    return [];
  }

  const ids = unlocked.map((i) => i.audio_id);

  const { data: messages, error: messagesError } = await supabase
    .from("radio_messages")
    .select("*")
    .in("id", ids);

  if (messagesError || !messages || messages.length === 0) {
    return [];
  }

  const audiosWithUrls = await Promise.all(
    messages.map(async (audio) => {
      const cleanPath = audio.file_path.replace(/^\/+/, "");

      const { data } = supabase.storage.from("audios").getPublicUrl(cleanPath);

      return {
        ...audio,
        url: data?.publicUrl ?? "",
      };
    })
  );

  return audiosWithUrls;
};
