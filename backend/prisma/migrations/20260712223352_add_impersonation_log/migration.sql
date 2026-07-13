-- CreateTable
CREATE TABLE "impersonation_log" (
    "id" SERIAL NOT NULL,
    "admin_id" INTEGER NOT NULL,
    "target_role" TEXT NOT NULL,
    "target_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "impersonation_log_pkey" PRIMARY KEY ("id")
);
