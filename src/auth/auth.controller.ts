import { Request, Response, NextFunction } from "express";
import { signToken } from "./auth.service";

/**
 * 用户登录
 */
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    user: { id, name },
  } = req.body;

  const payload = { id, name };

  try {
    const token = signToken({ payload });

    res.send({ id, name, token });
  } catch (error) {
    next(error);
  }
};

/**
 * 验证用户身份
 */
export const validate = (req: Request, res: Response, next: NextFunction) => {
  console.log(req.user);

  res.sendStatus(200);
};
