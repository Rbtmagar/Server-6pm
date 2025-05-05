"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user.controller");
const authentication_middleware_1 = require("../middlewares/authentication.middleware");
const enum_1 = require("../types/enum");
const userRoutes = express_1.default.Router();
userRoutes.post('/register', user_controller_1.register);
userRoutes.post('/login', user_controller_1.login);
userRoutes.post('/admin/login', user_controller_1.adminLogin);
userRoutes.get('/', (0, authentication_middleware_1.Authenticate)([enum_1.Role.Admin]), user_controller_1.getAllUser);
userRoutes.delete('/:id', (0, authentication_middleware_1.Authenticate)([enum_1.Role.Admin]), user_controller_1.remove);
userRoutes.get('/profile', (0, authentication_middleware_1.Authenticate)([enum_1.Role.User]), user_controller_1.getProfile);
exports.default = userRoutes;
