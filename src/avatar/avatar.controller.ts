import { Request, Response, NextFunction } from "express";

/**
 * 头像上传
 */
export const store = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.sendStatus(200);
};
