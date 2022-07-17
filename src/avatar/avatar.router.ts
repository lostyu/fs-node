import { Router } from "express";
import { authGuard } from "../auth/auth.middleware";
import * as avatarController from "./avatar.controller";
import { avatarInterceptor, avatarProcess } from "./avatar.middleware";

const router = Router();
router.post(
  "/avatar",
  authGuard,
  avatarInterceptor,
  avatarProcess,
  avatarController.store
);

router.get("/users/:userId/avatar", avatarController.serve);

export default router;
