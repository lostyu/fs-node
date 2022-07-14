import { Request, Response, NextFunction } from "express";
import { createTag, getTagByName } from "./tag.service";

/**
 * 创建标签
 */
export const store = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name } = req.body;

  try {
    // 查询名字是否重复
    const tag = await getTagByName(name);
    if (tag) {
      throw new Error("TAG_ALREADY_EXIST");
    }

    const data = await createTag({ name });

    res.status(201).send(data);
  } catch (error) {
    next(error);
  }
};
