/*
  Warnings:

  - Added the required column `address` to the `order` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."order" DROP CONSTRAINT "order_addressId_fkey";

-- AlterTable
ALTER TABLE "order" ADD COLUMN     "address" TEXT NOT NULL,
ALTER COLUMN "addressId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "order" ADD CONSTRAINT "order_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "address"("addressId") ON DELETE SET NULL ON UPDATE CASCADE;
