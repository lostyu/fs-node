import { Router } from "express";
import { authGuard, accessControl } from "../auth/auth.middleware";
import * as postController from "./post.controller";
import { sort, filter } from "./post.middleware";

const router = Router();

router.get("/posts", sort, filter, postController.index);

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

router.post(
  "/posts/:postId/tag",
  authGuard,
  accessControl({ possession: true }),
  postController.storePostTag
);

router.delete(
  "/posts/:postId/tag",
  authGuard,
  accessControl({ possession: true }),
  postController.destroyPostTag
);

export default router;
