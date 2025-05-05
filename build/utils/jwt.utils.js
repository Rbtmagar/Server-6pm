"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyJwtToken = exports.generateJwtToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || '';
const JWT_EXPIRE_IN = process.env.JWT_EXPIRE_IN;
const SECRET_KEY = process.env.JWT_SECRET || 'asdhfjfe839s'; // recommended to use .env
const generateJwtToken = (payload) => {
    return jsonwebtoken_1.default.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRE_IN }); // fix expiresIn
};
exports.generateJwtToken = generateJwtToken;
const verifyJwtToken = (token) => {
    return jsonwebtoken_1.default.verify(token, JWT_SECRET); // return proper type
};
exports.verifyJwtToken = verifyJwtToken;
