import { Request, Response } from "express";
import { registerUser, loginUser } from "../services/auth.service";

export const signup = async (req: Request, res: Response) => {
  try {
    const { fullName, username, email, password } = req.body;
    if (!fullName || !username || !email || !password)
      return res.status(400).json({ error: "All fields required" });

    const response = await registerUser(fullName, username, email, password);
    res.status(201).json(response);
  } catch (err: any) {
    console.error("Signup Error:", err);
    res.status(400).json({ error: err.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res.status(400).json({ error: "Username and password required" });

    const response = await loginUser(username, password);
    res.status(200).json(response);
  } catch (err: any) {
    console.error("Login Error:", err);
    res.status(401).json({ error: err.message });
  }
};
