import express from "express"
import { pipe } from "fp-ts/function"
import router from "./router"
import { applyMiddleware } from "./utils/middleware"
import cookieParser from "cookie-parser"
import { errorMiddleware } from "./middleware/error"

// TODO: setup these in a config manager
const PORT = process.env.PORT || 3000

const app = pipe(
  express(),
  applyMiddleware(express.json()),
  applyMiddleware(cookieParser(process.env.JWT_SECRET)),
  applyMiddleware(express.urlencoded({ extended: true })),
  applyMiddleware(router),
  applyMiddleware(errorMiddleware),
)

app.listen(PORT, () => {
  console.log("Started server on", PORT)
})
