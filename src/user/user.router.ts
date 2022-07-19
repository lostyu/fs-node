import { Router } from "express";
import * as userController from "./user.controller";
import { validateUserData, hashPassword } from "./user.middleware";

const router = Router();

router.post("/users", validateUserData, hashPassword, userController.store);
router.get("/users/:userId", userController.show);

export default router;
