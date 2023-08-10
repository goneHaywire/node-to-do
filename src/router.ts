import { Router } from "express";
import { authRouter } from "./routers/auth";
import { taskRouter } from "./routers/tasks";
import { projectRouter } from "./routers/projects";
import { isOwner } from "./middleware/auth";

const normalRoutes = Router()
  .get("/", (req, res) => res.status(200).send("Hello World!"))
  .get("/protected", isOwner, (req, res) => res.send("you can see this"));

export default Router()
  .use(normalRoutes)
  .use(authRouter)
  .use(taskRouter)
  .use(projectRouter);
