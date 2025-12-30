import express from "express";
import { PrismaClient } from "@prisma/client";
import multer from "multer";
import { createNotification } from "../../notifications/notificationRoute.js";

const clientRouter = express.Router();
const prisma = new PrismaClient();
const upload = multer({ storage: multer.memoryStorage() });

clientRouter.get("/", async (req, res) => {
  try {
    const clients = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
      },
      orderBy: {
        name: "asc",
      },
      where: {
        role: "client"
      }
    });

    res.json(clients);
  } catch (error) {
    console.error("Fetch Clients Error:", error);
    res.status(500).json({ message: "Failed to fetch clients" });
  }
});

// GET /api/client/dashboard/returns?clientId=
clientRouter.get('/dashboard/returns', async (req, res) => {
  const { clientId } = req.query;

  if (!clientId) {
    return res.status(400).json({ message: 'clientId required' });
  }

  const returns = await prisma.taxReturn.findMany({
    where: { clientId: String(clientId) },
    orderBy: { id: 'desc' },
  });

  res.json(returns);
});


clientRouter.get("/returns", async (req, res) => {
   const data = await prisma.taxReturn.findMany({
    where: {
        clientId: req.body.id
    },
   });

   if (!data) {
    res.json([])
   }
   res.json(data)
});

clientRouter.post("/returns",
     upload.single("documents"),
    async (req, res) => {
    const {
        clientId, clientName, taxYear, status,fbrStatus, submittedDate, totalIncome, totalTax, lastUpdated
    } = req.body;
    try {
        
         const documentsBuffer = req.file ? req.file.buffer : null;

         console.log(clientId, fbrStatus)
        
    
        const data = await prisma.taxReturn.create ({
            data: {
              clientId, clientName, taxYear, status, submittedDate, totalIncome, totalTax,fbrStatus: fbrStatus,  documents: documentsBuffer, lastUpdated
            },
        })

         await createNotification({
      title: "Return Submitted",
      message: "Your tax return has been submitted.",
      type: "SUCCESS",
    });

        res.json({data: data,success:true});
        console.log("here")
    } catch (error) {
        res.json({data: [], success:false})
        console.log("there")
    }

})


export default clientRouter;