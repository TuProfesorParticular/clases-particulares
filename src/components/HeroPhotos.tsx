import { getHeroPhotos } from "@/lib/pexels";
import HeroPhotoCarousel from "@/components/HeroPhotoCarousel";

export default async function HeroPhotos() {
  const photos = await getHeroPhotos();

  if (photos.length === 0) return null;

  return <HeroPhotoCarousel photos={photos} />;
}
