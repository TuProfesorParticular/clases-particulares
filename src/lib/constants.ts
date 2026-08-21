import type { Level, Modality } from "@prisma/client";

export const MODALITY_LABELS: Record<Modality, string> = {
  in_person: "Presencial a domicilio",
  online: "Online",
  both: "Presencial y online",
};

export const LEVEL_LABELS: Record<Level, string> = {
  primaria: "Primaria",
  eso: "ESO",
  bachillerato: "Bachillerato",
  universidad: "Universidad",
  adultos: "Adultos",
};

export const LEVEL_ORDER: Level[] = [
  "primaria",
  "eso",
  "bachillerato",
  "universidad",
  "adultos",
];

// Secciones de nivel superior que estructuran la web. El slug se usa en la URL
// (?categoria=) y debe coincidir exactamente con Subject.category en la base de datos.
export type CategorySection = {
  slug: string;
  label: string;
  description: string;
  colors: {
    bg: string;
    border: string;
    text: string;
    ring: string;
  };
};

export const CATEGORIES: CategorySection[] = [
  {
    slug: "Ciencias",
    label: "Ciencias",
    description: "Matemáticas, física, química, biología, dibujo técnico...",
    colors: {
      bg: "bg-sky-50",
      border: "border-sky-200",
      text: "text-sky-700",
      ring: "hover:border-sky-400",
    },
  },
  {
    slug: "Humanidades",
    label: "Humanidades",
    description: "Historia, filosofía, geografía, lengua, latín, griego, idiomas...",
    colors: {
      bg: "bg-violet-50",
      border: "border-violet-200",
      text: "text-violet-700",
      ring: "hover:border-violet-400",
    },
  },
  {
    slug: "Oposiciones",
    label: "Oposiciones",
    description: "Preparación de las oposiciones más demandadas.",
    colors: {
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      text: "text-emerald-700",
      ring: "hover:border-emerald-400",
    },
  },
  {
    slug: "Cursos oficiales",
    label: "Cursos oficiales",
    description: "Preparación de certificaciones oficiales de inglés, valenciano y francés.",
    colors: {
      bg: "bg-amber-50",
      border: "border-amber-200",
      text: "text-amber-700",
      ring: "hover:border-amber-400",
    },
  },
];

export const MATERIALS_CATEGORY: CategorySection = {
  slug: "Materiales",
  label: "Materiales",
  description: "Apuntes, ejercicios y recursos que comparten los profesores.",
  colors: {
    bg: "bg-rose-50",
    border: "border-rose-200",
    text: "text-rose-700",
    ring: "hover:border-rose-400",
  },
};
