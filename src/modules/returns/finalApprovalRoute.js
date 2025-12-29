// src/modules/returns/finalApprovalRoute.js
import express from 'express';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const finalApprovalRouter = express.Router();

// EMPLOYEE FINAL APPROVAL
finalApprovalRouter.get("/final-approval", async (req, res) => {
  try {
    const returns = await prisma.taxReturn.findMany({
      where: { status: "APPROVED" }, // only APPROVED returns
      orderBy: { submittedDate: "desc" },
    });
    res.json(returns);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch final approvals" });
  }
});

finalApprovalRouter.put('/:id/approve', async (req, res) => {
  const { id } = req.params;

  try {
    // Update tax return status
    const updatedReturn = await prisma.taxReturn.update({
      where: { id: parseInt(id) },
      data: { status: 'APPROVED', lastUpdated: new Date().toISOString() },
    });

    // Create notification for client
    await prisma.notifications.create({
      data: {
        title: 'Return Approved',
        message: 'Your tax return has been approved by FBR.',
        type: 'SUCCESS',
        read: false,
        createdAt: new Date().toISOString(),
      },
    });

    res.json({ message: 'Return approved and client notified', updatedReturn });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to approve return' });
  }
});

export default finalApprovalRouter;
