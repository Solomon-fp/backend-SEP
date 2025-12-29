import express from 'express';
import { PrismaClient } from '@prisma/client';
import { createNotification } from "../../notifications/notificationRoute.js";

const routerInfo = express.Router();
const prisma = new PrismaClient();

/* =========================================
   GET REQUESTS BY RETURN ID
   GET /api/info-request?returnId=UUID
========================================= */
routerInfo.get('/', async (req, res) => {
  try {
    const { returnId } = req.query;

    if (!returnId) {
      return res.status(400).json({ message: 'returnId is required' });
    }

    const requests = await prisma.infoRequest.findMany({
      where: { returnId: String(returnId) },
      orderBy: { id: 'desc' },
    });

    res.json(requests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch requests' });
  }
});

/* =========================================
   CREATE REQUEST (EMPLOYEE)
   POST /api/info-request
========================================= */
routerInfo.post('/', async (req, res) => {
  try {
    const {
      clientId,
      clientName,
      returnId,
      subject,
      message,
    } = req.body;

    if (!returnId || !subject || !message) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const request = await prisma.infoRequest.create({
      data: {
        clientId,
        clientName,
        returnId: String(returnId),
        subject,
        status: 'OPEN', // ✅ ENUM ALIGNED
        createdAt: new Date().toISOString(),
        messages: [
          {
            sender: 'Tax Officer',
            message,
            timestamp: new Date().toISOString(),
          },
        ],
      },
    });

    await createNotification({
      title: "Information Requested",
      message: "Information has been Requested.",
      type: "SUCCESS",
    });

    res.status(201).json(request);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create request' });
  }
});

/* =========================================
   REPLY TO REQUEST
   POST /api/info-request/:id/reply
========================================= */
routerInfo.post('/:id/reply', async (req, res) => {
  try {
    const requestId = Number(req.params.id);
    const { message, sender } = req.body;

    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }

    const request = await prisma.infoRequest.findUnique({
      where: { id: requestId },
    });

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    const existingMessages = Array.isArray(request.messages)
      ? request.messages
      : [];

    const updatedRequest = await prisma.infoRequest.update({
      where: { id: requestId },
      data: {
        messages: [
          ...existingMessages,
          {
            sender,
            message,
            timestamp: new Date().toISOString(),
          },
        ],
        status: 'IN_PROGRESS', // ✅ CLIENT REPLIED
      },
    });

    res.json(updatedRequest);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to reply' });
  }
});

/* =========================================
   RESOLVE REQUEST (EMPLOYEE)
   POST /api/info-request/:id/resolve
========================================= */
routerInfo.post('/:id/resolve', async (req, res) => {
  try {
    const requestId = Number(req.params.id);

    const updated = await prisma.infoRequest.update({
      where: { id: requestId },
      data: { status: 'RESOLVED' },
    });

    await createNotification({
      title: "Information Recieved",
      message: "Requested Information has been revieved.",
      type: "SUCCESS",
    });

    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to resolve request' });
  }
});


export default routerInfo;
