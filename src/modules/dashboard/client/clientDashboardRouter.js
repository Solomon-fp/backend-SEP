import express from "express";
import { PrismaClient } from "@prisma/client";

const clientDashboardRouter = express.Router();
const prisma = new PrismaClient();

/**
 * GET ALL TAX RETURNS (Client Dashboard)
 * Frontend filters by clientId
 */
clientDashboardRouter.get("/returns", async (req, res) => {
  try {
    const returns = await prisma.taxReturn.findMany({
      orderBy: {
        lastUpdated: "desc",
      },
      select: {
        id: true,
        clientId: true,
        clientName: true,
        taxYear: true,
        status: true,
        fbrStatus: true,
        totalIncome: true,
        totalTax: true,
        submittedDate: true,
        lastUpdated: true,
      },
    });

    res.json(returns);
  } catch (err) {
    console.error("Client returns error:", err);
    res.status(500).json({ message: "Failed to fetch returns" });
  }
});

/**
 * GET SINGLE RETURN (Tracking Page)
 * used by /tracking/:id
 */
clientDashboardRouter.get("/returns/:id", async (req, res) => {
  try {
    const taxReturn = await prisma.taxReturn.findUnique({
      where: { id: parseInt(req.params.id) },
    });

    if (!taxReturn) {
      return res.status(404).json({ message: "Return not found" });
    }

    res.json(taxReturn);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch return" });
  }
});

/**
 * DOWNLOAD / VIEW DOCUMENT (BYTEA)
 */
clientDashboardRouter.get("/returns/:id/document", async (req, res) => {
  try {
    const taxReturn = await prisma.taxReturn.findUnique({
      where: { id: parseInt(req.params.id) },
      select: { documents: true },
    });

    if (!taxReturn || !taxReturn.documents) {
      return res.status(404).json({ message: "Document not found" });
    }

    // assume PDF
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `inline; filename="tax_return_${req.params.id}.pdf"`
    );

    res.send(taxReturn.documents);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch document" });
  }
});

export default clientDashboardRouter;
