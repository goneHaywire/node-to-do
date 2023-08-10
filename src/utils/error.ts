import { Response } from "express";
import { identity } from "ramda";
import { ZodError } from "zod";

export class ApiError extends Error {
  constructor(
    public readonly statusCode: number = 500,
    public readonly err: Error | ZodError | string = "",
    public readonly responseCallback: (res: Response) => Response = identity
  ) {
    super(typeof err === "string" ? err : err.message);
    this.statusCode = statusCode;
    this.responseCallback = responseCallback;
  }
}
