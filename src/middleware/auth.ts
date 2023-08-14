import { NextFunction, Request, Response, Router } from "express"
import { flow, pipe } from "fp-ts/function"
import jwt, { JwtPayload } from "jsonwebtoken"
import { E, O } from "../utils/fp-ts"
import { split, prop, __ } from "ramda"
import { apiError, withHandler, withMessage } from "../utils/error"

const getAuthCookie = (req: Request) =>
  pipe(req.cookies.token as string, O.fromNullable)

const getAuthHeader = (req: Request) =>
  pipe(
    req.headers.authorization,
    O.fromNullable,
    O.map(flow(split(" "), prop(1))),
  )

export const isAuth = (req: Request, res: Response, next: NextFunction) =>
  pipe(
    getAuthCookie(req),
    // getAuthHeader(req),
    E.fromOption(() => pipe(apiError("UNAUTHORIZED"))),
    E.chain((token) =>
      E.tryCatch(
        () => jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload,
        () =>
          pipe(
            apiError("UNAUTHORIZED"),
            withHandler((res) => res.clearCookie("token")),
          ),
      ),
    ),
    E.tap((token) => {
      req.userId = token.id
      return E.right(token)
    }),
    E.match(
      (e) => next(e),
      () => next(),
    ),
  )

export const isGuest = (req: Request, res: Response, next: NextFunction) =>
  pipe(
    getAuthCookie(req),
    // getAuthHeader(req),
    O.match(
      () => next(),
      () => next(pipe(apiError("FORBIDDEN"), withMessage("Already logged in"))),
    ),
  )
