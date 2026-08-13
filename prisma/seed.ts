import "dotenv/config";
import { prisma } from "../src/lib/prisma";

const subjects: { name: string; category: string }[] = [
  { name: "Matemáticas", category: "Ciencias" },
  { name: "Física", category: "Ciencias" },
  { name: "Química", category: "Ciencias" },
  { name: "Biología", category: "Ciencias" },
  { name: "Inglés", category: "Idiomas" },
  { name: "Francés", category: "Idiomas" },
  { name: "Alemán", category: "Idiomas" },
  { name: "Español", category: "Idiomas" },
  { name: "Lengua y Literatura", category: "Letras" },
  { name: "Historia", category: "Letras" },
  { name: "Filosofía", category: "Letras" },
  { name: "Economía", category: "Sociales" },
  { name: "Informática", category: "Tecnología" },
  { name: "Música", category: "Artes" },
];

async function main() {
  for (const subject of subjects) {
    await prisma.subject.upsert({
      where: { name: subject.name },
      update: {},
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
