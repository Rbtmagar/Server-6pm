import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { Role } from '../types/enum';
const JWT_SECRET = process.env.JWT_SECRET || '';
const JWT_EXPIRE_IN = process.env.JWT_EXPIRE_IN 
import { IPayload } from '../types/global.types'; // correct spelling of IPayLoad


const SECRET_KEY = process.env.JWT_SECRET || 'asdhfjfe839s'; // recommended to use .env

export const generateJwtToken = (payload: IPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRE_IN as any}); // fix expiresIn
};

export const verifyJwtToken = (token: string): jwt.JwtPayload => {
  return jwt.verify(token, JWT_SECRET) as jwt.JwtPayload; // return proper type
};