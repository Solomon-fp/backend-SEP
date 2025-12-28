import express from "express";
import { PrismaClient } from '@prisma/client';

export const employeeDashboardRouter = express.Router();
const prisma = new PrismaClient();

/* Dashboard summary */
employeeDashboardRouter.get("/", async (req, res) => {
  try {
    const [totalClients, pendingVerification, underReview, infoRequests] = await Promise.all([
      prisma.user.count(),
      prisma.taxReturn.count({ where: { status: "SUBMITTED" } }),
      prisma.taxReturn.count({ where: { status: "IN_REVIEW" } }),
      prisma.infoRequest.count({ where: { status: "IN_PROGRESS" } }),
    ]);

    res.json({ totalClients, pendingVerification, underReview, infoRequests });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

/* Pending Verifications */
employeeDashboardRouter.get("/verify", async (req, res) => {
  try {
    const returns = await prisma.taxReturn.findMany({
      orderBy: { lastUpdated: "desc" },
      take: 4,
      select: {
        id: true,
        clientName: true,
        taxYear: true,
        documents: true,
        totalIncome: true,
        status: true,
      },
    });
    res.json(returns);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

/* Info Requests */
employeeDashboardRouter.get("/requests", async (req, res) => {
  try {
    const requests = await prisma.infoRequest.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        clientName: true,
        subject: true,
        status: true,
      },
    });
    res.json(requests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

export default employeeDashboardRouter;
