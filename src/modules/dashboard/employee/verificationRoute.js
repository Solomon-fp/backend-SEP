import express from "express";
import { PrismaClient } from "@prisma/client";

const verificationRouter = express();
const prisma = new PrismaClient();
/**
 * GET document for a tax return
 */
verificationRouter.get("/documents/:returnId", async (req, res) => {
  const { returnId } = req.params;

  try {
    const taxReturn = await prisma.taxReturn.findUnique({
      where: { id: parseInt(returnId) },
      select: { documents: true, clientName: true },
    });

    if (!taxReturn || !taxReturn.documents) {
      return res.status(404).json({ message: "Document not found" });
    }

    // Assume PDF as default; you can change to 'image/jpeg' if needed
    const mimetype = "image/jpg";
    const filename = `${taxReturn.clientName || "document"}.jpg`;

    res.setHeader("Content-Type", mimetype);
    res.setHeader("Content-Disposition", `inline; filename="${filename}"`);
    res.send(taxReturn.documents);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch document" });
  }
});



/**
 * GET ALL RETURNS FOR VERIFICATION
 */
// verificationRoute.js
verificationRouter.get("/", async (req, res) => {
  const { search } = req.query;

  try {
    const returns = await prisma.taxReturn.findMany({
      where: search
        ? {
            OR: [
              { clientName: { contains: String(search), mode: "insensitive" } },
              { taxYear: { contains: String(search) } },
              { status: { contains: String(search), mode: "insensitive" } },
            ],
          }
        : {},
      orderBy: { lastUpdated: "desc" },
    });

    res.json(returns);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch returns" });
  }
});


/**
 * UPDATE VERIFICATION STATUS
 */
verificationRouter.put("/:id/verify", async (req, res) => {
  const { status } = req.body;
  console.log("here")

  try {
    const updated = await prisma.taxReturn.update({
      where: { id: parseInt(req.params.id) },
      data: {
        status: status.toUpperCase(),
        lastUpdated: new Date().toLocaleDateString(),
      },
    });

    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update status" });
  }
});

export default verificationRouter;
