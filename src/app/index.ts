import express from "express";
import postRouter from "../post/post.router";
import userRouter from "../user/user.router";
import authRouter from "../auth/auth.router";
import fileRouter from "../file/file.router";
import tagRouter from "../tag/tag.router";
import avatarRouter from "../avatar/avatar.router";
import commentRouter from "../comment/comment.router";
import likeRouter from "../like/like.router";
import appRouter from "./app.router";

import { defaultErrorHandler } from "./app.middleware";

const app = express();

// use
app.use(express.json());

// 路由
app.use(
  postRouter,
  userRouter,
  authRouter,
  fileRouter,
  tagRouter,
  commentRouter,
  avatarRouter,
  likeRouter,
  appRouter
);

// 处理异常
app.use(defaultErrorHandler);

export default app;
