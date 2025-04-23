import { NextFunction, Request, RequestHandler, Response} from "express"

type Handler = (req:Request, res:Response, next:NextFunction) => Promise<any>

const asyncHandler = (fn:Handler):RequestHandler => {
    return (req:Request, res:Response, next:NextFunction) => {
      Promise.resolve(fn(req, res, next)).catch((err) =>  {next(err)});
    };
  };

// const asyncHandler = (fn: Handler): RequestHandler => 
// (req, res, next) => fn(req, res, next).catch(next);



export default asyncHandler;
  