import { NextFunction, Request, Response } from "express"
import { pipe } from "fp-ts/lib/function"
import { E } from "../utils/fp-ts"
import {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
  PrismaClientValidationError,
} from "@prisma/client/runtime/library"
import { ApiError } from "../models/ApiError"
import { apiError, withMessage, withStatus } from "../utils/error"

export const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {

  return pipe(
    err instanceof ApiError ? E.left(err) : E.right(err),
    E.chain(prismaErrorHandlerModule),
    // TODO: here be all kinds of small error handling modules
    E.match(
      (e) =>
        e.responseCallback(res).status(e.statusCode).send({ error: e.message }),
      (e: any) =>
        res.status(e?.status || 500).send({
          error: e?.name || e?.body || "Unknown Exception",
        }),
    ),
  )
}
export const prismaErrorHandlerModule = (
  e: Error,
): E.Either<ApiError, Error> => {
  console.log("E:", e)
  if (
    !(e instanceof PrismaClientUnknownRequestError) &&
    !(e instanceof PrismaClientValidationError) &&
    !(e instanceof PrismaClientKnownRequestError)
  )
    return E.right(e)

  return pipe(
    e,
    E.right,
    E.chain((e) =>
      e instanceof PrismaClientValidationError
        ? E.left(pipe(apiError(e), withStatus(400)))
        : E.right(e),
    ),
    E.chain((e) =>
      e instanceof PrismaClientUnknownRequestError
        ? E.left(pipe(e, apiError, withStatus(500)))
        : E.right(e),
    ),
    E.chain((e) =>
      e.code === "P2025"
        ? E.left(pipe(e, apiError, withStatus(404)))
        : E.right(e),
    ),
    E.chain((e) =>
      e.code === "P2002"
        ? E.left(
          pipe(
            apiError("BAD_REQUEST"),
            withMessage("Unique Constraint Error"),
          ),
        )
        : E.right(e),
    ),
    E.chain((e) =>
      e.code === "P2003"
        ? E.left(
          pipe(
            apiError("BAD_REQUEST"),
            withMessage("Foreign Key Constraint Error"),
          ),
        )
        : E.right(e),
    ),
  )
}
