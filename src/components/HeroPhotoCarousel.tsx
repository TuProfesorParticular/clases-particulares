"use client";

import { useEffect, useState } from "react";
import type { HeroPhoto } from "@/lib/pexels";

const INTERVAL_MS = 5000;

export default function HeroPhotoCarousel({ photos }: { photos: HeroPhoto[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (photos.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % photos.length);
    }, INTERVAL_MS);
    return () => clearInterval(timer);
  }, [photos.length]);

  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden">
      {photos.map((photo, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={photo.url}
          src={photo.url}
          alt={photo.alt}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
            i === index ? "opacity-20" : "opacity-0"
          }`}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/70 to-white" />
    </div>
  );
}
