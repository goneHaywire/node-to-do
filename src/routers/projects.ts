import { Router } from "express";
import { isAuth, isOwner } from "../middleware/auth";
import db from "../db";
import { createProjectSchema } from "../models/project";
import {
  createProject,
  deleteProject,
  getProject,
  getProjects,
  updateProject,
} from "../handlers/projects";
import { ifExistsById, validateBody } from "../middleware/validation";

const ifProjectExists = ifExistsById(db.project);

export const projectRouter = Router()
  .get("/projects", getProjects)
  .get("/projects/:id", ifProjectExists, getProject)
  .post("/projects", validateBody(createProjectSchema), isAuth, createProject)
  .put("/projects/:id", ifProjectExists, isOwner, updateProject)
  .delete("/projects/:id", ifProjectExists, isOwner, deleteProject);
