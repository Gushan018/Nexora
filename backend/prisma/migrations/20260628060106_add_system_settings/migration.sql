-- CreateEnum
CREATE TYPE "DisputeStatus" AS ENUM ('OPEN', 'INVESTIGATING', 'RESOLVED', 'REJECTED');

-- CreateTable
CREATE TABLE "system_setting" (
    "id" SERIAL NOT NULL,
    "platformName" TEXT NOT NULL DEFAULT 'Nexora Marketplace',
    "supportEmail" TEXT NOT NULL DEFAULT 'support@nexora.com',
    "logoUrl" TEXT,
    "defaultTimezone" TEXT NOT NULL DEFAULT 'UTC',
    "defaultCurrency" TEXT NOT NULL DEFAULT 'LKR',
    "maintenanceMode" BOOLEAN NOT NULL DEFAULT false,
    "smtpHost" TEXT,
    "smtpPort" INTEGER,
    "smtpUser" TEXT,
    "smtpPassword" TEXT,
    "smtpFromEmail" TEXT,
    "smtpSecure" BOOLEAN NOT NULL DEFAULT false,
    "authLockoutEnabled" BOOLEAN NOT NULL DEFAULT false,
    "authFailedAttemptsLimit" INTEGER NOT NULL DEFAULT 5,
    "authPasswordMinLength" INTEGER NOT NULL DEFAULT 8,
    "authTwoFactorEnabled" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "system_setting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dispute" (
    "dispute_id" SERIAL NOT NULL,
    "booking_id" INTEGER,
    "customer_id" INTEGER,
    "vendor_id" INTEGER,
    "raised_by" TEXT NOT NULL,
    "reporter" TEXT,
    "subject" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" "DisputeStatus" NOT NULL DEFAULT 'OPEN',
    "admin_notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dispute_pkey" PRIMARY KEY ("dispute_id")
);

-- AddForeignKey
ALTER TABLE "dispute" ADD CONSTRAINT "dispute_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "booking"("booking_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dispute" ADD CONSTRAINT "dispute_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customer"("customer_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dispute" ADD CONSTRAINT "dispute_vendor_id_fkey" FOREIGN KEY ("vendor_id") REFERENCES "vendor"("vendor_id") ON DELETE SET NULL ON UPDATE CASCADE;
