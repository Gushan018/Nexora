-- AlterTable
ALTER TABLE "event_package" ADD COLUMN     "category_id" INTEGER;

-- AddForeignKey
ALTER TABLE "event_package" ADD CONSTRAINT "event_package_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "service_category"("category_id") ON DELETE SET NULL ON UPDATE CASCADE;
