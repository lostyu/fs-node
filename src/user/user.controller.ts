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
