-- AlterTable
ALTER TABLE "farmer" ALTER COLUMN "contact" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "order" ALTER COLUMN "quantity" DROP DEFAULT;

-- AlterTable
ALTER TABLE "product" ADD COLUMN     "expectedLifeSpan" TEXT;

-- AlterTable
ALTER TABLE "user" ALTER COLUMN "contact" SET DATA TYPE TEXT;
