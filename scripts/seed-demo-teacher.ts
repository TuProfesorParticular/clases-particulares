import "dotenv/config";
import bcrypt from "bcryptjs";
import { prisma } from "../src/lib/prisma";

async function main() {
  const subject = await prisma.subject.findFirstOrThrow({
    where: { name: "Matemáticas" },
  });

  const passwordHash = await bcrypt.hash("password123", 10);

  const teacherUser = await prisma.user.upsert({
    where: { email: "ana.demo@example.com" },
    update: {},
    create: {
      email: "ana.demo@example.com",
      name: "Ana García",
      role: "teacher",
      passwordHash,
      teacherProfile: {
        create: {
          bio: "Profesora de Matemáticas con 8 años de experiencia preparando la Selectividad.",
          pricePerHour: 18,
          modality: "both",
          city: "Madrid",
          experienceText: "Licenciada en Matemáticas (UCM). Clases particulares desde 2016.",
          status: "approved",
          subjects: {
            create: [
              { subjectId: subject.id, level: "eso" },
              { subjectId: subject.id, level: "bachillerato" },
            ],
          },
        },
      },
    },
  });

  console.log("Profesor demo creado:", teacherUser.email);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
