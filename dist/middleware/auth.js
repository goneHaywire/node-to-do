"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isOwner = exports.isGuest = exports.isAuth = void 0;
const express_1 = require("express");
const function_1 = require("fp-ts/function");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const fp_ts_1 = require("../utils/fp-ts");
const middleware_1 = require("../utils/middleware");
const ramda_1 = require("ramda");
const error_1 = require("../utils/error");
const getAuthCookie = (req) => (0, function_1.pipe)(req.cookies.token, fp_ts_1.O.fromNullable);
const getAuthHeader = (req) => (0, function_1.pipe)(req.headers.authorization, fp_ts_1.O.fromNullable, fp_ts_1.O.map((0, function_1.flow)((0, ramda_1.split)(" "), (0, ramda_1.prop)(0))));
const isAuth = (req, res, next) => (0, function_1.pipe)(getAuthCookie(req), fp_ts_1.E.fromOption(() => new error_1.ApiError(401)), fp_ts_1.E.chain((token) => fp_ts_1.E.tryCatch(() => jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET), () => new error_1.ApiError(401, undefined, (res) => res.clearCookie("token")))), fp_ts_1.E.tap((token) => {
    req.userId = token.id;
    return fp_ts_1.E.right(token);
}), fp_ts_1.E.match((e) => next(e), () => next()));
exports.isAuth = isAuth;
const isGuest = (req, res, next) => (0, function_1.pipe)(getAuthCookie(req), fp_ts_1.O.match(() => next(), () => next(new error_1.ApiError(403))));
exports.isGuest = isGuest;
exports.isOwner = (0, function_1.pipe)((0, express_1.Router)(), (0, middleware_1.applyMiddleware)(exports.isAuth), (0, middleware_1.applyMiddleware)((req, res) => res.send("do ktheje 200 po te bejn match userIds")));
