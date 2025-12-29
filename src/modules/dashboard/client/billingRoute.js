import express from "express";
import { PrismaClient } from "@prisma/client";
import { createNotification } from "../../notifications/notificationRoute.js";
export const billRouter = express.Router();
const prisma = new PrismaClient();

/**
 * CLIENT – GET BILLS
 * GET /api/billing?clientId=xxx
 */

billRouter.get("/client", async (req, res) => {
  try {
    const clientId = req.query.clientId; // or from auth/session
    if (!clientId) return res.status(400).json({ message: "Client ID required" });

    const bills = await prisma.bills.findMany({
      where: { clientId },
      orderBy: { dueDate: "desc" }
    });

    res.json(bills);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch bills" });
  }
});

billRouter.get("/", async (req, res) => {
  try {
  const { clientId } = req.query;

  const bills = await prisma.bills.findMany({
    where: clientId ? { clientId } : {},
    orderBy: { dueDate: "desc" },
  });

  res.json(bills);

  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to fetch bills" });
  }
});

/**
 * CLIENT – PAY BILL
 * POST /api/billing/:id/pay
 */
billRouter.post("/:id/pay", async (req, res) => {
  try {
    const bill = await prisma.bills.update({
      where: { id: req.params.id },
      data: {
        status: "PAID",
      },
    });

    await createNotification({
      title: "Payment Recieved",
      message: `Your payment for invoice ${bill.description} has been received.`,
      type: "SUCCESS",
    });

    res.json(bill);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Payment failed" });
  }
});



export default billRouter;
