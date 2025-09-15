import { Router } from "express";
import { verifyEmail, sendOtp, verifyOtp, updatePassword } from "../controllers/otp.controller";

const router = Router();

router.post("/verify-email", verifyEmail);
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/update-password", updatePassword);

export default router;
