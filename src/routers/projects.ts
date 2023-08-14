import { Router } from "express"
import { isAuth } from "../middleware/auth"
import { createProjectSchema } from "../models/project"
import {
  createProject,
  deleteProject,
  getProject,
  getProjects,
  updateProject,
} from "../handlers/projects"
import { validateBody } from "../middleware/validation"

export const projectRouter = Router()
  .get("/projects", getProjects)
  .get("/projects/:id", getProject)
  .post("/projects", isAuth, validateBody(createProjectSchema), createProject)
  .put("/projects/:id", isAuth, updateProject)
  .delete("/projects/:id", isAuth, deleteProject)
