"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch((err) => { next(err); });
    };
};
// const asyncHandler = (fn: Handler): RequestHandler => 
// (req, res, next) => fn(req, res, next).catch(next);
exports.default = asyncHandler;
