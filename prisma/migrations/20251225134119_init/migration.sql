/*
  Warnings:

  - You are about to drop the column `avatar` on the `User` table. All the data in the column will be lost.
  - Added the required column `cnicback` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cnicfront` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "avatar",
ADD COLUMN     "cnicback" BYTEA NOT NULL,
ADD COLUMN     "cnicfront" BYTEA NOT NULL,
ADD COLUMN     "password" TEXT;
