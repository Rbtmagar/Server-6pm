import User from "../models/user.model.js";
export const register = async (req, res, next) => {
    try {
        const data = req.body;
        const user = await User.create({ ...data });
        res.status(201).json({
            message: "User registered successfully.",
            user,
        });
    }
    catch (error) {
        next(error);
    }
};
// import { Request, Response } from "express";
// export const getAll = (req:Request, res:Response) => {
//   res.status(200).json({
//     message: "User fetched.",
//   });
// };
// export const remove = (req:Request, res:Response) => {
//   res.status(200).json({
//     message: "User fetched.",
//   });
// };
// export const getById = (req:Request, res:Response) => {
//   res.status(200).json({
//     message: "User by id fetched.",
//   });
// };
// export default getById;
