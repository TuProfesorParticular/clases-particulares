import { createClient } from "@supabase/supabase-js";

const AVATARS_BUCKET = "avatars";
const MATERIALS_BUCKET = "materials";

const supabaseAdmin =
  process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
    ? createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
    : null;

function requireSupabase() {
  if (!supabaseAdmin) {
    throw new Error(
      "Supabase Storage no está configurado (faltan SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY).",
    );
  }
  return supabaseAdmin;
}

const COMBINING_DIACRITICS = /[̀-ͯ]/g;

function safePathSegment(name: string) {
  return name
    .normalize("NFD")
    .replace(COMBINING_DIACRITICS, "")
    .replace(/[^a-zA-Z0-9.-]+/g, "-");
}

export async function uploadAvatar(userId: string, file: File): Promise<string> {
  const supabase = requireSupabase();

  const extension = file.name.split(".").pop() || "jpg";
  const path = `${userId}-${Date.now()}.${extension}`;

  const { error } = await supabase.storage
    .from(AVATARS_BUCKET)
    .upload(path, file, { contentType: file.type, upsert: true });

  if (error) {
    throw new Error(`Error subiendo la foto: ${error.message}`);
  }

  const { data } = supabase.storage.from(AVATARS_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export async function uploadMaterialFile(
  teacherProfileId: string,
  file: File,
): Promise<{ fileUrl: string; fileName: string }> {
  const supabase = requireSupabase();

  const path = `${teacherProfileId}/${Date.now()}-${safePathSegment(file.name)}`;

  const { error } = await supabase.storage
    .from(MATERIALS_BUCKET)
    .upload(path, file, { contentType: file.type, upsert: false });

  if (error) {
    throw new Error(`Error subiendo el material: ${error.message}`);
  }

  const { data } = supabase.storage.from(MATERIALS_BUCKET).getPublicUrl(path);
  return { fileUrl: data.publicUrl, fileName: file.name };
}

export async function deleteMaterialFile(fileUrl: string) {
  const supabase = requireSupabase();
  const marker = `/object/public/${MATERIALS_BUCKET}/`;
  const index = fileUrl.indexOf(marker);
  if (index === -1) return;
  const path = decodeURIComponent(fileUrl.slice(index + marker.length));
  await supabase.storage.from(MATERIALS_BUCKET).remove([path]);
}
