import { Router } from "express"
import { isAuth, isGuest } from "../middleware/auth"
import { loginUser, logoutUser, registerUser } from "../handlers/users"
import { loginSchema, registerSchema } from "../models/user"
import { validateBody } from "../middleware/validation"

export const authRouter = Router()
  .post("/register", isGuest, validateBody(registerSchema), registerUser)
  .post("/login", isGuest, validateBody(loginSchema), loginUser)
  .get("/logout", isAuth, logoutUser)
