import { Request, Response, NextFunction } from "express";
import { getPosts } from "./post.service";

export const index = (req: Request, res: Response, next: NextFunction) => {
  if (req.headers["my-name"] !== "tony") {
    return next(new Error());
  }

  const posts = getPosts();

  res.send(posts);
};
