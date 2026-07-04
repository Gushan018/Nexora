/*
  Warnings:

  - You are about to drop the column `customer_id_fk` on the `notification` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `notification` table. All the data in the column will be lost.
  - You are about to drop the column `user_type` on the `notification` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "notification" DROP CONSTRAINT "notification_customer_id_fk_fkey";

-- AlterTable
ALTER TABLE "notification" DROP COLUMN "customer_id_fk",
DROP COLUMN "user_id",
DROP COLUMN "user_type",
ADD COLUMN     "customer_id" INTEGER,
ADD COLUMN     "vendor_id" INTEGER;

-- CreateTable
CREATE TABLE "message" (
    "message_id" SERIAL NOT NULL,
    "conversation_id" TEXT NOT NULL,
    "sender_id" INTEGER NOT NULL,
    "sender_type" TEXT NOT NULL,
    "receiver_id" INTEGER NOT NULL,
    "receiver_type" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "message_pkey" PRIMARY KEY ("message_id")
);

-- AddForeignKey
ALTER TABLE "notification" ADD CONSTRAINT "notification_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customer"("customer_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification" ADD CONSTRAINT "notification_vendor_id_fkey" FOREIGN KEY ("vendor_id") REFERENCES "vendor"("vendor_id") ON DELETE SET NULL ON UPDATE CASCADE;
