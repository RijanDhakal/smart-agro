-- AlterTable
ALTER TABLE "product" ADD COLUMN     "quantity" DECIMAL(65,30) NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "order" (
    "orderId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "PaymentMethod" TEXT NOT NULL,
    "orderStatus" TEXT,

    CONSTRAINT "order_pkey" PRIMARY KEY ("orderId")
);
