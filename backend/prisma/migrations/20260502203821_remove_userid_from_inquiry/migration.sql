/*
  Warnings:

  - You are about to drop the column `userId` on the `Inquiry` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Inquiry" DROP CONSTRAINT "Inquiry_userId_fkey";

-- AlterTable
ALTER TABLE "Inquiry" DROP COLUMN "userId";
