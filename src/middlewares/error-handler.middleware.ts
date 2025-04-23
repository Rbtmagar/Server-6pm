import { Request, Response, NextFunction } from "express";

// CustomError class to handle errors more effectively
export class CustomError extends Error {
    statusCode: number;
    status: 'error' | 'success' | 'fail';
    success: boolean;
    isOperational: boolean;  // Added 'isOperational' to differentiate operational errors from programming errors

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;

        // Determine status based on the statusCode
        if (statusCode >= 400 && statusCode < 500) {
            this.status = 'fail';
        } else if (statusCode >= 500) {
            this.status = 'error';
        } else {
            this.status = 'success'; // You can use 'success' for 2xx status codes if needed
        }

        this.success = false;
        this.isOperational = true;  // Operational errors are errors that we expect and handle, not programming bugs

        // Capture stack trace to exclude the constructor call
        Error.captureStackTrace(this, this.constructor);
    }
}

// Global error handler
export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    // If the error is operational, then handle it
    const success = err.success || false;
    const statusCode = err.statusCode || 500;
    const status = err.status || 'error';
    const message = err?.message || 'Something went wrong on the server.';

    // Optionally log the error
    console.error(err); // You can replace this with a logging library for production (e.g., Winston, Log4js)

    res.status(statusCode).json({
        success,
        status,
        message,
    });
};
