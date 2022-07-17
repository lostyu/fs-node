import { Request, Response, NextFunction } from "express";
import { createAvatar } from "./avatar.service";
import _ from "lodash";

/**
 * 头像上传
 */
export const store = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id: userId } = req.user;

  // 准备数据
  let _pick = _.pick(req.file, ["filename", "mimetype", "size"]);

  const avatar = {
    ..._pick,
    userId,
  };

  try {
    const data = await createAvatar(avatar);
    res.status(201).send(data);
  } catch (error) {
    next(error);
  }
};
