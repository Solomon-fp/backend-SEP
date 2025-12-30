import express from 'express';
import { PrismaClient } from '@prisma/client';
import { createNotification } from '../../notifications/notificationRoute.js';

const fbrDecisionRouter = express.Router();
const prisma = new PrismaClient();

/**
 * GET /api/fbr/decision/returns
 * Fetch all returns for decision page
 */
fbrDecisionRouter.get('/returns', async (req, res) => {
  try {
    const returns = await prisma.taxReturn.findMany({
      orderBy: { id: 'desc' },
    });

    const formattedReturns = returns.map(r => ({
      ...r,
      totalTax: r.totalTax ? Number(r.totalTax) : 0,
    }));

    res.json(formattedReturns);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch returns' });
  }
});

/**
 * POST /api/fbr/decision/:id
 * Make final decision on a return
 */
/**
 * POST /api/fbr/decision/:id
 * Make final decision on a return
 */
fbrDecisionRouter.post('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { decision } = req.body;

    // Validate decision against enum values
    const validDecisions = ['SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'OBJECTION'];
    if (!validDecisions.includes(decision)) {
      return res.status(400).json({ message: 'Invalid decision' });
    }

    // Update tax return with new status
    const updatedReturn = await prisma.taxReturn.update({
      where: { id },
      data: {
        fbrStatus: decision,
        lastUpdated: new Date().toISOString(),
      },
    });

    // Create notification for client
    await createNotification({
      clientId: updatedReturn.clientId, // send to the correct client
      title: `Return ${decision}`,
      message: `Your tax return (${updatedReturn.id}) has been ${decision.toLowerCase()} by FBR.`,
      type: decision === 'APPROVED' ? 'SUCCESS' : decision === 'REJECTED' ? 'ERROR' : 'WARNING',
    });

    res.json(updatedReturn);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update decision' });
  }
});

export default fbrDecisionRouter;
