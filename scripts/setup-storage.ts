import "dotenv/config";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

async function ensureBucket(
  supabase: SupabaseClient,
  name: string,
  options: { fileSizeLimit: string; allowedMimeTypes: string[] },
) {
  const { data: buckets, error: listError } = await supabase.storage.listBuckets();
  if (listError) throw listError;

  if (buckets.some((b) => b.name === name)) {
    console.log(`El bucket '${name}' ya existe.`);
    return;
  }

  const { error } = await supabase.storage.createBucket(name, {
    public: true,
    ...options,
  });

  if (error) throw error;
  console.log(`Bucket '${name}' creado (público).`);
}

async function main() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("Faltan SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY");
  }

  const supabase = createClient(url, key);

  await ensureBucket(supabase, "avatars", {
    fileSizeLimit: "5MB",
    allowedMimeTypes: ["image/png", "image/jpeg", "image/webp", "image/gif"],
  });

  await ensureBucket(supabase, "materials", {
    fileSizeLimit: "20MB",
    allowedMimeTypes: [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "image/png",
      "image/jpeg",
    ],
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
