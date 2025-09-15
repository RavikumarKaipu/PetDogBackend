import { Response } from "express";

export const successResponse = (
  res: Response,
  data: any,
  message = "Success"
) => res.status(200).json({ message, data });

export const errorResponse = (
  res: Response,
  statusCode: number,
  message: string
) => res.status(statusCode).json({ error: message });
