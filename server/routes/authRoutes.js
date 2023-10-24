import express from "express";

import { login, register } from "../controllers/authControllers.js";

const authRoutes = express.Router();

authRoutes.post("/register", register);
authRoutes.post("/login", login);

export { authRoutes };
