import "dotenv/config";
import { prisma } from "../src/lib/prisma";

const subjects: { name: string; category: string }[] = [
  // Ciencias
  { name: "Matemáticas", category: "Ciencias" },
  { name: "Física", category: "Ciencias" },
  { name: "Química", category: "Ciencias" },
  { name: "Biología", category: "Ciencias" },
  { name: "Dibujo Técnico", category: "Ciencias" },
  { name: "Informática", category: "Ciencias" },

  // Humanidades
  { name: "Filosofía", category: "Humanidades" },
  { name: "Lengua y Literatura", category: "Humanidades" },
  { name: "Latín", category: "Humanidades" },
  { name: "Griego", category: "Humanidades" },
  { name: "Valenciano", category: "Humanidades" },
  { name: "Inglés", category: "Humanidades" },
  { name: "Francés", category: "Humanidades" },
  { name: "Alemán", category: "Humanidades" },
  { name: "Español", category: "Humanidades" },
  { name: "Música", category: "Humanidades" },

  // Ciencias Sociales (itinerario de Bachillerato / "Ciencias Sociales" de la ESO)
  { name: "Historia", category: "Ciencias Sociales" },
  { name: "Geografía", category: "Ciencias Sociales" },
  { name: "Historia del Mundo Contemporáneo", category: "Ciencias Sociales" },
  { name: "Economía", category: "Ciencias Sociales" },
  { name: "Economía de la Empresa", category: "Ciencias Sociales" },
  { name: "Matemáticas Aplicadas a las Ciencias Sociales", category: "Ciencias Sociales" },

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
