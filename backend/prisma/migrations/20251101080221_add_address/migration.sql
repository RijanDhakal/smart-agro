-- CreateTable
CREATE TABLE "address" (
    "addressId" TEXT NOT NULL,
    "province" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "localLevel" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "costumerId" TEXT NOT NULL,

    CONSTRAINT "address_pkey" PRIMARY KEY ("addressId")
);

-- AddForeignKey
ALTER TABLE "address" ADD CONSTRAINT "address_costumerId_fkey" FOREIGN KEY ("costumerId") REFERENCES "user"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
