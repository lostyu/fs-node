import { Request, Response, NextFunction } from "express";

/**
 * 排序中间件
 */
export const sort = async (req: Request, res: Response, next: NextFunction) => {
  const { sort } = req.query;

  let sqlSort: string;

  switch (sort) {
    case "earliest":
      sqlSort = `post.id ASC`;
      break;
    case "latest":
      sqlSort = `post.id DESC`;
      break;
    case "most_comments":
      sqlSort = `totalComments DESC, post.id DESC`;
      break;
    default:
      sqlSort = `post.id DESC`;
      break;
  }

  req.sort = sqlSort;

  next();
};
