import 'dotenv/config'

import express from 'express'
import { connectDatabase } from './config/database.config'
import helmet from 'helmet'
import cors from 'cors'
import { NextFunction, Request, Response} from "express"
import{ errorHandler, CustomError } from './middlewares/error-handler.middleware'
import userRoutes from './routes/user.routes'
import categoryRoutes from './routes/category.routes'
import expenseRoutes from './routes/expense.routes'

const app = express()

const PORT = process.env.PORT;
const DB_URI = process.env.DB_URI || '';


connectDatabase(DB_URI)

// using middlewares
app.use(helmet())
app.use(cors({
    origin:'*'
}));

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use('/api/uploads',express.static('uploads/'))

//using routes
app.use('/api/user', userRoutes);
app.use('api/category',categoryRoutes)
app.use('api/expense',expenseRoutes)




// catch all route for undefined routes
app.use('*spalt',(req:Request,res:Response,next:NextFunction)=>{
  const message = `Cannot ${req.method} on ${req.url}`;
  const error = new CustomError(message,404);
  next(error);
});
app.listen(PORT, () => {
    console.log(`Server is running at ${PORT}`);
  });
  
// Global error handler
app.use(errorHandler);

