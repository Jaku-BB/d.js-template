-- CreateTable
CREATE TABLE "cooldown" (
    "id" SERIAL NOT NULL,
    "interaction_key" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cooldown_pkey" PRIMARY KEY ("id")
);
