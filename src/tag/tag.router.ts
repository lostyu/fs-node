import { Router } from "express";
import { authGuard } from "../auth/auth.middleware";
import * as tagController from "./tag.controller";

const router = Router();

router.post("/tags", authGuard, tagController.store);

export default router;
