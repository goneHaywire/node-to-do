import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/error";

export const errorMiddleware = (
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => err.responseCallback(res).status(err.statusCode).send(err.message);
