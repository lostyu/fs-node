import { Request, Response, NextFunction } from "express";

/**
 * 评论过滤器
 */
export const filter = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  req.filter = {
    name: "default",
    sql: "comment.parentId IS NULL",
  };

  next();
};
