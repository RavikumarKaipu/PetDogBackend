import mongoose from "mongoose";
import { ENV } from "./env";

export const connectDB = async (): Promise<void> => {
  try {
    if (mongoose.connection.readyState >= 1) {
      console.log("⚡ Using existing MongoDB connection");
      return;
    }

    await mongoose.connect(ENV.MONGO_URI, {
      serverSelectionTimeoutMS: 30000, 
      socketTimeoutMS: 45000,          
      retryWrites: true,
      w: "majority",
    });

    mongoose.connection.on("connected", () => {
      console.log("✅ MongoDB Connected:", ENV.MONGO_URI.split("@")[1]);
    });

    mongoose.connection.on("error", (err) => {
      console.error("❌ MongoDB connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("⚠️ MongoDB disconnected. Retrying...");
    });
  } catch (err: any) {
    console.error("❌ MongoDB initial connection error:", err.message);
    if (process.env.NODE_ENV !== "production") {
      process.exit(1);
    }
  }
};
