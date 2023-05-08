-- CreateTable
CREATE TABLE "Passwords" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "Passwords_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Passwords_id_key" ON "Passwords"("id");
