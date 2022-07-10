import { Request, Response, NextFunction } from "express";
import { MD5_SALT } from "../app/app.config";
import * as userService from "../user/user.service";
import { md5 } from "../utils/md5";

export const validateLoginData = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("验证用户登录数据...");

  // 准备数据
  const { name, password } = req.body;

  if (!name) return next(new Error("NAME_IS_REQUIRED"));
  if (!password) return next(new Error("PASSWORD_IS_REQUIRED"));

  // 查询name是否存在
  const user = await userService.getUserByName(name, { password: true });

  if (!user) return next(new Error("USER_DOSE_NOT_EXISTS"));

  // 比对密码
  const matched = md5(password + MD5_SALT) === user.password;
  if (!matched) return next(new Error("PASSWORD_DOSE_NOT_MATCH"));

  next();
};
