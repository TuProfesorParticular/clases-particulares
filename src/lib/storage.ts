import { createClient } from "@supabase/supabase-js";

const AVATARS_BUCKET = "avatars";

const supabaseAdmin =
  process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
    ? createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
    : null;

export async function uploadAvatar(userId: string, file: File): Promise<string> {
  if (!supabaseAdmin) {
    throw new Error(
      "Supabase Storage no está configurado (faltan SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY).",
    );
  }

  const extension = file.name.split(".").pop() || "jpg";
  const path = `${userId}-${Date.now()}.${extension}`;

  const { error } = await supabaseAdmin.storage
    .from(AVATARS_BUCKET)
    .upload(path, file, { contentType: file.type, upsert: true });

  if (error) {
    throw new Error(`Error subiendo la foto: ${error.message}`);
  }

  const { data } = supabaseAdmin.storage.from(AVATARS_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
