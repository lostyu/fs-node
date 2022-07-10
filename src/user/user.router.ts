import { Router } from "express";
import * as userController from "./user.controller";
import { validateUserData } from "./user.middleware";

const router = Router();

router.post("/users", validateUserData, userController.store);

export default router;
