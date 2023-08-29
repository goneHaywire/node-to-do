import { NextFunction, Request, Response } from "express"
import { pipe } from "fp-ts/lib/function"
import db from "../db"
import { E, TE } from "../utils/fp-ts"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"
import { apiError, toPrismaErr, withMessage } from "../utils/error"

export const getProjects = async (
  req: Request,
  res: Response,
  next: NextFunction,
) =>
  await pipe(
    TE.tryCatch(() => db.project.findMany(), E.toError),
    TE.match(
      (err) => next(err),
      (result) => res.send(result),
    ),
  )()

export const getProject = async (
  req: Request,
  res: Response,
  next: NextFunction,
) =>
  await pipe(
    TE.tryCatch(
      () => db.project.findUnique({ where: { id: req.params.id } }),
      () => apiError("SERVER_ERROR"),
    ),
    TE.chain((maybeUser) =>
      maybeUser ? TE.right(maybeUser) : TE.left(apiError("NOT_FOUND")),
    ),
    TE.match(
      (err) => next(err),
      (val) => res.send(val),
    ),
  )()

export const createProject = async (
  req: Request,
  res: Response,
  next: NextFunction,
) =>
  await pipe(
    TE.of(req.body),
    TE.chain((data) =>
      TE.tryCatch(
        () =>
          db.project.create({
            data: {
              ...data,
              userId: req.userId,
            },
          }),
        toPrismaErr,
      ),
    ),
    TE.match(
      (e) => next(e),
      (val) => res.status(201).send(val),
    ),
  )()

export const updateProject = async (
  req: Request,
  res: Response,
  next: NextFunction,
) =>
  await pipe(
    TE.of(req.body),
    TE.chain((data) =>
      TE.tryCatch(
        () =>
          db.project.update({
            data,
            where: {
              id: req.params.id,
              userId: req.userId,
            },
          }),
        (e) =>
          pipe(e, toPrismaErr, (e) =>
            e instanceof PrismaClientKnownRequestError && e.code === "P2025"
              ? pipe(apiError("FORBIDDEN"), withMessage("sje i zoti i punes"))
              : e,
          ),
      ),
    ),
    TE.match(
      (e) => next(e),
      (data) => {
        console.log(data)
        res.send(data)
      },
    ),
  )()

export const deleteProject = async (
  req: Request,
  res: Response,
  next: NextFunction,
) =>
  await pipe(
    TE.tryCatch(
      () =>
        db.project.delete({
          where: {
            id: req.params.id,
            userId: req.userId,
          },
        }),
      toPrismaErr,
    ),
    TE.match(
      (e) => next(e),
      (data) => res.send(data),
    ),
  )()
