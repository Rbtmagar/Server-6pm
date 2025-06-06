"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploader = void 0;
const multer_1 = __importDefault(require("multer"));
const cloudinary_config_1 = require("../config/cloudinary.config");
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
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
const uploader = (folderName) => {
    const storage = new multer_storage_cloudinary_1.CloudinaryStorage({
        cloudinary: cloudinary_config_1.cloudinary,
        params: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
            return {
                folder: 'expenses/receipts',
                allowed_formats: ['png', 'jpg', 'webp', 'pdf']
            };
        }),
    });
    return (0, multer_1.default)({ storage });
};
exports.uploader = uploader;
