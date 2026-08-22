import "dotenv/config";
import { prisma } from "../src/lib/prisma";

const subjects: { name: string; category: string }[] = [
  // Ciencias (Primaria, ESO y Bachillerato — modalidad Ciencias y Tecnología, LOMLOE)
  { name: "Matemáticas", category: "Ciencias" },
  { name: "Física", category: "Ciencias" },
  { name: "Química", category: "Ciencias" },
  { name: "Biología", category: "Ciencias" },
  { name: "Dibujo Técnico", category: "Ciencias" },
  { name: "Informática", category: "Ciencias" },
  { name: "Ciencias Naturales", category: "Ciencias" },
  { name: "Biología y Geología", category: "Ciencias" },
  { name: "Física y Química", category: "Ciencias" },
  { name: "Geología y Ciencias Ambientales", category: "Ciencias" },
  { name: "Cultura Científica", category: "Ciencias" },
  { name: "Tecnología y Digitalización", category: "Ciencias" },
  { name: "Tecnología e Ingeniería", category: "Ciencias" },
  { name: "Digitalización", category: "Ciencias" },
  { name: "Tecnologías de la Información y la Comunicación", category: "Ciencias" },

  // Humanidades (incluye idiomas, artes y las materias comunes de formación)
  { name: "Filosofía", category: "Humanidades" },
  { name: "Historia de la Filosofía", category: "Humanidades" },
  { name: "Lengua y Literatura", category: "Humanidades" },
  { name: "Literatura Universal", category: "Humanidades" },
  { name: "Latín", category: "Humanidades" },
  { name: "Griego", category: "Humanidades" },
  { name: "Cultura Clásica", category: "Humanidades" },
  { name: "Valenciano", category: "Humanidades" },
  { name: "Inglés", category: "Humanidades" },
  { name: "Francés", category: "Humanidades" },
  { name: "Alemán", category: "Humanidades" },
  { name: "Español", category: "Humanidades" },
  { name: "Música", category: "Humanidades" },
  { name: "Educación Física", category: "Humanidades" },
  { name: "Religión", category: "Humanidades" },
  { name: "Valores Cívicos y Éticos", category: "Humanidades" },
  { name: "Educación Plástica, Visual y Audiovisual", category: "Humanidades" },
  { name: "Historia del Arte", category: "Humanidades" },
  { name: "Dibujo Artístico", category: "Humanidades" },
  { name: "Cultura Audiovisual", category: "Humanidades" },
  { name: "Fundamentos Artísticos", category: "Humanidades" },
  { name: "Análisis Musical", category: "Humanidades" },
  { name: "Artes Escénicas", category: "Humanidades" },

  // Ciencias Sociales (Primaria, ESO y Bachillerato — modalidad Humanidades y CCSS)
  { name: "Historia", category: "Ciencias Sociales" },
  { name: "Geografía", category: "Ciencias Sociales" },
  { name: "Ciencias Sociales (Primaria)", category: "Ciencias Sociales" },
  { name: "Geografía e Historia", category: "Ciencias Sociales" },
  { name: "Historia de España", category: "Ciencias Sociales" },
  { name: "Historia del Mundo Contemporáneo", category: "Ciencias Sociales" },
  { name: "Economía", category: "Ciencias Sociales" },
  { name: "Economía de la Empresa", category: "Ciencias Sociales" },
  { name: "Matemáticas Aplicadas a las Ciencias Sociales", category: "Ciencias Sociales" },
  { name: "Fundamentos de Administración y Gestión", category: "Ciencias Sociales" },
  { name: "Iniciación a la Actividad Emprendedora y Empresarial", category: "Ciencias Sociales" },

  // Oposiciones (las más comunes y demandadas)
  { name: "Oposición Secundaria", category: "Oposiciones" },
  { name: "Oposición Primaria", category: "Oposiciones" },
  { name: "Oposición Auxiliar Administrativo", category: "Oposiciones" },
  { name: "Oposición Policía Nacional / Guardia Civil", category: "Oposiciones" },
  { name: "Oposición Correos", category: "Oposiciones" },
  { name: "Oposición Enfermería", category: "Oposiciones" },
  { name: "Oposición Justicia", category: "Oposiciones" },

  // Cursos oficiales (certificaciones de idiomas — cualquier idioma, no solo los tres iniciales)
  { name: "Inglés (Cambridge / EOI)", category: "Cursos oficiales" },
  { name: "Valenciano (JQCV)", category: "Cursos oficiales" },
  { name: "Francés (DELF / DALF)", category: "Cursos oficiales" },
  { name: "Alemán (Goethe-Institut / EOI)", category: "Cursos oficiales" },
  { name: "Italiano (CELI / EOI)", category: "Cursos oficiales" },
  { name: "Portugués (CAPLE / EOI)", category: "Cursos oficiales" },
  { name: "Chino (HSK)", category: "Cursos oficiales" },
  { name: "Japonés (JLPT)", category: "Cursos oficiales" },
  { name: "Árabe (EOI)", category: "Cursos oficiales" },
  { name: "Ruso (TORFL / EOI)", category: "Cursos oficiales" },
  { name: "Catalán (JQCV / EOI)", category: "Cursos oficiales" },
  { name: "Euskera (EGA / EOI)", category: "Cursos oficiales" },
  { name: "Gallego (CELGA)", category: "Cursos oficiales" },
];

async function main() {
  for (const subject of subjects) {
    await prisma.subject.upsert({
      where: { name: subject.name },
      update: { category: subject.category },
      create: subject,
    });
  }
  console.log(`Seed completado: ${subjects.length} materias.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
