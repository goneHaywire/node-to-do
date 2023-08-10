"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiError = void 0;
const ramda_1 = require("ramda");
class ApiError extends Error {
    constructor(statusCode = 500, err = "", responseCallback = ramda_1.identity) {
        super(typeof err === "string" ? err : err.message);
        this.statusCode = statusCode;
        this.err = err;
        this.responseCallback = responseCallback;
        this.statusCode = statusCode;
        this.responseCallback = responseCallback;
    }
}
exports.ApiError = ApiError;
