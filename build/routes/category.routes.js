"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const category_controller_1 = require("../controllers/category.controller");
const authentication_middleware_1 = require("../middlewares/authentication.middleware");
const enum_1 = require("../types/enum");
const categoryRoutes = express_1.default.Router();
// categoryRoutes.post('/create', create);
categoryRoutes.get('/', (0, authentication_middleware_1.Authenticate)([enum_1.Role.Admin]), category_controller_1.getAll);
categoryRoutes.post('/', (0, authentication_middleware_1.Authenticate)([enum_1.Role.User]), category_controller_1.create);
categoryRoutes.put('/:id', (0, authentication_middleware_1.Authenticate)([enum_1.Role.User]), category_controller_1.update);
categoryRoutes.get('/:all/user', (0, authentication_middleware_1.Authenticate)([enum_1.Role.User]), category_controller_1.getByUserId);
categoryRoutes.get('/:id', (0, authentication_middleware_1.Authenticate)([enum_1.Role.User]), category_controller_1.getById);
categoryRoutes.delete('/:categoryId', (0, authentication_middleware_1.Authenticate)([enum_1.Role.User]), category_controller_1.remove);
exports.default = categoryRoutes;
