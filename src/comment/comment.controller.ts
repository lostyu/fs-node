import { Request, Response, NextFunction } from "express";
import { createComment } from "./comment.service";

/**
 * 发表评论
 */
export const store = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // 准备数据
  const { id: userId } = req.user;
  const { content, postId } = req.body;

  const comment = {
    userId,
    content,
    postId,
  };

  try {
    const data = await createComment(comment);
    res.status(201).send(data);
  } catch (error) {
    next(error);
  }
};
