import { Request, Response } from "express";
import { CustomError } from "../middlewares/error-handler.middleware";
import asyncHandler from "../utils/async-handler.utils";
import User from "../models/user.model";
import Category from "../models/category.model";

export const create = asyncHandler(async(req:Request,res:Response)=>{
    const {name,userId} = req.body
if (!userId) {
    throw new CustomError("User Id is required", 400);
  }
  const user = await User. findById(userId)
  if (!user) {
      throw new CustomError("Invalid credentials", 400);
    }
    const category = await Category.create({name,user:user._id})

    res.status(201).json({
        message:'Category created',
        data:category,
        success:true,
        status:'success'
    })

})