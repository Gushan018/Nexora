-- AlterTable
ALTER TABLE "event_package" ADD COLUMN     "category" TEXT,
ADD COLUMN     "duration" TEXT,
ADD COLUMN     "max_guests" INTEGER;

-- AlterTable
ALTER TABLE "vendor" ADD COLUMN     "address" TEXT,
ADD COLUMN     "banner_image" TEXT,
ADD COLUMN     "established_year" INTEGER,
ADD COLUMN     "logo_image" TEXT,
ADD COLUMN     "registration_number" TEXT,
ADD COLUMN     "social_facebook" TEXT,
ADD COLUMN     "social_instagram" TEXT,
ADD COLUMN     "social_twitter" TEXT,
ADD COLUMN     "website" TEXT;

-- CreateTable
CREATE TABLE "package_service" (
    "service_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "package_id" INTEGER NOT NULL,

    CONSTRAINT "package_service_pkey" PRIMARY KEY ("service_id")
);

-- CreateTable
CREATE TABLE "package_image" (
    "image_id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "package_id" INTEGER NOT NULL,

    CONSTRAINT "package_image_pkey" PRIMARY KEY ("image_id")
);

-- AddForeignKey
ALTER TABLE "package_service" ADD CONSTRAINT "package_service_package_id_fkey" FOREIGN KEY ("package_id") REFERENCES "event_package"("package_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "package_image" ADD CONSTRAINT "package_image_package_id_fkey" FOREIGN KEY ("package_id") REFERENCES "event_package"("package_id") ON DELETE CASCADE ON UPDATE CASCADE;
