import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import router from "./modules/auth/authRoutes.js";
import { router as routerd } from "./modules/dashboard/dashboardRoutes.js";
import { router as routerb  } from "./modules/returns/returnsRoutes.js";

dotenv.config();

const PORT = process.env.PORT || 5000; 
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", router);
app.use("/api/dashboard", routerd)
app.use("/api/returns", routerb)


app.get("/", (req, res) => {
  res.send(`🚀 Backend running on port ${PORT}`);
});

app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});
