"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = void 0;
const errorMiddleware = (err, req, res, next) => err.responseCallback(res).status(err.statusCode).send(err.message);
exports.errorMiddleware = errorMiddleware;
