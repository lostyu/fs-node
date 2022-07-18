import { Router } from "express";
import { authGuard, accessControl } from "../auth/auth.middleware";
import * as commentController from "./comment.controller";
import { filter } from "./comment.middleware";

const router = Router();

router.post("/comments", authGuard, commentController.store);

router.post("/comments/:commentId/reply", authGuard, commentController.reply);

router.patch(
  "/comments/:commentId",
  authGuard,
  accessControl({ possession: true }),
  commentController.update
);

router.delete(
  "/comments/:commentId",
  authGuard,
  accessControl({ possession: true }),
  commentController.destroy
);

router.get("/comments", filter, commentController.index);

export default router;
