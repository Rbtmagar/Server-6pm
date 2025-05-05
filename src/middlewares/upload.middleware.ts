import express from "express";
import multer from "multer";
import fs from 'fs'
import { Role } from "../types/enum";
import { cloudinary } from '../config/cloudinary.config'
import { CloudinaryStorage } from "multer-storage-cloudinary";

// export const uploader = (folderName?:string) =>{
//     const destination = `./uploads/${folderName}`

//     if(!fs.existsSync(destination)){
//         fs.mkdirSync(destination,{recursive:true})
//     }
//     const storage = multer.diskStorage({
//         destination: function (req, file, cb){
//             cb(null, destination)
//         },
//         filename: function (req, file, cb) {
//             const uniqueSuffix = Date.now() + '-' +     Math.round(Math.random() * 1E9)
//             cb(null, file.fieldname + '-' + uniqueSuffix + '-' + file.originalname)
//         },
//     });
//     return multer ({storage})
// }

export const uploader = (folderName?:string) =>{
    const storage = new CloudinaryStorage({
        cloudinary: cloudinary,
        params: async (req,res) =>{
        return {
            folder: 'expenses/receipts',
            allowed_formats:['png','jpg','webp','pdf']
            }
        },
    });
    return multer ({storage})
}