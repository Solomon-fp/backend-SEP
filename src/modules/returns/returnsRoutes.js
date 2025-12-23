import express from "express";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../middleware/authMiddleware.js";


export const router = express.Router();
const prisma = new PrismaClient();

router.post("/", auth, async (req, res) => {
  const { taxYear, returnType } = req.body;

  const record = await prisma.taxReturn.create({
    data: {
      userId: req.user.id,
      taxYear,
      returnType
    }
  });

  res.json(record);
});

router.get("/me", auth, async (req, res) => {
  const records = await prisma.taxReturn.findMany({
    where: { userId: req.user.id }
  });

  res.json(records);
});

router.get("/", auth, async (req, res) => {
  if (req.user.role !== "ADMIN") {
    return res.status(403).json({ message: "Forbidden" });
  }

  const records = await prisma.taxReturn.findMany({
    include: { user: true }
  });

  res.json(records);
});


