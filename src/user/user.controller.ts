import { Request, Response, NextFunction } from "express";
import { UserModel } from "./user.model";
import * as userService from "./user.service";

/**
 * 创建用户
 */
export const store = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // 获取信息
  const { name, password } = req.body;

  try {
    const data = await userService.createUser({ name, password });
    res.status(201).send(data);
  } catch (error) {
    next(error);
  }
};

/**
 * 用户账户
 */
export const show = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;

  try {
    const user = await userService.getUserById(Number(userId));

    if (!user) {
      return next(new Error("NOT_FOUND_USER"));
    }

    res.send(user);
  } catch (error) {
    next(error);
  }
};
