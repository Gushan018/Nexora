-- AlterTable
ALTER TABLE "review" ADD COLUMN     "is_reported" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "report_reason" TEXT,
ADD COLUMN     "vendor_reply" TEXT,
ADD COLUMN     "vendor_reply_date" TIMESTAMP(3);
