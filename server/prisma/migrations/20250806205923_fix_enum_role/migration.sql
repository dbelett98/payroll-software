/*
  Warnings:

  - Made the column `userId` on table `clients` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "clients" DROP CONSTRAINT "clients_userId_fkey";

-- DropIndex
DROP INDEX "clients_userId_key";

-- AlterTable
ALTER TABLE "clients" ALTER COLUMN "userId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "clients" ADD CONSTRAINT "clients_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
