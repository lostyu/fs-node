import { Request, Response, NextFunction } from "express";
import _ from "lodash";
import {
  createPost,
  deletePost,
  getPosts,
  updatePost,
  createPostTag,
  postHasTag,
  deletePostTag,
} from "./post.service";
import { TagModel } from "../tag/tag.model";
import { createTag, getTagByName } from "../tag/tag.service";

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

/**
 * 添加内容标签
 */
export const storePostTag = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { postId } = req.params;

  const { name } = req.body;

  let tag: TagModel;

  // 查找有没有标签
  try {
    tag = await getTagByName(name);
  } catch (error) {
    return next(error);
  }

  if (tag) {
    try {
      // 如果有，验证内容标签
      // tag.id as number
      // tag.id!
      // tag.id ?? 0;
      const postTag = await postHasTag(Number(postId), tag.id!);
      if (postTag) {
        return next(new Error("POST_ALREADY_HAS_THIS_TAG"));
      }
    } catch (error) {
      return next(error);
    }
  }

  // 没有标签就创建一个标签
  if (!tag) {
    try {
      const data = await createTag({ name });
      tag = { id: data.insertId };
    } catch (error) {
      return next(error);
    }
  }

  // 打标签
  try {
    await createPostTag(Number(postId), tag.id!);
    res.sendStatus(201);
  } catch (error) {
    return next(error);
  }
};

/**
 * 移除内容标签
 */
export const destroyPostTag = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { postId } = req.params;
  const { tagId } = req.body;

  // 移除内容标签
  try {
    await deletePostTag(Number(postId), tagId);
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
};
