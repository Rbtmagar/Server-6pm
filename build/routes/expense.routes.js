"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const expense_controller_1 = require("../controllers/expense.controller");
const authentication_middleware_1 = require("../middlewares/authentication.middleware");
const enum_1 = require("../types/enum");
const multer_1 = __importDefault(require("multer"));
const expenseRoutes = express_1.default.Router();
// const upload = uploader('receipts')
// const upload = multer({dest:'./uploads'})
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + '-' + file.originalname);
    }
});
const upload = (0, multer_1.default)({ storage });
expenseRoutes.post('/', (0, authentication_middleware_1.Authenticate)([enum_1.Role.User]), upload.array('receipts', 3), expense_controller_1.create);
// expenseRoutes.delete('/:id',Authenticate([Role.Admin]),remove)
exports.default = expenseRoutes;
