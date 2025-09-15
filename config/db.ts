import mongoose from "mongoose";
import { ENV } from "./env";

export const connectDB = async (): Promise<void> => {
  try {
    // Prevent multiple connections in serverless environments (like Vercel)
    if (mongoose.connection.readyState >= 1) {
      console.log("⚡ Using existing MongoDB connection");
      return;
    }

    await mongoose.connect(ENV.MONGO_URI, {
      serverSelectionTimeoutMS: 30000, // wait 30s before timeout
      socketTimeoutMS: 45000,          // close sockets after 45s of inactivity
      retryWrites: true,
      w: "majority",
    });

    mongoose.connection.on("connected", () => {
      console.log("✅ MongoDB Connected:", ENV.MONGO_URI.split("@")[1]); // Hide credentials
    });

    mongoose.connection.on("error", (err) => {
      console.error("❌ MongoDB connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("⚠️ MongoDB disconnected. Retrying...");
    });
  } catch (err: any) {
    console.error("❌ MongoDB initial connection error:", err.message);
    // Don’t crash serverless deployments; only exit in dev/local
    if (process.env.NODE_ENV !== "production") {
      process.exit(1);
    }
  }
};
