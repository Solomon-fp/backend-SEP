-- CreateEnum
CREATE TYPE "FBRStatusFinal" AS ENUM ('SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'OBJECTION');

-- AlterTable
ALTER TABLE "TaxReturn" ADD COLUMN     "fbrStatus" "FBRStatusFinal";
