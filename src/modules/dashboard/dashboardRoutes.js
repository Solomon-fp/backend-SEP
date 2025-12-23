import express from "express";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../middleware/authMiddleware.js";

export const router = express.Router();
const prisma = new PrismaClient();

router.get("/stats", auth, async (req, res) => {
  if (req.user.role !== "ADMIN") {
    return res.status(403).json({ message: "Forbidden" });
  }

  const total = await prisma.taxReturn.count();
  const pending = await prisma.taxReturn.count({
    where: { status: "PENDING" }
  });
  const approved = await prisma.taxReturn.count({
    where: { status: "APPROVED" }
  });

  res.json({ total, pending, approved });
});


