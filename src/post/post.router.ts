import { Router } from "express";
import { requestUrl } from "../app/app.middleware";
import * as postController from "./post.controller";

const router = Router();

router.get("/posts", requestUrl, postController.index);

export default router;
