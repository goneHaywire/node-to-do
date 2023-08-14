import { Response } from "express"
import { identity } from "ramda"

export const ERRORS = {
  OK: {
    code: 200,
    message: "OK",
  },
  CREATED: {
    code: 201,
    message: "Created",
  },
  BAD_REQUEST: {
    code: 400,
    message: "Bad Request",
  },
  UNAUTHORIZED: {
    code: 401,
    message: "Unauthorized",
  },
  FORBIDDEN: {
    code: 403,
    message: "Forbidden",
  },
  NOT_FOUND: {
    code: 404,
    message: "Not Found",
  },
  SERVER_ERROR: {
    code: 500,
    message: "Internal Server Error",
  },
}

export class ApiError extends Error {
  public statusCode: number = 500
  public responseCallback: (res: Response) => Response = identity

  constructor(errOrMessage: Error | ApiError | keyof typeof ERRORS) {
    if (process.env.NODE_ENV === "development")
      console.error("ERROR:", errOrMessage)
    if (errOrMessage instanceof ApiError) return errOrMessage

    super(
      errOrMessage instanceof Error
        ? errOrMessage.message
        : ERRORS[errOrMessage].message,
    )

    if (errOrMessage instanceof Error) {
      this.message = errOrMessage.message
      return this
    }

    this.statusCode = ERRORS[errOrMessage].code
  }

  setStatusCode(newStatusCode: ApiError["statusCode"]) {
    this.statusCode = newStatusCode
    return this
  }

  setResponseCallback(newCallback: ApiError["responseCallback"]) {
    this.responseCallback = newCallback
    return this
  }

  setMessage(newMessage: ApiError["message"]) {
    this.message = newMessage
    return this
  }
}
