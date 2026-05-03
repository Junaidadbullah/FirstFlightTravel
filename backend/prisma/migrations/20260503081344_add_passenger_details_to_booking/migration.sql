/*
  Warnings:

  - Added the required column `contactEmail` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `passengerName` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `passportNumber` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "contactEmail" TEXT NOT NULL,
ADD COLUMN     "passengerName" TEXT NOT NULL,
ADD COLUMN     "passportNumber" TEXT NOT NULL,
ADD COLUMN     "phone" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'PENDING';
