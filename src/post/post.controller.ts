import { Request, Response, NextFunction } from "express";
import _ from "lodash";
import { createPost, deletePost, getPosts, updatePost } from "./post.service";

export const index = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const posts = await getPosts();

    res.send(posts);
  } catch (error) {
    next(error);
  }
};

/**
 * 创建内容
 * @param req
 * @param res
 * @param next
 */
export const store = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { title, content } = req.body;

  // 获取用户登录信息
  const { id: userId } = req.user;

  try {
    const data = await createPost({ title, content, userId });
    res.status(201).send(data);
  } catch (error) {
    next(error);
  }
};

export const update = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // 获取数据
  const { postId } = req.params;

  // pick
  const post = _.pick(req.body, ["title", "content"]);

  try {
    const data = await updatePost(Number(postId), post);
    res.send(data);
  } catch (error) {
    next(error);
  }
};

/**
 * 删除内容
 */

export const destroy = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // 获取数据
  const { postId } = req.params;

  try {
    const data = await deletePost(Number(postId));
    res.send(data);
  } catch (error) {
    next(error);
  }
};
