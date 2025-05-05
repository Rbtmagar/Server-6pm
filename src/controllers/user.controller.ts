import { NextFunction, Request, Response} from "express"
import User from "../models/user.model"
import asyncHandler from "../utils/async-handler.utils";
import { CustomError } from "../middlewares/error-handler.middleware";
import { hash, compare} from "../utils/bcrypt.utils";
import { generateJwtToken } from "../utils/jwt.utils";
import { Role } from "../types/enum";
import { IPayload } from "../types/global.types";
import { getPagination } from "../utils/pagination.utils";

// Register controller
export const register = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { password,role, ...data } = req.body;

  if (!password) {
    throw new CustomError("Password is required", 400);
  }

  const hashedPassword = await hash(password);

  const user = await User.create({
    ...data,role:Role.User,
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
// find user by email => user
  const user = await User.findOne({ email });

  if (!user) {
    throw new CustomError("Invalid credentials", 400);
  }

  const isMatch = await compare(password, user.password);

  if (!isMatch) {
    throw new CustomError("Invalid credentials", 400);
  }
  const payload:IPayload = {
    _id:user._id,
    email:user.email,
    fullName:user.fullName,
    userName:user.userName,
    role: user.role as Role,
  };
  
  const token = generateJwtToken(payload); // generate JWT
  res.status(201).json({
    success: true,
    message: "Login successful",
    token,
    data: payload,
  });
});

export const adminLogin = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new CustomError("Email and password are required", 400);
  }

  const user = await User.findOne({ email });

  if (!user || user.role !== Role.Admin) {
    throw new CustomError("Invalid credentials", 400);
  }

  const isMatch = await compare(password, user.password);

  if (!isMatch) {
    throw new CustomError("Invalid credentials", 400);
  }
  const payload:IPayload = {
    _id:user._id,
    email:user.email,
    fullName:user.fullName,
    userName:user.userName,
    role: user.role as Role,
  };
  
  const token = generateJwtToken(payload); // generate JWT
  res.status(201).json({
    success: true,
    message: "Login successful",
    token,
    data: payload,
  });
});


export const getProfile = asyncHandler(async(req:Request,res:Response)=>{
  
  const {id} = req.user._id

  const profile = await User.findById(id).select('-password')
  if(!profile){
    throw new CustomError("Profile not found", 404)
  }
  res.status(200).json({
  success: true,
  message: "Profile fetched",
  data: profile,
  status: "success",
});
});

export const getUserById = asyncHandler(async(req:Request,res:Response)=>{
  
  const {id} = req.params

  const user = await User.findById(id).select('-password')
  if(!user){
    throw new CustomError("User not found", 404)
  }
  res.status(200).json({
  success: true,
  message: "User fetched",
  data: user,
  status: "success",
});
});


export const getAllUser = asyncHandler(async(req:Request,res:Response)=>{
  const limit:number = parseInt(req.params.perPage) ?? 10
  const page = parseInt(req.params.page) ?? 1
  const skip = (page - 1) * limit

  const users = await User.findById({}).select('-password').limit(limit).skip(skip)
  const total = await User.countDocuments()


  const pagination = getPagination(total,page,limit)

  res.status(200).json({
  success: true,
  message: "User fetched",
  data: {
    data: users,
    pagination
  },
  status: "success",
});
});

export const remove = asyncHandler(async(req:Request,res:Response)=>{
  
  const {id} = req.params
  await User.findByIdAndDelete(id)

  res.status(200).json({
  success: true,
  message: "User fetched",
  data: null,
  status: "success",
});
});






