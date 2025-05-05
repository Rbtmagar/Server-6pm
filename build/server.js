"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const database_config_1 = require("./config/database.config");
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const error_handler_middleware_1 = require("./middlewares/error-handler.middleware");
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const category_routes_1 = __importDefault(require("./routes/category.routes"));
const expense_routes_1 = __importDefault(require("./routes/expense.routes"));
const app = (0, express_1.default)();
const PORT = process.env.PORT;
const DB_URI = process.env.DB_URI || '';
(0, database_config_1.connectDatabase)(DB_URI);
// using middlewares
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: '*'
}));
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.use('/api/uploads', express_1.default.static('uploads/'));
//using routes
app.use('/api/user', user_routes_1.default);
app.use('api/category', category_routes_1.default);
app.use('api/expense', expense_routes_1.default);
// catch all route for undefined routes
app.use('*spalt', (req, res, next) => {
    const message = `Cannot ${req.method} on ${req.url}`;
    const error = new error_handler_middleware_1.CustomError(message, 404);
    next(error);
});
app.listen(PORT, () => {
    console.log(`Server is running at ${PORT}`);
});
// Global error handler
app.use(error_handler_middleware_1.errorHandler);
