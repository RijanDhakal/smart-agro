-- AlterTable
ALTER TABLE "order" ADD COLUMN     "userUserId" TEXT;

-- AddForeignKey
ALTER TABLE "order" ADD CONSTRAINT "order_userUserId_fkey" FOREIGN KEY ("userUserId") REFERENCES "user"("userId") ON DELETE SET NULL ON UPDATE CASCADE;
