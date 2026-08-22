-- CreateEnum
CREATE TYPE "MaterialCourse" AS ENUM ('eso_1', 'eso_2', 'eso_3', 'eso_4', 'bachillerato_1', 'bachillerato_2', 'universidad', 'oposiciones');

-- AlterTable
ALTER TABLE "materials" ADD COLUMN "course" "MaterialCourse" NOT NULL DEFAULT 'universidad';
ALTER TABLE "materials" ALTER COLUMN "course" DROP DEFAULT;

-- CreateIndex
CREATE INDEX "materials_course_idx" ON "materials"("course");
