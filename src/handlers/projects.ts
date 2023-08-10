import { NextFunction, Request, Response } from "express"
import { pipe } from "fp-ts/lib/function"
import db from "../db"
import { E, O, TE } from "../utils/fp-ts"
import { ApiError } from "../utils/error"

export const getProjects = (req: Request, res: Response, next: NextFunction) =>
  pipe(
    TE.tryCatch(() => db.project.findMany(), E.toError),
    TE.match(
      (err) => next(new ApiError(500, err)),
      (result) => res.send(result),
    ),
  )()

export const getProject = (req: Request, res: Response, next: NextFunction) =>
  pipe(
    req.params.id,
    TE.of,
    TE.map(O.fromNullable),
    TE.chain(TE.fromOption(() => new Error())),
    TE.chainW((id) =>
      TE.tryCatch(
        () => db.project.findUniqueOrThrow({ where: { id } }),
        E.toError,
      ),
    ),
    TE.match(
      (err) => next(new ApiError(500, err)),
      (val) => res.send(val),
    ),
  )()

export const createProject = (req: Request, res: Response) =>
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
        E.toError,
      ),
    ),
    TE.match(
      (e) => res.status(400).send(e),
      (val) => res.status(201).send(val),
    ),
  )()

export const updateProject = (req: Request, res: Response) => { }

export const deleteProject = (req: Request, res: Response) => { }
