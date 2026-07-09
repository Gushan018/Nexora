-- CreateTable
CREATE TABLE "broadcast" (
    "broadcast_id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'info',
    "target_role" TEXT NOT NULL,
    "recipient_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "broadcast_pkey" PRIMARY KEY ("broadcast_id")
);
