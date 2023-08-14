import { NextFunction, Request, Response } from "express"
import { ZodSchema } from "zod"
import { flow, pipe } from "fp-ts/function"
import { E } from "../utils/fp-ts"
import { apiError, withStatus } from "../utils/error"

export const validateBody =
  <T>(schema: ZodSchema) =>
    (req: Request, res: Response, next: NextFunction) =>
      pipe(
        schema,
        (schema) =>
          E.tryCatch(
            () => schema.parse(req.body),
            flow(E.toError, apiError, withStatus(400)),
          ),
        E.fold(
          (err) => next(err),
          () => next(),
        ),
      )
