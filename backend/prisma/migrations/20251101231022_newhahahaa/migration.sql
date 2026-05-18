/*
  Warnings:

  - You are about to drop the column `userUserId` on the `order` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."order" DROP CONSTRAINT "order_userUserId_fkey";

-- AlterTable
ALTER TABLE "farmer" ADD COLUMN     "latitude" TEXT,
ADD COLUMN     "longitude" TEXT;

-- AlterTable
ALTER TABLE "order" DROP COLUMN "userUserId";

-- AddForeignKey
ALTER TABLE "order" ADD CONSTRAINT "order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
