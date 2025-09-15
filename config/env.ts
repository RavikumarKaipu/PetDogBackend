import dotenv from "dotenv";

dotenv.config();

export const ENV = {
  PORT: process.env.PORT || 7000,
  MONGO_URI: process.env.MONGO_URI || "",
  SECRET_KEY: process.env.SECRET_KEY || "your_secret_key",
};
