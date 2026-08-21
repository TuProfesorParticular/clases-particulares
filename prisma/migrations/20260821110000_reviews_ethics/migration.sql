-- CreateEnum
CREATE TYPE "EthicsReportStatus" AS ENUM ('open', 'reviewed', 'closed');

-- CreateTable
CREATE TABLE "reviews" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "teacherProfileId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "reviews_teacherProfileId_idx" ON "reviews"("teacherProfileId");

-- CreateIndex
CREATE UNIQUE INDEX "reviews_studentId_teacherProfileId_key" ON "reviews"("studentId", "teacherProfileId");

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_teacherProfileId_fkey" FOREIGN KEY ("teacherProfileId") REFERENCES "teacher_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE "ethics_reports" (
    "id" TEXT NOT NULL,
    "reporterId" TEXT NOT NULL,
    "teacherProfileId" TEXT,
    "message" TEXT NOT NULL,
    "status" "EthicsReportStatus" NOT NULL DEFAULT 'open',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ethics_reports_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ethics_reports" ADD CONSTRAINT "ethics_reports_reporterId_fkey" FOREIGN KEY ("reporterId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ethics_reports" ADD CONSTRAINT "ethics_reports_teacherProfileId_fkey" FOREIGN KEY ("teacherProfileId") REFERENCES "teacher_profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;
