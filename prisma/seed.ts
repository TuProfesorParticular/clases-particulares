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
  { name: "Historia", category: "Humanidades" },
  { name: "Filosofía", category: "Humanidades" },
  { name: "Geografía", category: "Humanidades" },
  { name: "Lengua y Literatura", category: "Humanidades" },
  { name: "Latín", category: "Humanidades" },
  { name: "Griego", category: "Humanidades" },
  { name: "Valenciano", category: "Humanidades" },
  { name: "Inglés", category: "Humanidades" },
  { name: "Francés", category: "Humanidades" },
  { name: "Alemán", category: "Humanidades" },
  { name: "Español", category: "Humanidades" },
  { name: "Economía", category: "Humanidades" },
  { name: "Música", category: "Humanidades" },

  // Oposiciones (las más comunes y demandadas)
  { name: "Oposición Secundaria", category: "Oposiciones" },
  { name: "Oposición Primaria", category: "Oposiciones" },
  { name: "Oposición Auxiliar Administrativo", category: "Oposiciones" },
  { name: "Oposición Policía Nacional / Guardia Civil", category: "Oposiciones" },
  { name: "Oposición Correos", category: "Oposiciones" },
  { name: "Oposición Enfermería", category: "Oposiciones" },
  { name: "Oposición Justicia", category: "Oposiciones" },

  // Cursos oficiales (certificaciones de idiomas)
  { name: "Inglés (Cambridge / EOI)", category: "Cursos oficiales" },
  { name: "Valenciano (JQCV)", category: "Cursos oficiales" },
  { name: "Francés (DELF / DALF)", category: "Cursos oficiales" },
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
