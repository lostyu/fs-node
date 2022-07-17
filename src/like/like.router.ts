import { Router } from "express";
import { authGuard } from "../auth/auth.middleware";
import * as likeController from "./like.controller";

const router = Router();

router.post("/posts/:postId/like", authGuard, likeController.store);

// 取消用户点赞
router.delete("/posts/:postId/like", authGuard, likeController.destroy);

export default router;
