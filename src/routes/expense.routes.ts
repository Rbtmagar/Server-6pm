import express, { Router } from 'express';
import { create, update } from '../controllers/expense.controller';
import { Authenticate } from '../middlewares/authentication.middleware';
import { Role } from '../types/enum';
import { uploader } from '../middlewares/upload.middleware'
import multer from 'multer';

const expenseRoutes = express.Router();

// const upload = uploader('receipts')
// const upload = multer({dest:'./uploads'})

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix + '-' + file.originalname)
    }
  })
  
const upload = multer({ storage })


expenseRoutes.post('/',Authenticate([Role.User]),upload.array('receipts',3), create)
// expenseRoutes.delete('/:id',Authenticate([Role.Admin]),remove)


export default expenseRoutes;