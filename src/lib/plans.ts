import type { TeacherPlan } from "@prisma/client";

export const PLATFORM_FEE_PERCENT = 20;

export type PlanDetails = {
  id: TeacherPlan;
  name: string;
  price: number; // €/mes, 0 = gratis
  maxSubjects: number | null; // null = ilimitado
  featured: boolean;
  stats: boolean;
  description: string;
  features: string[];
};

export const PLANS: PlanDetails[] = [
  {
    id: "free",
    name: "Gratis",
    price: 0,
    maxSubjects: 1,
    featured: false,
    stats: false,
    description: "Para empezar a darte a conocer.",
    features: [
      "Anuncio público en las búsquedas",
      "1 materia",
      "Mensajería ilimitada con alumnos",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: 9.99,
    maxSubjects: 5,
    featured: true,
    stats: false,
    description: "Para profesores que quieren más visibilidad.",
    features: [
      "Todo lo del plan Gratis",
      "Hasta 5 materias",
      "Aparece destacado en los resultados de búsqueda",
      "Materiales ilimitados",
    ],
  },
  {
    id: "premium",
    name: "Premium",
    price: 19.99,
    maxSubjects: null,
    featured: true,
    stats: true,
    description: "Máxima visibilidad para profesores a tiempo completo.",
    features: [
      "Todo lo del plan Pro",
      "Materias ilimitadas",
      "Prioridad máxima en los resultados de búsqueda",
      "Estadísticas de tu anuncio (visitas y contactos)",
    ],
  },
];

export function getPlan(id: TeacherPlan): PlanDetails {
  return PLANS.find((p) => p.id === id) ?? PLANS[0];
}

// Orden de prioridad en resultados de búsqueda: mayor primero
export const PLAN_PRIORITY: Record<TeacherPlan, number> = {
  premium: 2,
  pro: 1,
  free: 0,
};
