import { Request,Response } from "express";
import asyncHandler from "../utils/async-handler.utils";
import Expense from '../models/expense.model';
import Category from "../models/category.model";
import { CustomError } from "../middlewares/error-handler.middleware";
import mongoose from "mongoose";
import { deleteFiles } from "../config/cloudinary.config";

export const create = asyncHandler(async(req:Request,res:Response) =>{
    const user: mongoose.Types.ObjectId = req.user._id
    const {categoryId,...data} = req.body

    const receipts = req.files as Express.Multer.File[]

    console.log(receipts)
    const expense = new Expense(data)
    expense.createdBy = user

    const category = await Category.findById(categoryId)
    if(!category){
        throw new CustomError('Category not found', 404)
    }
    expense.category = category._id

    if (receipts && receipts.length > 0){
        receipts.forEach(receipt => {
        expense.receipts.push({
            public_id:receipt.filename,
            path:receipt.path
        })
    })
    }
    await expense.save()

    res.status(201).json({
        data:expense,
        success:true,
        status:'success',
        message:'Expense created'
    })
})

export const update = asyncHandler(async(req:Request,res:Response) =>{
    const session = await mongoose.startSession()
    try{
        session.startTransaction()
    const user: mongoose.Types.ObjectId = req.user._id
    const {categoryId,deletedReceipts,title,date,amount,description} = req.body
    const {id} = req.params
    const receipts = req.files as Express.Multer.File[]

    const expense = await Expense.findOne({_id:id,createdBy:user}).session(session)
    if(!expense){
        throw new CustomError('Expense not found', 404)
    }
    if(title) expense.title = title
    if(date) expense.date = date
    if(amount) expense.amount = amount
    if(description) expense.description = description
    // expense.title = data.title
    // expense.date = data.date
    if (categoryId){
        const category = await Category.findById(categoryId)
        if(!category){
            throw new CustomError('Category not found', 404)
        }
        expense.category = category._id
    }
    if (receipts && receipts.length > 0){
        receipts.forEach(receipt => {
            expense.receipts.push({
                public_id:receipt.filename,
                path:receipt.path
            })
        })
    }
    if(deletedReceipts){
        const fileToDelete:string[] = JSON.parse(deletedReceipts)

     if(Array.isArray(fileToDelete) && fileToDelete.length > 0 ){
        const filteredReceipts = expense.receipts.filter(
            (receipt: any) => !fileToDelete.includes(receipt.public_id)
        );
        expense.set('receipts', filteredReceipts);
        // fileToDelete.forEach(public_id =>{
        //     expense.receipts.pull({public_id})
        // })
   await deleteFiles(fileToDelete)

        
        }
    }

    await expense.save()
    await session.commitTransaction()
    session.endSession()

    res.status(201).json({
        data:expense,
        success:true,
        status:'success',
        message:'Expense updated'
    })
}catch(error: any){
    await session.abortTransaction()
    session.endSession()
    throw new CustomError(error.message ?? 'Fail to update expense',500)
}
})


export const getByUserId = asyncHandler(async(req:Request,res:Response) =>{
    const userId = req.user._id

    const expenses = await Expense.find({createdBy:userId})

    res.status(201).json({
        message:'Expense by user Id',
        data:Expense,
        success:true,
        status:'success'
    })
})


export const getById = asyncHandler(async(req:Request,res:Response) =>{
    const userId = req.user._id
    const {id} = req.params

    const expense = await Expense.findOne({_id:id ,createdBy:userId}).populate('createdBy')
    if(!expense){
        throw new CustomError('Expense not found',404)
    }
    res.status(201).json({
        message:'Expense by user Id',
        data:Expense,
        success:true,
        status:'success'
    })
})

export const getAll = asyncHandler(async(req:Request,res:Response) =>{

    const expenses = await Category.find({})

    res.status(201).json({
        message:'All expenses fetched',
        data:expenses,
        success:true,
        status:'success'
    })
})



export const remove = asyncHandler(async(req:Request,res:Response) =>{
    const {id} = req.params
    const userId = req.user._id

    // await Category.findOneAndDelete({_id:categoryId,user})

    const expense = await Expense.findById(id)
    if(!expense){
        throw new CustomError('Expense not found', 404)
    }
    if(expense.createdBy !== userId){
        throw new CustomError('Only owner can perform this operation', 400)
    }
    if(expense.receipts){
        await deleteFiles(expense.receipts.map(receipt => receipt.public_id))
    }
    await expense.deleteOne()

    res.status(200).json({
        message:'Expense deleted',
        success:true,
        status:'success'
    });
});

