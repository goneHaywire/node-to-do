import {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
  PrismaClientValidationError,
} from "@prisma/client/runtime/library"
import { ApiError, ERRORS } from "../models/ApiError"

export const apiError = (
  shortStatusOrErr: keyof typeof ERRORS | Error | ApiError,
) => {
  return new ApiError(shortStatusOrErr)
}

export const withStatus =
  (statusCode: ApiError["statusCode"]) =>
    (err: ApiError): ApiError => {
      err.setStatusCode(statusCode)
      return err
    }

export const withHandler =
  (responseCallback: ApiError["responseCallback"]) =>
    (err: ApiError): ApiError => {
      err.setResponseCallback(responseCallback)
      return err
    }

export const withMessage =
  (newMessage: ApiError["message"]) =>
    (err: ApiError): ApiError => {
      err.setMessage(newMessage)
      return err
    }

export const toPrismaErr = (e: unknown) =>
  e as
  | PrismaClientKnownRequestError
  | PrismaClientValidationError
  | PrismaClientUnknownRequestError
