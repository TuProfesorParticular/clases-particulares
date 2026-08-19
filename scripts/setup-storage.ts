import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

async function main() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("Faltan SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY");
  }

  const supabase = createClient(url, key);

  const { data: buckets, error: listError } = await supabase.storage.listBuckets();
  if (listError) throw listError;

  if (buckets.some((b) => b.name === "avatars")) {
    console.log("El bucket 'avatars' ya existe.");
    return;
  }

  const { error } = await supabase.storage.createBucket("avatars", {
    public: true,
    fileSizeLimit: "5MB",
    allowedMimeTypes: ["image/png", "image/jpeg", "image/webp", "image/gif"],
  });

  if (error) throw error;
  console.log("Bucket 'avatars' creado (público).");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
