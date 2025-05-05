"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const enum_1 = require("../types/enum");
const regex_utils_1 = require("../utils/regex.utils");
const userSchema = new mongoose_1.Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: [true, 'User is already exists with provided email'],
        match: [regex_utils_1.emailRegex, 'Please enter a valid email address',]
    },
    role: {
        type: String,
        enum: Object.values(enum_1.Role), // Role.User, Role.Admin
        default: enum_1.Role.User,
        required: true,
    },
    fullName: {
        type: String,
        required: [true, 'Name is required'],
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    userName: {
        type: String,
        required: [true, 'Username is required'],
    }
}, { timestamps: true });
const User = (0, mongoose_1.model)('user', userSchema);
exports.default = User;
