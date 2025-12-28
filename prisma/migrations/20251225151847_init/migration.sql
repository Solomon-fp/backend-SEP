/*
  Warnings:

  - The `documents` column on the `TaxReturn` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "TaxReturn" DROP COLUMN "documents",
ADD COLUMN     "documents" BYTEA;
