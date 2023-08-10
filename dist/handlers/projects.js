"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProject = exports.updateProject = exports.createProject = exports.getProject = exports.getProjects = void 0;
const function_1 = require("fp-ts/lib/function");
const db_1 = __importDefault(require("../db"));
const fp_ts_1 = require("../utils/fp-ts");
const error_1 = require("../utils/error");
const getProjects = (req, res, next) => (0, function_1.pipe)(fp_ts_1.TE.tryCatch(() => db_1.default.project.findMany(), fp_ts_1.E.toError), fp_ts_1.TE.match(
// res.sendStatus(500).send(err),
(err) => next(new error_1.ApiError(500, err)), (result) => res.send(result)))();
exports.getProjects = getProjects;
const getProject = (req, res, next) => (0, function_1.pipe)(req.params.id, fp_ts_1.TE.of, fp_ts_1.TE.map(fp_ts_1.O.fromNullable), fp_ts_1.TE.chain(fp_ts_1.TE.fromOption(() => new Error())), fp_ts_1.TE.chainW((id) => fp_ts_1.TE.tryCatch(() => db_1.default.project.findUniqueOrThrow({ where: { id } }), fp_ts_1.E.toError)), fp_ts_1.TE.match((err) => next(new error_1.ApiError(500, err)), (val) => res.send(val)))();
exports.getProject = getProject;
const createProject = (req, res) => (0, function_1.pipe)(req.body, fp_ts_1.TE.of, fp_ts_1.TE.chain((data) => fp_ts_1.TE.tryCatch(() => db_1.default.project.create({
    data: {
        ...data,
        userId: req.userId,
    },
}), fp_ts_1.E.toError)), fp_ts_1.TE.match((e) => res.status(400).send(e), (val) => res.status(201).send(val)))();
exports.createProject = createProject;
const updateProject = (req, res) => { };
exports.updateProject = updateProject;
const deleteProject = (req, res) => { };
exports.deleteProject = deleteProject;
