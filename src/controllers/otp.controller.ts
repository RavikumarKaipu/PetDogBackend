import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import { User } from "../models/user.model";

const otpStore = new Map<string, { otp: number; timestamp: number }>();

// Configure transporter (adjust with your SMTP provider)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Verify Email Exists
export const verifyEmail = async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email required" });

  const exists = await User.exists({ email });
  if (!exists) return res.status(404).json({ error: "Email not found" });

  res.json({ message: "Email exists, you may request OTP." });
};

// Send OTP
export const sendOtp = async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email required" });

  const otp = Math.floor(100000 + Math.random() * 900000);
  const timestamp = Date.now();

  try {
    await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: "Password Reset OTP",
      text: `Your OTP is: ${otp}`,
    });

    otpStore.set(email, { otp, timestamp });
    res.json({ message: "OTP sent successfully" });
  } catch (err) {
    console.error("OTP Email Error:", err);
    res.status(500).json({ error: "Failed to send OTP" });
  }
};

// Verify OTP
export const verifyOtp = (req: Request, res: Response) => {
  const { email, otp: userOtp } = req.body;
  const stored = otpStore.get(email);

  if (!stored) return res.status(400).json({ error: "No OTP requested" });

  const ageMins = (Date.now() - stored.timestamp) / 60000;
  if (ageMins > 10) {
    otpStore.delete(email);
    return res.status(400).json({ error: "OTP expired" });
  }

  if (Number(userOtp) !== stored.otp) {
    return res.status(400).json({ error: "Invalid OTP" });
  }

  otpStore.delete(email);
  res.json({ message: "OTP verified" });
};


export const updatePassword = async (req: Request, res: Response) => {
  const { email, newPassword } = req.body;
  if (!email || !newPassword) {
    return res.status(400).json({ error: "Missing email or password" });
  }

  const hashed = await bcrypt.hash(newPassword, 10);
  const result = await User.findOneAndUpdate({ email }, { password: hashed });

  if (!result) return res.status(404).json({ error: "Email not found" });

  res.json({ message: "Password updated successfully" });
};
