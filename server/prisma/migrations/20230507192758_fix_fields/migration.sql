/*
  Warnings:

  - You are about to drop the column `friend_id` on the `Friends` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `Friends` table. All the data in the column will be lost.
  - The primary key for the `Posts` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `image_url` on the `Posts` table. All the data in the column will be lost.
  - Added the required column `friendId` to the `Friends` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Friends` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ownerId` to the `Posts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Friends" DROP COLUMN "friend_id",
DROP COLUMN "user_id",
ADD COLUMN     "friendId" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Posts" DROP CONSTRAINT "Posts_pkey",
DROP COLUMN "image_url",
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "ownerId" TEXT NOT NULL,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Posts_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "Posts" ADD CONSTRAINT "Posts_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
