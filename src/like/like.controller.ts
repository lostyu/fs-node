import { Request, Response, NextFunction } from "express";
import { createUserLikePost, deleteUserLikePost } from "./like.service";

/**
 * 点赞内容
 */
export const store = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id: userId } = req.user;
  const { postId } = req.params;

  try {
    const data = await createUserLikePost(Number(userId), Number(postId));
    res.status(201).send(data);
  } catch (error) {
    next(error);
  }
};

/**
 * 取消用户点赞
 */
export const destroy = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id: userId } = req.user;
  const { postId } = req.params;

  try {
    const data = await deleteUserLikePost(Number(userId), Number(postId));

    res.send(data);
  } catch (error) {
    next(error);
  }
};
