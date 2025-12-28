import express from "express";
import { PrismaClient } from "@prisma/client";
import multer from "multer";

const clientRouter = express.Router();
const prisma = new PrismaClient();
const upload = multer({ storage: multer.memoryStorage() });

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
        clientId, clientName, taxYear, status, submittedDate, totalIncome, totalTax, lastUpdated
    } = req.body;
    try {
        
         const documentsBuffer = req.file ? req.file.buffer : null;
        
    
        const data = await prisma.taxReturn.create ({
            data: {
              clientId, clientName, taxYear, status, submittedDate, totalIncome, totalTax, documents: documentsBuffer, lastUpdated
            },
        })
        res.json({data: data,success:true});
    } catch (error) {
        res.json({data: [], success:false})
    }

})

export default clientRouter;