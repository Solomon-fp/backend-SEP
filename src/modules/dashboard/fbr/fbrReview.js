import express from "express";
import { PrismaClient } from "@prisma/client"; // Import enum

const reviewRouter = express.Router();
const prisma = new PrismaClient();

/**
 * GET /api/fbr/returns/:id
 * Fetch single tax return for review
 */
reviewRouter.get("/returns/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid return ID" });
    }

    const taxReturn = await prisma.taxReturn.findUnique({
      where: { id },
    });

    if (!taxReturn) {
      return res.status(404).json({ message: "Tax return not found" });
    }

    res.json(taxReturn);
  } catch (error) {
    console.error("Fetch tax return error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * POST /api/fbr/returns/:id/decision
 * Approve / Reject / Raise Objection
 */
reviewRouter.post("/returns/:id/decision", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { decision } = req.body;

    // Validate decision against enum
    if (!Object.values(FBRStatus).includes(decision)) {
      return res.status(400).json({ message: "Invalid decision" });
    }

    const updatedReturn = await prisma.taxReturn.update({
      where: { id },
      data: {
        status: decision,
        lastUpdated: new Date().toISOString(),
      },
    });

    res.json({
      message: "Decision recorded successfully",
      taxReturn: updatedReturn,
    });
  } catch (error) {
    console.error("Decision update error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default reviewRouter;
