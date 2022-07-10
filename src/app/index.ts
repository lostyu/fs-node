import express from "express";
import postRouter from "../post/post.router";
import userRouter from "../user/user.router";
import authRouter from "../auth/auth.router";
import { defaultErrorHandler } from "./app.middleware";

const app = express();

// use
app.use(express.json());

// 路由
app.use(postRouter, userRouter, authRouter);

// 处理异常
app.use(defaultErrorHandler);

export default app;
