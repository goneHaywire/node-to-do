import { NextFunction, Request, Response } from "express"
import { flow, pipe } from "fp-ts/lib/function"
import db from "../db"
import { E, O, TE } from "../utils/fp-ts"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"
import { apiError, toPrismaErr, withMessage } from "../utils/error"

export const getProjects = (req: Request, res: Response, next: NextFunction) =>
  pipe(
    TE.tryCatch(() => db.project.findMany(), E.toError),
    TE.match(
      (err) => next(err),
      (result) => res.send(result),
    ),
  )()

export const getProject = (req: Request, res: Response, next: NextFunction) =>
  pipe(
    req.params.id,
    TE.of,
    TE.map(O.fromNullable),
    TE.chain(TE.fromOption(() => apiError("NOT_FOUND"))),
    TE.chainW((id) =>
      TE.tryCatch(
        () => db.project.findUniqueOrThrow({ where: { id } }),
        toPrismaErr,
      ),
    ),
    TE.match(
      (err) => next(err),
      (val) => res.send(val),
    ),
  )()

export const createProject = (
  req: Request,
  res: Response,
  next: NextFunction,
) =>
  pipe(
    req.body,
    TE.of,
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
    req.body,
    TE.of,
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
    req.params.id,
    TE.of,
    TE.chain((id) =>
      TE.tryCatch(
        () =>
          db.project.delete({
            where: {
              id,
              userId: req.userId,
            },
          }),
        toPrismaErr,
      ),
    ),
    TE.match(
      (e) => next(e),
      (data) => res.send(data),
    ),
  )()
