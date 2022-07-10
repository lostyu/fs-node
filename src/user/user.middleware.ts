import { Request, Response, NextFunction } from "express";
import * as userService from "./user.service";
import { md5 } from "../utils/md5";
import { MD5_SALT } from "../app/app.config";

export const validateUserData = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("验证用户数据...");

  // 准备数据
  const { name, password } = req.body;

  if (!name) return next(new Error("NAME_IS_REQUIRED"));
  if (!password) return next(new Error("PASSWORD_IS_REQUIRED"));

  // 查询name是否存在
  const user = await userService.getUserByName(name);
  console.log(user);

  if (user) return next(new Error("NAME_ALREADY_EXISTS"));

  next();
};

export const hashPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { password } = req.body;

  req.body.password = md5(password + MD5_SALT);

  next();
};
