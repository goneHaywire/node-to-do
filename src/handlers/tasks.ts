import { NextFunction, Request, Response } from "express"
import { pipe } from "fp-ts/lib/function"
import { TE } from "../utils/fp-ts"
import db from "../db"
import { toPrismaErr } from "../utils/error"
import { z } from "zod"
import { createTaskSchema } from "../models/task"

export const getTasks = async (
  req: Request,
  res: Response,
  next: NextFunction,
) =>
  await pipe(
    TE.tryCatch(() => db.task.findMany(), toPrismaErr),
    TE.match(
      (e) => next(e),
      (tasks) => res.send(tasks),
    ),
  )()

export const getTask = async (
  req: Request,
  res: Response,
  next: NextFunction,
) =>
  await pipe(
    req.params.id as string,
    TE.right,
    TE.chain((id) =>
      TE.tryCatch(
        () =>
          db.task.findUniqueOrThrow({
            where: {
              id,
            },
          }),
        toPrismaErr,
      ),
    ),
    TE.match(
      (e) => next(e),
      (task) => res.send(task),
    ),
  )()

export const createTask = async (
  req: Request,
  res: Response,
  next: NextFunction,
) =>
  await pipe(
    req.body as z.infer<typeof createTaskSchema>,
    TE.of,
    TE.chain((data) =>
      TE.tryCatch(
        () =>
          db.task.create({
            data,
          }),
        toPrismaErr,
      ),
    ),
    TE.match(
      (e) => next(e),
      (data) => res.status(201).send({ data }),
    ),
  )()

export const updateTask = async (
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
          db.task.update({
            data,
            where: {
              id: req.params.id,
            },
          }),
        toPrismaErr,
      ),
    ),
    TE.match(
      (e) => next(e),
      (data) => res.send({ data }),
    ),
  )()

export const deleteTask = async (
  req: Request,
  res: Response,
  next: NextFunction,
) =>
  await pipe(
    req.params.id as string,
    TE.of,
    TE.chain((id) =>
      TE.tryCatch(
        () =>
          db.task.delete({
            where: {
              id,
            },
          }),
        toPrismaErr,
      ),
    ),
    TE.match(
      (e) => next(e),
      (data) => res.send({ data }),
    ),
  )()
