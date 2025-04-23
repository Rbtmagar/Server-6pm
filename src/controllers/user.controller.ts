import { NextFunction, Request, Response} from "express"
import User from "../models/user.model.ts"
import asyncHandler from "../utils/async-handler.utils.ts";
import { CustomError } from "../middlewares/error-handler.middleware.ts";
import { hash, compare} from "../utils/bcrypt.utils.ts";

// Register controller
export const register = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  console.log("Register route hit");
  const { password, ...data } = req.body;


  if (!password) {
    throw new CustomError("Password is required", 400);
  }

  const hashedPassword = await hash(password);

  const user = await User.create({
    ...data,
    password: hashedPassword,
  });
    // Optional: log saved user (excluding password for security)
    console.log("User registered:", { fullName: user.fullName, email: user.email });

  res.status(201).json({
    success: true,
    status: "success",
    data: user,
  });
});

// Login controller
export const login = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new CustomError("Email and password are required", 400);
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new CustomError("Invalid credentials", 400);
  }

  const isMatch = await compare(password, user.password);

  if (!isMatch) {
    throw new CustomError("Invalid credentials", 400);
  }
  const payload = {
    _id:user._id,
    email:user.email,
    fullName:user.fullName,
    userName:user.userName,
    role:'User'| 'Admin',
  }
  res.status(201).json({
    success: true,
    message: "Login successful",
    data:user,
  });
});






















// import { Request, Response } from "express";
// export const getAll = (req:Request, res:Response) => {
//   res.status(200).json({
//     message: "User fetched.",
//   });
// };

// export const remove = (req:Request, res:Response) => {
//   res.status(200).json({
//     message: "User fetched.",
//   });
// };

// export const getById = (req:Request, res:Response) => {
//   res.status(200).json({
//     message: "User by id fetched.",
//   });
// };

// export default getById;
