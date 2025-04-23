import 'dotenv/config'

import express from 'express'
import { connectDatabase } from './config/database.config.ts'
import helmet from 'helmet'
import cors from 'cors'
import { NextFunction, Request, Response} from "express"
import{ errorHandler, CustomError } from './middlewares/error-handler.middleware.ts'
import userRoutes from './routes/user.routes.ts'

const app = express()

const PORT = process.env.PORT;
const DB_URI = process.env.DB_URI || '';

connectDatabase(DB_URI)

app.use(helmet())
app.use(cors({
    origin:'*'
}));

app.use(express.urlencoded({extended: true}));
app.use(express.json());

//using routes
app.use('/api/user', userRoutes);

// catch all route for undefined routes
app.all('*spalt',(req:Request,res:Response,next:NextFunction)=>{
  const message = `Cannot ${req.method} on ${req.url}`;
  const error = new CustomError(message,404);
  next(error);
});
app.listen(PORT, () => {
    console.log(`server is running at ${PORT}`);
  });
  
// Global error handler
app.use(errorHandler);

