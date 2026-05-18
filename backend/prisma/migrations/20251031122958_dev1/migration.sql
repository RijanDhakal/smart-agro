-- CreateTable
CREATE TABLE "user" (
    "userId" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "contact" INTEGER NOT NULL,
    "gmail" TEXT,

    CONSTRAINT "user_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "farmer" (
    "farmerID" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "contact" INTEGER NOT NULL,
    "address" TEXT NOT NULL,
    "gmail" TEXT NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "citizenShip_front" TEXT,
    "citizenShip_back" TEXT,

    CONSTRAINT "farmer_pkey" PRIMARY KEY ("farmerID")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_contact_key" ON "user"("contact");

-- CreateIndex
CREATE UNIQUE INDEX "farmer_contact_key" ON "farmer"("contact");

-- CreateIndex
CREATE UNIQUE INDEX "farmer_gmail_key" ON "farmer"("gmail");
