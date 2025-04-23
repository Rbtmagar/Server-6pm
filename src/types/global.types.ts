import mongoose from "mongoose"
import { Role } from "./enum"


interface IPayLoad {
    _id:mongoose.Types.ObjectId,
    email:string,
    user_name:string,
    full_name:string,
    role:Role
}
