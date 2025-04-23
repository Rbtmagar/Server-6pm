import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import { Role } from '../types/enum'

export const generateJwttoken = (payload:IPayLoad) => {
    return jwt.sign(payload,'asdhfjfe839s',{expireIn:'Id'})
}

export const decodeJwtToken = (token:string) => {
    return jwt.verify(token,'asdhfje839s')
}