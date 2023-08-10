"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("./routers/auth");
const tasks_1 = require("./routers/tasks");
const projects_1 = require("./routers/projects");
const auth_2 = require("./middleware/auth");
const normalRoutes = (0, express_1.Router)()
    .get("/", (req, res) => res.status(200).send("Hello World!"))
    .get("/protected", auth_2.isOwner, (req, res) => res.send("you can see this"));
exports.default = (0, express_1.Router)()
    .use(normalRoutes)
    .use(auth_1.authRouter)
    .use(tasks_1.taskRouter)
    .use(projects_1.projectRouter);
