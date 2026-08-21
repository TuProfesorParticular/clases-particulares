-- CreateEnum
CREATE TYPE "TeacherPlan" AS ENUM ('free', 'pro', 'premium');

-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('pending', 'paid', 'canceled', 'refunded');

-- AlterTable
ALTER TABLE "teacher_profiles"
  ADD COLUMN "plan" "TeacherPlan" NOT NULL DEFAULT 'free',
  ADD COLUMN "stripeCustomerId" TEXT,
  ADD COLUMN "stripeSubscriptionId" TEXT,
  ADD COLUMN "subscriptionStatus" TEXT,
  ADD COLUMN "stripeConnectAccountId" TEXT,
  ADD COLUMN "stripeConnectOnboarded" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "teacher_profiles_stripeCustomerId_key" ON "teacher_profiles"("stripeCustomerId");

-- CreateIndex
CREATE UNIQUE INDEX "teacher_profiles_stripeSubscriptionId_key" ON "teacher_profiles"("stripeSubscriptionId");

-- CreateIndex
CREATE UNIQUE INDEX "teacher_profiles_stripeConnectAccountId_key" ON "teacher_profiles"("stripeConnectAccountId");

-- CreateTable
CREATE TABLE "bookings" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "teacherProfileId" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "platformFeeAmount" DECIMAL(10,2) NOT NULL,
    "status" "BookingStatus" NOT NULL DEFAULT 'pending',
    "stripeCheckoutSessionId" TEXT,
    "stripePaymentIntentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bookings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "bookings_stripeCheckoutSessionId_key" ON "bookings"("stripeCheckoutSessionId");

-- CreateIndex
CREATE UNIQUE INDEX "bookings_stripePaymentIntentId_key" ON "bookings"("stripePaymentIntentId");

-- CreateIndex
CREATE UNIQUE INDEX "bookings_studentId_teacherProfileId_key" ON "bookings"("studentId", "teacherProfileId");

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_teacherProfileId_fkey" FOREIGN KEY ("teacherProfileId") REFERENCES "teacher_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
