import express from "express";
import { PrismaClient } from "@prisma/client";

const fbrDashboardRouter = express.Router();
const prisma = new PrismaClient();

/**
 * GET /api/fbr/returns
 * Fetch ALL tax returns (for dashboard)
 */
fbrDashboardRouter.get("/returns", async (req, res) => {
  try {
    const returns = await prisma.taxReturn.findMany({
      orderBy: {
        id: "desc",
      },
    });

    res.json(returns);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch tax returns" });
  }
});

/**
 * GET /api/fbr/returns/:id
 * Fetch SINGLE tax return (review page)
 */
fbrDashboardRouter.get("/returns/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const taxReturn = await prisma.taxReturn.findUnique({
      where: { id },
    });

    if (!taxReturn) {
      return res.status(404).json({ message: "Tax return not found" });
    }

    res.json(taxReturn);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch tax return" });
  }
});

/**
 * POST /api/fbr/returns/:id/decision
 * Approve / Reject / Objection
 */
fbrDashboardRouter.post("/returns/:id/decision", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { decision } = req.body;

    if (!["APPROVED", "REJECTED", "OBJECTION"].includes(decision)) {
      return res.status(400).json({ message: "Invalid decision" });
    }

    const updatedReturn = await prisma.taxReturn.update({
      where: { id },
      data: {
        status: decision,
        lastUpdated: new Date().toISOString(),
      },
    });

    res.json(updatedReturn);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update decision" });
  }
});

    // GET /api/fbr/dashboard/decisions
fbrDashboardRouter.get("/decisions", async (req, res) => {
  try {
    const decisions = await prisma.taxReturn.findMany({
      where: {
        status: { in: ["APPROVED", "REJECTED", "OBJECTION"] },
      },
      orderBy: { lastUpdated: "desc" },
      take: 4,
    });

    const formatted = decisions.map(r => ({
      id: r.id.toString(),
      returnId: `TR-${r.id}`,
      client: r.clientName,
      decision: r.status.toLowerCase(),
      date: r.lastUpdated?.split('T')[0] || '',
      amount: Number(r.totalTax),
    }));

    res.json(formatted);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch decisions" });
  }
});


export default fbrDashboardRouter;
