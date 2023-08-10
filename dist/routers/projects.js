"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectRouter = void 0;
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const db_1 = __importDefault(require("../db"));
const project_1 = require("../models/project");
const projects_1 = require("../handlers/projects");
const validation_1 = require("../middleware/validation");
const ifProjectExists = (0, validation_1.ifExistsById)(db_1.default.project);
exports.projectRouter = (0, express_1.Router)()
    .get("/projects", projects_1.getProjects)
    .get("/projects/:id", ifProjectExists, projects_1.getProject)
    .post("/projects", (0, validation_1.validateBody)(project_1.createProjectSchema), auth_1.isAuth, projects_1.createProject)
    .put("/projects/:id", ifProjectExists, auth_1.isOwner, projects_1.updateProject)
    .delete("/projects/:id", ifProjectExists, auth_1.isOwner, projects_1.deleteProject);
