import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Ajusta esto al host real de tu almacenamiento de imágenes
    // (Supabase Storage o Cloudinary) cuando esté configurado.
    remotePatterns: [
      { protocol: "https", hostname: "**.supabase.co" },
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
  },
};

export default nextConfig;
