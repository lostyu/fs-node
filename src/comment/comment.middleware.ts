import { Request, Response, NextFunction } from "express";

/**
 * 评论过滤器
 */
export const filter = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // 获取query参数
  const { post, user, action } = req.query;

  req.filter = {
    name: "default",
    sql: "comment.parentId IS NULL",
  };

  if (post && !user && !action) {
    req.filter = {
      name: "postComments",
      sql: "comment.parentId IS NULL AND comment.postId = ?",
      param: post as string,
    };
  }

  next();
};
