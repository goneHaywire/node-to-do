import { Request, Response, Router } from "express"
import { isAuth } from "../middleware/auth"

export const taskRouter = Router()
  .get("/tasks", () => { })
  .get("/tasks/:id", (req, res) => {
    res.sendStatus(200)
  })
  .get("/users/:id", (req, res) => {
    res.sendStatus(200)
  })
  .post("/tasks", isAuth, () => { })
  .put("/tasks/:id", (req: Request, res: Response) => {
    res.sendStatus(200)
  })
  .delete("/tasks/:id", () => { })
