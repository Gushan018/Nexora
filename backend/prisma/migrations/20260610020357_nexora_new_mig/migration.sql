-- AlterTable
ALTER TABLE "customer" ADD COLUMN     "profile_image" TEXT;

-- AlterTable
ALTER TABLE "payment" ADD COLUMN     "receipt_url" TEXT;

-- AlterTable
ALTER TABLE "vendor" ADD COLUMN     "profile_image" TEXT;

-- CreateTable
CREATE TABLE "wishlist" (
    "wishlist_id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "customer_id" INTEGER NOT NULL,
    "product_id" INTEGER,
    "service_id" INTEGER,
    "package_id" INTEGER,

    CONSTRAINT "wishlist_pkey" PRIMARY KEY ("wishlist_id")
);

-- CreateTable
CREATE TABLE "conversation" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "customer_id" INTEGER NOT NULL,
    "vendor_id" INTEGER NOT NULL,

    CONSTRAINT "conversation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "message" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "sender_type" TEXT NOT NULL,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "conversation_id" INTEGER NOT NULL,

    CONSTRAINT "message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "budget" (
    "id" SERIAL NOT NULL,
    "customer_id" INTEGER NOT NULL,
    "total_budget" DECIMAL(10,2) NOT NULL DEFAULT 0,

    CONSTRAINT "budget_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "budget_category" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "allocated" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "spent" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "color" TEXT,
    "budget_id" INTEGER NOT NULL,

    CONSTRAINT "budget_category_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "wishlist_customer_id_product_id_key" ON "wishlist"("customer_id", "product_id");

-- CreateIndex
CREATE UNIQUE INDEX "wishlist_customer_id_service_id_key" ON "wishlist"("customer_id", "service_id");

-- CreateIndex
CREATE UNIQUE INDEX "wishlist_customer_id_package_id_key" ON "wishlist"("customer_id", "package_id");

-- CreateIndex
CREATE UNIQUE INDEX "conversation_customer_id_vendor_id_key" ON "conversation"("customer_id", "vendor_id");

-- CreateIndex
CREATE UNIQUE INDEX "budget_customer_id_key" ON "budget"("customer_id");

-- AddForeignKey
ALTER TABLE "wishlist" ADD CONSTRAINT "wishlist_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customer"("customer_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wishlist" ADD CONSTRAINT "wishlist_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("product_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wishlist" ADD CONSTRAINT "wishlist_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "service"("service_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wishlist" ADD CONSTRAINT "wishlist_package_id_fkey" FOREIGN KEY ("package_id") REFERENCES "event_package"("package_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversation" ADD CONSTRAINT "conversation_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customer"("customer_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversation" ADD CONSTRAINT "conversation_vendor_id_fkey" FOREIGN KEY ("vendor_id") REFERENCES "vendor"("vendor_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message" ADD CONSTRAINT "message_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "budget" ADD CONSTRAINT "budget_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customer"("customer_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "budget_category" ADD CONSTRAINT "budget_category_budget_id_fkey" FOREIGN KEY ("budget_id") REFERENCES "budget"("id") ON DELETE CASCADE ON UPDATE CASCADE;
