import express from "express";
import cors from "cors";

// import authRoutes from "./modules/auth/auth.routes";
// import returnRoutes from "./modules/returns/returns.routes";
// import dashboardRoutes from "./modules/dashboard/dashboard.routes";

const app = express();

app.use(cors());
app.use(express.json());

// app.use("/api/auth", authRoutes);
// app.use("/api/returns", returnRoutes);
// app.use("/api/dashboard", dashboardRoutes);

export default app;
