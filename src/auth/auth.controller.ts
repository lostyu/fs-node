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
