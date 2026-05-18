/*
  Warnings:

  - You are about to drop the column `addressId` on the `order` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."order" DROP CONSTRAINT "order_addressId_fkey";

-- AlterTable
ALTER TABLE "order" DROP COLUMN "addressId";

-- AddForeignKey
ALTER TABLE "order" ADD CONSTRAINT "order_productId_fkey" FOREIGN KEY ("productId") REFERENCES "product"("productId") ON DELETE RESTRICT ON UPDATE CASCADE;
