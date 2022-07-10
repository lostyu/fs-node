import { Router } from "express";
import * as userController from "./user.controller";
import { validateUserData, hashPassword } from "./user.middleware";

const router = Router();

router.post("/users", validateUserData, hashPassword, userController.store);

export default router;
