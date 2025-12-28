import express from 'express';
import { PrismaClient } from '@prisma/client';

export const billRouter = express.Router();
const prisma = new PrismaClient();

/* GET ALL BILLS */
billRouter.get('/', async (req, res) => {
  try {
    const bills = await prisma.bills.findMany({
      orderBy: { dueDate: 'desc' },
    });
    res.json(bills);
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch bills' });
  }
});

/* PAY BILL */
billRouter.post('/:id/pay', async (req, res) => {
  try {
    const bill = await prisma.bills.update({
      where: { id: req.params.id },
      data: { status: 'PAID' },
    });
    res.json(bill);
  } catch (e) {
    res.status(500).json({ error: 'Payment failed' });
  }
});

export default billRouter;
