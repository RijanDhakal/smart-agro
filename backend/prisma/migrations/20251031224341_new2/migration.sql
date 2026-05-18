/*
  Warnings:

  - Added the required column `orderStatus` to the `order` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('ORDERED', 'PROCESSING', 'SHIPPED', 'DELIVERED');

-- AlterTable
ALTER TABLE "order" DROP COLUMN "orderStatus",
ADD COLUMN     "orderStatus" "OrderStatus" NOT NULL;

-- AlterTable
ALTER TABLE "product" ALTER COLUMN "quantity" DROP DEFAULT;
