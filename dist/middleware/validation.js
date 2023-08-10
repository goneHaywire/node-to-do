"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ifExists = exports.ifExistsById = exports.validateBody = void 0;
const function_1 = require("fp-ts/function");
const fp_ts_1 = require("../utils/fp-ts");
const error_1 = require("../utils/error");
const validateBody = (schema) => (req, res, next) => (0, function_1.pipe)(schema, (schema) => fp_ts_1.E.tryCatch(() => schema.parse(req.body), (e) => e), fp_ts_1.E.fold((err) => next(new error_1.ApiError(400, err.message)), 
// (err) => res.status(400).send(err.message),
(_) => next()));
exports.validateBody = validateBody;
const ifExistsById = (dbModel) => async (req, res, next) => {
    const prismaQuery = (id) => fp_ts_1.TE.tryCatch(() => dbModel.findUniqueOrThrow({
        where: {
            id,
        },
    }), fp_ts_1.E.toError);
    const getId = (val) => fp_ts_1.O.fromNullable(val);
    const query = (0, function_1.pipe)(req.params.id, fp_ts_1.TE.of, fp_ts_1.TE.map(getId), fp_ts_1.TE.chain(fp_ts_1.TE.fromOption(() => new Error())), fp_ts_1.TE.chainW(prismaQuery));
    return fp_ts_1.E.isLeft(await query()) ? next(new error_1.ApiError(404)) : next();
};
exports.ifExistsById = ifExistsById;
const ifExists = (model) => (req, res, next) => { };
exports.ifExists = ifExists;
