import Joi from "joi";

export const signupSchema = Joi.object({
  fullName: Joi.string().min(3).required(),
  username: Joi.string().alphanum().min(3).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

export const loginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});
