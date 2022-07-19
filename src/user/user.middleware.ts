import { Request, Response, NextFunction } from "express";
import * as userService from "./user.service";
import { md5 } from "../utils/md5";
import { MD5_SALT } from "../app/app.config";
import _ from "lodash";

/**
 * 验证用户是否存在
 */
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

  if (user) return next(new Error("USER_ALREADY_EXISTS"));

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

/**
 * 验证用户更新数据
 */
export const validateUpdateUserData = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // 准备数据
  const { validate, update } = req.body;
  const { id: userId } = req.user;

  try {
    // 修改用户密码，必须要提供当前密码，检查用户是否提供了当前密码
    if (!_.has(validate, "password")) {
      return next(new Error("PASSWORD_IS_REQUIRED"));
    }

    // 调取用户数据
    const user = await userService.getUserById(Number(userId), {
      password: true,
    });

    // 验证用户密码是否匹配
    const matched = md5(validate.password + MD5_SALT) == user.password;
    if (!matched) {
      return next(new Error("PASSWORD_DOSE_NOT_MATCH"));
    }

    // 检查用户名是否被占用
    if (update.name) {
      const user = await userService.getUserByName(update.name);
      if (user) {
        return next(new Error("USER_ALREADY_EXISTS"));
      }
    }

    // 处理用户更新密码
    if (update.password) {
      const matched = md5(update.password + MD5_SALT) == user.password;
      if (matched) {
        return next(new Error("PASSWORD_IS_THE_SAME"));
      }

      // hash密码
      req.body.update.password = md5(update.password + MD5_SALT);
    }
  } catch (error) {
    return next(error);
  }
};
