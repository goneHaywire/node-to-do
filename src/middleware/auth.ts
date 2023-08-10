import { Request, Response, Router } from "express";
import { flow, pipe } from "fp-ts/function";
import jwt, { JwtPayload } from "jsonwebtoken";
import { E, O } from "../utils/fp-ts";
import { applyMiddleware } from "../utils/middleware";
import { split, prop } from "ramda";
import { ApiError } from "../utils/error";

const getAuthCookie = (req: Request) =>
  pipe(req.cookies.token as string, O.fromNullable);

const getAuthHeader = (req: Request) =>
  pipe(
    req.headers.authorization,
    O.fromNullable,
    O.map(flow(split(" "), prop(0)))
  );

export const isAuth = (req: Request, res: Response, next: Function) =>
  pipe(
    getAuthCookie(req),
    E.fromOption(() => new ApiError(401)),
    E.chain((token) =>
      E.tryCatch(
        () => jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload,
        () => new ApiError(401, undefined, (res) => res.clearCookie("token"))
      )
    ),
    E.tap((token) => {
      req.userId = token.id;
      return E.right(token);
    }),
    E.match(
      (e) => next(e),
      () => next()
    )
  );

export const isGuest = (req: Request, res: Response, next: Function) =>
  pipe(
    getAuthCookie(req),
    O.match(
      () => next(),
      () => next(new ApiError(403))
    )
  );

export const isOwner = pipe(
  Router(),
  applyMiddleware(isAuth),
  applyMiddleware((req: Request, res: Response) =>
    res.send("do ktheje 200 po te bejn match userIds")
  )
);
