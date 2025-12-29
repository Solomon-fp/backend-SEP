import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import router from "./modules/auth/authRoutes.js";
import clientRouter from "./modules/dashboard/client/clientRoute.js";
import routerInfo from "./modules/dashboard/client/infoRoute.js";
import billRouter from "./modules/dashboard/client/billingRoute.js";
import verificationRouter from "./modules/dashboard/employee/verificationRoute.js";
import caculationRouter from "./modules/dashboard/employee/taxCalculationRoute.js";
import employeeDashboardRouter from "./modules/dashboard/employee/employeeDashboardRouter.js";
import clientDashboardRouter from "./modules/dashboard/client/clientDashboardRouter.js";
import generateBillingRouter from "./modules/dashboard/employee/generateBillingRoute.js";
import reviewRouter from "./modules/dashboard/fbr/fbrReview.js";
import notificationRouter from "./modules/notifications/notificationRoute.js";
import finalApprovalRouter from "./modules/returns/finalApprovalRoute.js";

dotenv.config();

const PORT = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", router);
app.use("/api/client/dashboard", clientDashboardRouter);
app.use('/api/info-request', routerInfo);
app.use("/api/billing", billRouter);
app.use("/api/client", clientRouter);
app.use("/api/verify", verificationRouter);
app.use("/api/calculation", caculationRouter);
app.use("/api/employee/billing", generateBillingRouter);
app.use("/api/dashboard", employeeDashboardRouter);
app.use("/api/fbr", reviewRouter);
app.use('/api/notifications', notificationRouter);
app.use('/api/final-approval', finalApprovalRouter);

app.get("/", (req, res) => {
  res.send(`🚀 Backend running on port ${PORT}`);
});

app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});
