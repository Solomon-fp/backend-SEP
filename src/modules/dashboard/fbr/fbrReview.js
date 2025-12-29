import express from "express";
import { PrismaClient } from "@prisma/client";

const reviewRouter = express.Router();
const prisma = new PrismaClient();

// GET all tax returns
reviewRouter.get("/fbr/returns", async (req, res) => {
  try {
    const returns = await prisma.taxReturn.findMany({
      orderBy: { submittedDate: "desc" },
    });
    res.json(returns);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch tax returns" });
  }
});

// GET single tax return by ID
reviewRouter.get("/fbr/returns/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const taxReturn = await prisma.taxReturn.findUnique({
      where: { id },
    });
    if (!taxReturn) return res.status(404).json({ error: "Tax return not found" });
    res.json(taxReturn);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch tax return" });
  }
});

// POST: update status (approve/reject/objection)
reviewRouter.post("/fbr/returns/:id/decision", async (req, res) => {
  const id = parseInt(req.params.id);
  const { decision } = req.body; // Expected: PENDING, APPROVED, REJECTED, OBJECTION

  if (!["PENDING", "APPROVED", "REJECTED", "OBJECTION"].includes(decision)) {
    return res.status(400).json({ error: "Invalid decision type" });
  }

  try {
    const updated = await prisma.taxReturn.update({
      where: { id },
      data: {
        status: decision,
        lastUpdated: new Date().toISOString(),
      },
    });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update tax return" });
  }
});

export default reviewRouter;
