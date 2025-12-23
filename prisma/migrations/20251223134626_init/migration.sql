-- CreateEnum
CREATE TYPE "TaxStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'IN_REVIEW', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'USER');

-- CreateEnum
CREATE TYPE "ReturnStatus" AS ENUM ('PENDING', 'FILED', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "notificationType" AS ENUM ('INFO', 'WARNING', 'ERROR', 'SUCCESS');

-- CreateEnum
CREATE TYPE "billstatus" AS ENUM ('PENDING', 'PAID', 'OVERDUE', 'CANCELLED');

-- CreateEnum
CREATE TYPE "InfoStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "role" TEXT,
    "cnic" TEXT,
    "phone" TEXT,
    "avatar" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaxReturn" (
    "id" SERIAL NOT NULL,
    "clientId" TEXT,
    "clientName" TEXT,
    "taxYear" TEXT,
    "status" "TaxStatus",
    "submittedDate" TEXT,
    "totalIncome" DECIMAL(65,30),
    "totalTax" DECIMAL(65,30),
    "documents" DECIMAL(65,30),
    "lastUpdated" TEXT,

    CONSTRAINT "TaxReturn_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" SERIAL NOT NULL,
    "title" TEXT,
    "message" TEXT,
    "type" "notificationType",
    "read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TEXT NOT NULL,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bills" (
    "id" UUID NOT NULL,
    "clientId" TEXT,
    "description" TEXT,
    "amount" DECIMAL(65,30),
    "dueDate" TEXT,
    "status" "billstatus",
    "items" JSONB,

    CONSTRAINT "bills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InfoRequest" (
    "id" SERIAL NOT NULL,
    "clientId" TEXT,
    "clientName" TEXT,
    "returnId" UUID,
    "subject" TEXT,
    "status" "InfoStatus",
    "createdAt" TEXT,
    "messages" JSONB,

    CONSTRAINT "InfoRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
