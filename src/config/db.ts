import mongoose from "mongoose";
import { ENV } from "./env";

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(ENV.MONGO_URI);
    console.log("✅ MongoDB Connected");
  } catch (err: any) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  }
};
