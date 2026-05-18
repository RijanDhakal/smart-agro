-- CreateTable
CREATE TABLE "product" (
    "productId" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "description" TEXT NOT NULL,
    "sellerId" TEXT NOT NULL,

    CONSTRAINT "product_pkey" PRIMARY KEY ("productId")
);

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "product_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "farmer"("farmerID") ON DELETE RESTRICT ON UPDATE CASCADE;
