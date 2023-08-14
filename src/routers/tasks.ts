import { Request, Response, Router } from "express"
import { isAuth } from "../middleware/auth"
import {
  createTask,
  deleteTask,
  getTask,
  getTasks,
  updateTask,
} from "../handlers/tasks"
import { validateBody } from "../middleware/validation"
import { createTaskSchema, updateTaskSchema } from "../models/task"

export const taskRouter = Router()
  .get("/tasks", getTasks)
  .get("/tasks/:id", getTask)
  .post("/tasks", isAuth, validateBody(createTaskSchema), createTask)
  .put("/tasks/:id", isAuth, validateBody(updateTaskSchema), updateTask)
  .delete("/tasks/:id", isAuth, deleteTask)
