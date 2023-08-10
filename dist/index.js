"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const function_1 = require("fp-ts/function");
const router_1 = __importDefault(require("./router"));
const middleware_1 = require("./utils/middleware");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const error_1 = require("./middleware/error");
// TODO: setup these in a config manager
const PORT = process.env.PORT || 3000;
const app = (0, function_1.pipe)((0, express_1.default)(), (0, middleware_1.applyMiddleware)(express_1.default.json()), (0, middleware_1.applyMiddleware)((0, cookie_parser_1.default)(process.env.JWT_SECRET)), (0, middleware_1.applyMiddleware)(express_1.default.urlencoded({ extended: true })), (0, middleware_1.applyMiddleware)(router_1.default), (0, middleware_1.applyMiddleware)(error_1.errorMiddleware));
app.listen(PORT, () => {
    console.log("Started server on", PORT);
});
