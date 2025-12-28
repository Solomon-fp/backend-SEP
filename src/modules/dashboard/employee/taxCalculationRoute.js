import express from "express";
import { PrismaClient } from "@prisma/client";

const calculationRouter = express.Router();
const prisma = new PrismaClient();

/* Fetch all tax returns */
calculationRouter.get("/", async (req, res) => {
  const returns = await prisma.taxReturn.findMany({
    select: {
      id: true,
      clientName: true,
      taxYear: true,
    },
    orderBy: { lastUpdated: "desc" },
  });

  res.json(returns);
});

/* Fetch tax calculation for a return */
calculationRouter.get("/:id/tax", async (req, res) => {
  const { id } = req.params;
  const numId = parseInt(id);

  const taxReturn = await prisma.taxReturn.findUnique({
    where: { id: numId },
  });

  if (!taxReturn) {
    return res.status(404).json({ message: "Return not found" });
  }

  res.json({
    totalIncome: taxReturn.totalIncome || 0,
    exemptions: 0,
    taxableIncome: taxReturn.totalIncome || 0,
    taxRate: 5,
    grossTax: taxReturn.totalTax || 0,
    taxCredits: 0,
    netTax: taxReturn.totalTax || 0,
  });
});

/* Save tax calculation */
calculationRouter.put("/:id/tax", async (req, res) => {
  const { id } = req.params;
  const numId = parseInt(id);
  const { totalIncome, netTax } = req.body;

  await prisma.taxReturn.update({
    where: { id: numId },
    data: {
      totalIncome,
      totalTax: netTax,
      lastUpdated: new Date().toLocaleDateString(),
    },
  });

  res.json({ message: "Tax calculation saved" });
});

export default calculationRouter;
