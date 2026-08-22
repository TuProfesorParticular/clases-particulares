-- CreateEnum
CREATE TYPE "StudentRequestStatus" AS ENUM ('open', 'closed');

-- CreateTable
CREATE TABLE "student_requests" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "level" "Level" NOT NULL,
    "modality" "Modality" NOT NULL,
    "city" TEXT,
    "budgetPerHour" DECIMAL(10,2),
    "status" "StudentRequestStatus" NOT NULL DEFAULT 'open',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "student_requests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "student_requests_status_idx" ON "student_requests"("status");

-- CreateIndex
CREATE INDEX "student_requests_subjectId_idx" ON "student_requests"("subjectId");

-- AddForeignKey
ALTER TABLE "student_requests" ADD CONSTRAINT "student_requests_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_requests" ADD CONSTRAINT "student_requests_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "subjects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
