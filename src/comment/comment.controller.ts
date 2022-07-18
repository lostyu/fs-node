import { Request, Response, NextFunction } from "express";
import { CommentModel } from "./comment.model";
import {
  createComment,
  isReplyComment,
  updateComment,
  deleteComment,
  getComments,
  getCommentsTotalCount,
  getCommentReplies,
} from "./comment.service";

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

/**
 * 修改评论
 */
export const update = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { commentId } = req.params;
  const { content } = req.body;

  const comment = {
    id: Number(commentId),
    content,
  };

  try {
    const data = await updateComment(comment);
    res.send(data);
  } catch (error) {
    next(error);
  }
};

/**
 * 删除评论
 */
export const destroy = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { commentId } = req.params;

  try {
    const data = await deleteComment(Number(commentId));
    res.send(data);
  } catch (error) {
    next(error);
  }
};

/**
 * 评论列表
 */
export const index = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const totalCount = await getCommentsTotalCount({ filter: req.filter });
    res.header("X-Total-Count", totalCount);
  } catch (error) {
    next(error);
  }

  try {
    const comments = await getComments({
      filter: req.filter,
      pagination: req.pagination,
    });
    res.send(comments);
  } catch (error) {
    next(error);
  }
};

/**
 * 回复列表接口
 */
export const indexReplies = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { commentId } = req.params;

  try {
    const data = await getCommentReplies({ commentId: Number(commentId) });
    res.send(data);
  } catch (error) {
    next(error);
  }
};
