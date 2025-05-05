import { Schema, Types } from "mongoose";
import mongoose, { model } from "mongoose";

const categorySchema = new Schema({
    name:{
        type:String,
        required:[true,'name is required'],
    },
    user:{
        type: Schema.Types.ObjectId,
        ref:'user',
        required:[true,'User is required']
    }

},{timestamps:true})

const Category = model('category',categorySchema);
export default Category;