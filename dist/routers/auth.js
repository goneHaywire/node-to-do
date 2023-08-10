"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const users_1 = require("../handlers/users");
const user_1 = require("../models/user");
const validation_1 = require("../middleware/validation");
exports.authRouter = (0, express_1.Router)()
    .post("/register", auth_1.isGuest, (0, validation_1.validateBody)(user_1.registerSchema), users_1.registerUser)
    .post("/login", auth_1.isGuest, (0, validation_1.validateBody)(user_1.loginSchema), users_1.loginUser);
