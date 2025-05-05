"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailRegex = void 0;
const emailRegexPattern = process.env.EMAIL_REGEX;
const emailRegexFlags = process.env.EMAIL_REGEX_FLAGS || '';
exports.emailRegex = new RegExp(emailRegexPattern, emailRegexFlags);
