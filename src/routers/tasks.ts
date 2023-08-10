import { Request, Response, Router } from "express";
import { isAuth, isOwner } from "../middleware/auth";
import db from "../db";
import { ifExistsById } from "../middleware/validation";

const ifTaskExists = ifExistsById(db.task);
const ifUserExists = ifExistsById(db.user);

export const taskRouter = Router()
  .get("/tasks", ifTaskExists, () => {})
  .get("/tasks/:id", ifTaskExists, (req, res) => {
    res.sendStatus(200);
  })
  .get("/users/:id", ifUserExists, (req, res) => {
    res.sendStatus(200);
  })
  .post("/tasks", isAuth, () => {})
  .put("/tasks/:id", ifTaskExists, isOwner, (req: Request, res: Response) => {
    res.sendStatus(200);
  })
  .delete("/tasks/:id", ifTaskExists, isOwner, () => {});
