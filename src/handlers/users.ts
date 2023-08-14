import { User } from "@prisma/client"
import { NextFunction, Request, Response } from "express"
import { pipe } from "fp-ts/function"
import jwt from "jsonwebtoken"
import * as bcrypt from "bcrypt"
import db from "../db"
import { z } from "zod"
import { loginSchema, registerSchema } from "../models/user"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"
import { apiError, toPrismaErr, withMessage } from "../utils/error"
import { IO, T, TE } from "../utils/fp-ts"

const signJWT =
  (userId: User["id"]): IO.IO<string> =>
    () =>
      jwt.sign({ id: userId }, process.env.JWT_SECRET as string)

const hashPassword = (password: string) => () => bcrypt.hash(password, 5)

const compareHashes =
  (password: string, hash: string): T.Task<boolean> =>
    () =>
      bcrypt.compare(password, hash)

const createUserinDB = (user: z.infer<typeof registerSchema>) =>
  TE.tryCatch(
    () =>
      db.user.create({
        data: user,
      }),
    toPrismaErr,
  )

const getUserFromDB = (username: string) =>
  TE.tryCatch(
    () =>
      db.user.findUniqueOrThrow({
        where: {
          username,
        },
      }),
    toPrismaErr,
  )

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) =>
  await pipe(
    { user: req.body as z.infer<typeof registerSchema> },
    TE.right,
    TE.bind("hashedPassword", ({ user }) =>
      TE.fromTask(hashPassword(user.password)),
    ),
    TE.chain(({ hashedPassword, user }) =>
      createUserinDB({ ...user, password: hashedPassword }),
    ),
    TE.chain((user) => TE.fromIO(signJWT(user.id))),
    TE.match(
      (e) => next(e),
      (token) => res.cookie("token", token).status(201).send({ data: token }),
    ),
  )()

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) =>
  await pipe(
    { payload: req.body as z.infer<typeof loginSchema> },
    TE.right,
    TE.bind("user", ({ payload }) => getUserFromDB(payload.username)),
    TE.mapLeft((e) =>
      e instanceof PrismaClientKnownRequestError && e.code === "P2025"
        ? pipe(apiError("UNAUTHORIZED"), withMessage("Invalid Credentials"))
        : e,
    ),
    TE.bind("isMatch", ({ payload, user }) =>
      TE.fromTask(compareHashes(payload.password, user.password)),
    ),
    TE.chain(({ isMatch, user }) =>
      isMatch
        ? TE.right(user.id)
        : TE.left(
          pipe(apiError("UNAUTHORIZED"), withMessage("Invalid Credentials")),
        ),
    ),
    TE.chain((userId) => TE.fromIO(signJWT(userId))),
    TE.match(
      (e) => next(e),
      (token) => res.cookie("token", token).send({ data: token }),
    ),
  )()

export const logoutUser = (req: Request, res: Response, next: NextFunction) =>
  res.status(200).clearCookie("token").send({ data: "Logged out" })
