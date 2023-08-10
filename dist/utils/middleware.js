"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyMiddleware = void 0;
const applyMiddleware = (middleware) => (router) => router.use(middleware);
exports.applyMiddleware = applyMiddleware;
