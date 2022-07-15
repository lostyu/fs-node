import { Request, Response, NextFunction } from "express";
import { CommentModel } from "./comment.model";
import { createComment, isReplyComment } from "./comment.service";

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

/**
 * 回复评论
 */
export const reply = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // 准备数据
  const { commentId } = req.params;
  const parentId = Number(commentId);
  let { id: userId } = req.user;
  const { content, postId } = req.body;

  const comment = {
    content,
    postId,
    userId,
    parentId,
  };

  try {
    const reply = await isReplyComment(parentId);
    if (reply) {
      return next(new Error("UNABLE_TO_REPLY_THIS_COMMENT"));
    }
  } catch (error) {
    return next(error);
  }

  try {
    const data = await createComment(comment);
    res.status(201).send(data);
  } catch (error) {
    next(error);
  }
};
