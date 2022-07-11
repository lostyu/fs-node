import { Router } from "express";
import { requestUrl } from "../app/app.middleware";
import { authGuard, accessControl } from "../auth/auth.middleware";
import * as postController from "./post.controller";

const router = Router();

router.get("/posts", requestUrl, postController.index);

router.post("/posts", authGuard, postController.store);

router.patch(
  "/posts/:postId",
  authGuard,
  accessControl({ possession: true }),
  postController.update
);

router.delete(
  "/posts/:postId",
  authGuard,
  accessControl({ possession: true }),
  postController.destroy
);

export default router;
