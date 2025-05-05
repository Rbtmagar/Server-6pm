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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove = exports.getAllUser = exports.getUserById = exports.getProfile = exports.adminLogin = exports.login = exports.register = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const async_handler_utils_1 = __importDefault(require("../utils/async-handler.utils"));
const error_handler_middleware_1 = require("../middlewares/error-handler.middleware");
const bcrypt_utils_1 = require("../utils/bcrypt.utils");
const jwt_utils_1 = require("../utils/jwt.utils");
const enum_1 = require("../types/enum");
const pagination_utils_1 = require("../utils/pagination.utils");
// Register controller
exports.register = (0, async_handler_utils_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Register route hit");
    const _a = req.body, { password } = _a, data = __rest(_a, ["password"]);
    if (!password) {
        throw new error_handler_middleware_1.CustomError("Password is required", 400);
    }
    const hashedPassword = yield (0, bcrypt_utils_1.hash)(password);
    const user = yield user_model_1.default.create(Object.assign(Object.assign({}, data), { password: hashedPassword }));
    // Optional: log saved user (excluding password for security)
    console.log("User registered:", { fullName: user.fullName, email: user.email });
    res.status(201).json({
        success: true,
        status: "success",
        data: user,
    });
}));
// Login controller
exports.login = (0, async_handler_utils_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new error_handler_middleware_1.CustomError("Email and password are required", 400);
    }
    // find user by email => user
    const user = yield user_model_1.default.findOne({ email });
    if (!user) {
        throw new error_handler_middleware_1.CustomError("Invalid credentials", 400);
    }
    const isMatch = yield (0, bcrypt_utils_1.compare)(password, user.password);
    if (!isMatch) {
        throw new error_handler_middleware_1.CustomError("Invalid credentials", 400);
    }
    const payload = {
        _id: user._id,
        email: user.email,
        fullName: user.fullName,
        userName: user.userName,
        role: user.role,
    };
    const token = (0, jwt_utils_1.generateJwtToken)(payload); // generate JWT
    res.status(201).json({
        success: true,
        message: "Login successful",
        token,
        data: payload,
    });
}));
exports.adminLogin = (0, async_handler_utils_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new error_handler_middleware_1.CustomError("Email and password are required", 400);
    }
    const user = yield user_model_1.default.findOne({ email });
    if (!user || user.role !== enum_1.Role.Admin) {
        throw new error_handler_middleware_1.CustomError("Invalid credentials", 400);
    }
    const isMatch = yield (0, bcrypt_utils_1.compare)(password, user.password);
    if (!isMatch) {
        throw new error_handler_middleware_1.CustomError("Invalid credentials", 400);
    }
    const payload = {
        _id: user._id,
        email: user.email,
        fullName: user.fullName,
        userName: user.userName,
        role: user.role,
    };
    const token = (0, jwt_utils_1.generateJwtToken)(payload); // generate JWT
    res.status(201).json({
        success: true,
        message: "Login successful",
        token,
        data: payload,
    });
}));
exports.getProfile = (0, async_handler_utils_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.user._id;
    const profile = yield user_model_1.default.findById(id).select('-password');
    if (!profile) {
        throw new error_handler_middleware_1.CustomError("Profile not found", 404);
    }
    res.status(200).json({
        success: true,
        message: "Profile fetched",
        data: profile,
        status: "success",
    });
}));
exports.getUserById = (0, async_handler_utils_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const user = yield user_model_1.default.findById(id).select('-password');
    if (!user) {
        throw new error_handler_middleware_1.CustomError("User not found", 404);
    }
    res.status(200).json({
        success: true,
        message: "User fetched",
        data: user,
        status: "success",
    });
}));
exports.getAllUser = (0, async_handler_utils_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const limit = (_a = parseInt(req.params.perPage)) !== null && _a !== void 0 ? _a : 10;
    const page = (_b = parseInt(req.params.page)) !== null && _b !== void 0 ? _b : 1;
    const skip = (page - 1) * limit;
    const users = yield user_model_1.default.findById({}).select('-password').limit(limit).skip(skip);
    const total = yield user_model_1.default.countDocuments();
    const pagination = (0, pagination_utils_1.getPagination)(total, page, limit);
    res.status(200).json({
        success: true,
        message: "User fetched",
        data: {
            data: users,
            pagination
        },
        status: "success",
    });
}));
exports.remove = (0, async_handler_utils_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    yield user_model_1.default.findByIdAndDelete(id);
    res.status(200).json({
        success: true,
        message: "User fetched",
        data: null,
        status: "success",
    });
}));
