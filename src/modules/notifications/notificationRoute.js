import express from 'express';
import { PrismaClient } from '@prisma/client';

const notificationRouter = express.Router();
const prisma = new PrismaClient();

/* ===============================
   GET ALL NOTIFICATIONS
   =============================== */
notificationRouter.get('/', async (req, res) => {
  try {
    const notifications = await prisma.notifications.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(notifications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch notifications' });
  }
});

/* ===============================
   MARK NOTIFICATION AS READ
   =============================== */
notificationRouter.put('/:id/read', async (req, res) => {
  const { id } = req.params;

  try {
    const updated = await prisma.notifications.update({
      where: { id: parseInt(id) },
      data: { read: true },
    });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to mark as read' });
  }
});

/* ===============================
   CREATE NOTIFICATION
   =============================== */
export const createNotification = async ({ title, message, type }) => {
  try {
    const created = await prisma.notifications.create({
    data: {
      title,
      message,
      type,
      createdAt: new Date().toISOString(),
    },
  });
  return created;


  } catch (err) {
    console.error('Failed to create notification:', err);
    return null;
  };
}
export default notificationRouter;
