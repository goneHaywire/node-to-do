import { User, UserPayload } from "@prisma/client";
import { Request, Response } from "express";
import { pipe } from "fp-ts/function";
import jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";
import * as TE from "fp-ts/lib/TaskEither";
import * as T from "fp-ts/lib/Task";
import db from "../db";
import { z } from "zod";
import { registerSchema } from "../models/user";

const signJWT = (userId: User["id"]) => () =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET as string);

const hashPassword = (password: string) => T.of(bcrypt.hash(password, 5));

const compareHashes =
  (password: string, hash: string): T.Task<boolean> =>
    () =>
      bcrypt.compare(password, hash);

const createUserinDB = (user: any) =>
  TE.tryCatch(
    () =>
      db.user.create({
        data: user,
      }),
    (_) => 403
  );

const getUserFromDB = (username: string) =>
  TE.tryCatch(
    // () => Promise.resolve({ username, password: "password" }),
    () =>
      db.user.findUniqueOrThrow({
        where: {
          username,
        },
      }),
    (_) => 404
  );

export const registerUser = (req: Request, res: Response) =>
  pipe(
    req.body as z.infer<typeof registerSchema>,
    TE.right,
    TE.bind("hashedPassword", (user) =>
      TE.fromTask(hashPassword(user.password))
    ),
    TE.chain(({ hashedPassword }) =>
      createUserinDB({ ...req.body, password: hashedPassword })
    ),
    TE.chain((user) => TE.fromIO(signJWT(user.id))),
    TE.match(
      (e) => res.sendStatus(e),
      (token) => res.cookie("token", token).status(201).send(token)
    )
  )();

export const loginUser = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  return await pipe(
    username as string,
    TE.right,
    TE.bindW("user", getUserFromDB),
    TE.bindW("isMatch", ({ user }) =>
      TE.fromTask(compareHashes(password, user.password))
    ),
    TE.chain(({ isMatch, user }) => (isMatch ? TE.right(user) : TE.left(401))),
    TE.chain((user) => TE.fromIO(signJWT(user.id))),
    TE.match(
      (e) => res.clearCookie("token").sendStatus(e),
      (token) => res.cookie("token", token).send(token)
    )
  )();
};
