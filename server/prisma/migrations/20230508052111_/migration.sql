/*
  Warnings:

  - A unique constraint covering the columns `[ownerId]` on the table `Passwords` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Passwords_ownerId_key" ON "Passwords"("ownerId");
