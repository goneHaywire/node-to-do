import { Request, Response } from "express"
import { ZodError, ZodSchema } from "zod"
import { pipe } from "fp-ts/function"
import { E, O, TE } from "../utils/fp-ts"
import { ApiError } from "../utils/error"

export const validateBody =
  <T>(schema: ZodSchema) =>
    (req: Request, res: Response, next: Function) =>
      pipe(
        schema,
        (schema) =>
          E.tryCatch<ZodError<T>, T>(
            () => schema.parse(req.body),
            (e) => e as ZodError,
          ),
        E.fold(
          (err) => next(new ApiError(400, err)),
          // (err) => res.status(400).send(err.message),
          (_) => next(),
        ),
      )

export const ifExistsById =
  (dbModel: any) => async (req: Request, res: Response, next: Function) => {
    const prismaQuery = (id: string) =>
      TE.tryCatch(
        () =>
          dbModel.findUniqueOrThrow({
            where: {
              id,
            },
          }),
        E.toError,
      )

    const getId = (val?: string) => O.fromNullable(val)

    return await pipe(
      req.params.id,
      TE.of,
      TE.map(getId),
      TE.chain(TE.fromOption(() => new ApiError(500))),
      TE.chainW(prismaQuery),
      TE.match(
        (err) => next(new ApiError(404, err)),
        () => next(),
      ),
    )()
  }

export const ifExists =
  (model: string) => (req: Request, res: Response, next: Function) => { }
