import { Request, Response, NextFunction } from "express";
import { createAvatar, findAvatarByUserId } from "./avatar.service";
import _, { findLast } from "lodash";
import fs from "fs";
import path from "path";

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

/**
 * 头像服务
 */
export const serve = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // 获取用户id
  const { userId } = req.params;

  // 获取查询参数size
  const { size } = req.query;

  // 查询头像数据
  try {
    const avatar = await findAvatarByUserId(Number(userId));

    if (!avatar) {
      throw new Error("FILE_NOT_FOUND");
    }

    // 拼接file路径
    let filename = avatar.filename;
    let root = "uploads/avatar";
    let resized = "resized";

    // 如果有size查询参数
    if (size) {
      const imageSizes = ["large", "medium", "small"];
      if (!imageSizes.some((item) => item === size)) {
        throw new Error("FILE_NOT_FOUND");
      }

      filename = `${filename}-${size}`;
      root = path.join(root, resized);
    }

    console.log(size, filename, root);

    // 判断文件是否存在
    let fileExist = fs.existsSync(path.join(root, filename));
    if (!fileExist) {
      throw new Error("FILE_NOT_FOUND");
    }

    // 作出响应
    res.sendFile(filename, {
      root,
      headers: {
        "Content-Type": avatar.mimetype,
      },
    });
  } catch (error) {
    next(error);
  }
};
