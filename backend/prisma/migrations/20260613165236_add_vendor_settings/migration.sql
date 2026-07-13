-- AlterTable
ALTER TABLE "vendor" ADD COLUMN     "booking_lead_time" TEXT NOT NULL DEFAULT '48h',
ADD COLUMN     "cancellation_policy" TEXT NOT NULL DEFAULT 'Moderate',
ADD COLUMN     "currency" TEXT NOT NULL DEFAULT 'LKR',
ADD COLUMN     "instant_book" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "require_deposits" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "timezone" TEXT NOT NULL DEFAULT 'UTC';
