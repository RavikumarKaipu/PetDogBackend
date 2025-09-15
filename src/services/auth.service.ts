import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User, IUser } from "../models/user.model";
import { ENV } from "../config/env";

export const registerUser = async (
  fullName: string,
  username: string,
  email: string,
  password: string
): Promise<{ message: string }> => {
  const existingUser = await User.findOne({ $or: [{ username }, { email }] });
  if (existingUser) throw new Error("Username or Email already exist!");

  const hashed = await bcrypt.hash(password, 10);
  const user = new User({ fullName, username, email, password: hashed });
  await user.save();

  return { message: "User registered successfully" };
};

export const loginUser = async (
  username: string,
  password: string
): Promise<{ token: string; username: string; email: string }> => {
  const user = await User.findOne({ username });
  if (!user) throw new Error("Invalid Credentials");

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) throw new Error("Invalid Credentials");

  const token = jwt.sign({ id: user._id, username: user.username }, ENV.SECRET_KEY, { expiresIn: "1d" });
  return { token, username: user.username, email: user.email };
};
