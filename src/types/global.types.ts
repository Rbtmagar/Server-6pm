import mongoose from "mongoose"
import { Role } from "./enum"


export interface IPayload {
    _id:mongoose.Types.ObjectId,
    email:string,
    userName:string,
    fullName:string,
    role:Role
}
 