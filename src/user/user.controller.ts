import { Request, Response, NextFunction } from "express";
import _ from "lodash";
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

/**
 * 更新用户
 */
export const update = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // 准备数据
  const { id } = req.user;
  const userData = _.pick(req.body.update, ["name", "password"]);

  try {
    const data = await userService.updateUser(Number(id), userData);

    res.send(data);
  } catch (error) {
    next(error);
  }
};
