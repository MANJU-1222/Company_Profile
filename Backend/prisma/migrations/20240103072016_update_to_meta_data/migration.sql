/*
  Warnings:

  - You are about to drop the column `extendedPetsData` on the `File` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "File" DROP COLUMN "extendedPetsData",
ADD COLUMN     "metaData" JSONB;
