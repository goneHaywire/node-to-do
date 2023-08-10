"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.registerUser = void 0;
const function_1 = require("fp-ts/function");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt = __importStar(require("bcrypt"));
const TE = __importStar(require("fp-ts/lib/TaskEither"));
const T = __importStar(require("fp-ts/lib/Task"));
const db_1 = __importDefault(require("../db"));
const signJWT = (userId) => () => jsonwebtoken_1.default.sign({ id: userId }, process.env.JWT_SECRET);
const hashPassword = (password) => T.of(bcrypt.hash(password, 5));
const compareHashes = (password, hash) => () => bcrypt.compare(password, hash);
const createUserinDB = (user) => TE.tryCatch(() => db_1.default.user.create({
    data: user,
}), (_) => 403);
const getUserFromDB = (username) => TE.tryCatch(
// () => Promise.resolve({ username, password: "password" }),
() => db_1.default.user.findUniqueOrThrow({
    where: {
        username,
    },
}), (_) => 404);
const registerUser = (req, res) => (0, function_1.pipe)(req.body, TE.right, TE.bind("hashedPassword", (user) => TE.fromTask(hashPassword(user.password))), TE.chain(({ hashedPassword }) => createUserinDB({ ...req.body, password: hashedPassword })), TE.chain((user) => TE.fromIO(signJWT(user.id))), TE.match((e) => res.sendStatus(e), (token) => res.cookie("token", token).status(201).send(token)))();
exports.registerUser = registerUser;
const loginUser = async (req, res) => {
    const { username, password } = req.body;
    return await (0, function_1.pipe)(username, TE.right, TE.bindW("user", getUserFromDB), TE.bindW("isMatch", ({ user }) => TE.fromTask(compareHashes(password, user.password))), TE.chain(({ isMatch, user }) => (isMatch ? TE.right(user) : TE.left(401))), TE.chain((user) => TE.fromIO(signJWT(user.id))), TE.match((e) => res.clearCookie("token").sendStatus(e), (token) => res.cookie("token", token).send(token)))();
};
exports.loginUser = loginUser;
