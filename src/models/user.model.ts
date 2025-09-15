import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  fullName: string;
  username: string;
  email: string;
  password: string;
}

const userSchema: Schema<IUser> = new Schema({
  fullName: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

export const User = mongoose.model<IUser>("User", userSchema);
