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
exports.remove = exports.getAll = exports.getById = exports.getByUserId = exports.update = exports.create = void 0;
const async_handler_utils_1 = __importDefault(require("../utils/async-handler.utils"));
const expense_model_1 = __importDefault(require("../models/expense.model"));
const category_model_1 = __importDefault(require("../models/category.model"));
const error_handler_middleware_1 = require("../middlewares/error-handler.middleware");
const mongoose_1 = __importDefault(require("mongoose"));
const cloudinary_config_1 = require("../config/cloudinary.config");
exports.create = (0, async_handler_utils_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user._id;
    const _a = req.body, { categoryId } = _a, data = __rest(_a, ["categoryId"]);
    const receipts = req.files;
    console.log(receipts);
    const expense = new expense_model_1.default(data);
    expense.createdBy = user;
    const category = yield category_model_1.default.findById(categoryId);
    if (!category) {
        throw new error_handler_middleware_1.CustomError('Category not found', 404);
    }
    expense.category = category._id;
    if (receipts && receipts.length > 0) {
        receipts.forEach(receipt => {
            expense.receipts.push({
                public_id: receipt.filename,
                path: receipt.path
            });
        });
    }
    yield expense.save();
    res.status(201).json({
        data: expense,
        success: true,
        status: 'success',
        message: 'Expense created'
    });
}));
exports.update = (0, async_handler_utils_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const user = req.user._id;
        const { categoryId, deletedReceipts, title, date, amount, description } = req.body;
        const { id } = req.params;
        const receipts = req.files;
        const expense = yield expense_model_1.default.findOne({ _id: id, createdBy: user }).session(session);
        if (!expense) {
            throw new error_handler_middleware_1.CustomError('Expense not found', 404);
        }
        if (title)
            expense.title = title;
        if (date)
            expense.date = date;
        if (amount)
            expense.amount = amount;
        if (description)
            expense.description = description;
        // expense.title = data.title
        // expense.date = data.date
        if (categoryId) {
            const category = yield category_model_1.default.findById(categoryId);
            if (!category) {
                throw new error_handler_middleware_1.CustomError('Category not found', 404);
            }
            expense.category = category._id;
        }
        if (receipts && receipts.length > 0) {
            receipts.forEach(receipt => {
                expense.receipts.push({
                    public_id: receipt.filename,
                    path: receipt.path
                });
            });
        }
        if (deletedReceipts) {
            const fileToDelete = JSON.parse(deletedReceipts);
            if (Array.isArray(fileToDelete) && fileToDelete.length > 0) {
                const filteredReceipts = expense.receipts.filter((receipt) => !fileToDelete.includes(receipt.public_id));
                expense.set('receipts', filteredReceipts);
                // fileToDelete.forEach(public_id =>{
                //     expense.receipts.pull({public_id})
                // })
                yield (0, cloudinary_config_1.deleteFiles)(fileToDelete);
            }
        }
        yield expense.save();
        yield session.commitTransaction();
        session.endSession();
        res.status(201).json({
            data: expense,
            success: true,
            status: 'success',
            message: 'Expense updated'
        });
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw new error_handler_middleware_1.CustomError((_a = error.message) !== null && _a !== void 0 ? _a : 'Fail to update expense', 500);
    }
}));
exports.getByUserId = (0, async_handler_utils_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user._id;
    const expenses = yield expense_model_1.default.find({ createdBy: userId });
    res.status(201).json({
        message: 'Expense by user Id',
        data: expense_model_1.default,
        success: true,
        status: 'success'
    });
}));
exports.getById = (0, async_handler_utils_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user._id;
    const { id } = req.params;
    const expense = yield expense_model_1.default.findOne({ _id: id, createdBy: userId }).populate('createdBy');
    if (!expense) {
        throw new error_handler_middleware_1.CustomError('Expense not found', 404);
    }
    res.status(201).json({
        message: 'Expense by user Id',
        data: expense_model_1.default,
        success: true,
        status: 'success'
    });
}));
exports.getAll = (0, async_handler_utils_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const expenses = yield category_model_1.default.find({});
    res.status(201).json({
        message: 'All expenses fetched',
        data: expenses,
        success: true,
        status: 'success'
    });
}));
exports.remove = (0, async_handler_utils_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const userId = req.user._id;
    // await Category.findOneAndDelete({_id:categoryId,user})
    const expense = yield expense_model_1.default.findById(id);
    if (!expense) {
        throw new error_handler_middleware_1.CustomError('Expense not found', 404);
    }
    if (expense.createdBy !== userId) {
        throw new error_handler_middleware_1.CustomError('Only owner can perform this operation', 400);
    }
    if (expense.receipts) {
        yield (0, cloudinary_config_1.deleteFiles)(expense.receipts.map(receipt => receipt.public_id));
    }
    yield expense.deleteOne();
    res.status(200).json({
        message: 'Expense deleted',
        success: true,
        status: 'success'
    });
}));
