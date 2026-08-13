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
