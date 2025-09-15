import express, { Application, Request, Response } from "express";
import cors from "cors";
import authRoutes from "../src/routes/auth.routes";
import otpRoutes from "../src/routes/otp.routes";

const app: Application = express();

app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.json({ status: "ok", time: new Date().toLocaleTimeString() });
});

app.use("/api", authRoutes);
app.use("/api", otpRoutes); 

export default app;
