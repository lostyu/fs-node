import { Router } from "express";
import * as userController from "./user.controller";

const router = Router();

router.post("/users", userController.store);

export default router;
