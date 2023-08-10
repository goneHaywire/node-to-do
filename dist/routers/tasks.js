"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskRouter = void 0;
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const db_1 = __importDefault(require("../db"));
const validation_1 = require("../middleware/validation");
const ifTaskExists = (0, validation_1.ifExistsById)(db_1.default.task);
const ifUserExists = (0, validation_1.ifExistsById)(db_1.default.user);
exports.taskRouter = (0, express_1.Router)()
    .get("/tasks", ifTaskExists, () => { })
    .get("/tasks/:id", ifTaskExists, (req, res) => {
    res.sendStatus(200);
})
    .get("/users/:id", ifUserExists, (req, res) => {
    res.sendStatus(200);
})
    .post("/tasks", auth_1.isAuth, () => { })
    .put("/tasks/:id", ifTaskExists, auth_1.isOwner, (req, res) => {
    res.sendStatus(200);
})
    .delete("/tasks/:id", ifTaskExists, auth_1.isOwner, () => { });
