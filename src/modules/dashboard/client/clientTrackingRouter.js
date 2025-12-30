import express from 'express';
import { PrismaClient } from '@prisma/client';

export const clientTrackingRouter = express.Router();
const prisma = new PrismaClient();

/**
 * GET /api/client/returns?returnId=
 * Fetch single tax return for client tracking with final FBR status
 */
clientTrackingRouter.get('/returns', async (req, res) => {
  try {
    const { returnId } = req.query;

    if (!returnId || typeof returnId !== 'string') {
      return res.status(400).json({ message: 'Return ID is required' });
    }

    // Parse numeric ID from format TR-YYYY-<id>
    const numericId = parseInt(returnId.split('-').pop() || '', 10);
    if (isNaN(numericId)) {
      return res.status(400).json({ message: 'Invalid Return ID format' });
    }

    const taxReturn = await prisma.taxReturn.findUnique({
      where: { id: numericId },
    });

    if (!taxReturn) {
      return res.status(404).json({ message: 'Tax return not found' });
    }

    // Return tax return with numeric fields and FBR status
    res.json({
      ...taxReturn,
      totalTax: taxReturn.totalTax ? Number(taxReturn.totalTax) : 0,
      totalIncome: taxReturn.totalIncome ? Number(taxReturn.totalIncome) : 0,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch tax return' });
  }
});

export default clientTrackingRouter;
