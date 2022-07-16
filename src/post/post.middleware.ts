import { Request, Response, NextFunction } from "express";
import { POSTS_PER_PAGE } from "../app/app.config";

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

/**
 * 过滤列表中间件
 */
export const filter = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // 解构查询符
  const { tag, user, action } = req.query;

  // 设置默认过滤
  req.filter = {
    name: "default",
    sql: "post.id IS NOT NULL",
  };

  // 按标签名过滤
  if (tag && !user && !action) {
    req.filter = {
      name: "tagName",
      sql: "tag.name = ?",
      param: tag as string,
    };
  }

  // 过滤出用户发布的内容
  if (user && action == "published" && !tag) {
    req.filter = {
      name: "userPublished",
      sql: "user.id = ?",
      param: user as string,
    };
  }

  next();
};

/**
 * 分页中间件
 */
export const paginate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { page = 1 } = req.query;

  const limit = Number(POSTS_PER_PAGE) || 30;

  const offset = limit * (Number(page) - 1);

  req.pagination = { limit, offset };

  next();
};
