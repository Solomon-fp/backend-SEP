import express from "express";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import { signToken } from "../../utils/jwt.js";
import { authMiddleware } from "../../middlewares/authMiddleware.js";
import multer from "multer";

const router = express.Router();
const prisma = new PrismaClient();
const upload = multer({ storage: multer.memoryStorage() });

router.post(
  "/register",
  upload.fields([
    { name: "cnicfront", maxCount: 1 },
    { name: "cnicback", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { name, email, password, phone, cnic, role } = req.body;

      const hashed = await bcrypt.hash(password, 10);

      const cnicfrontBuffer = req.files?.cnicfront
        ? req.files.cnicfront[0].buffer
        : null;

      const cnicbackBuffer = req.files?.cnicback
        ? req.files.cnicback[0].buffer
        : null;

      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashed,
          phone,
          cnic,
          role,
          cnicfront: cnicfrontBuffer,
          cnicback: cnicbackBuffer,
        },
      });

      const token = signToken({ id: user.id, role: user.role });
      res.json({ token: token, role: user.role });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Registration failed" });
    }
  }
);


router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  console.log("here")

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ message: "Invalid credentials" });

  const token = signToken({ id: user.id, role: user.role });
  res.json({ token: token, role: user.role });
});

/**
 * ✅ PROFILE ROUTE
 * GET /api/auth/profile
 */
router.get("/profile", authMiddleware, async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json(user);
});

export default router;
