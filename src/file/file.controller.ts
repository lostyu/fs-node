import path from "path";
import fs from "fs";
import { Request, Response, NextFunction } from "express";
import _ from "lodash";
import { createFile, findFileById } from "./file.service";
import { FileModel } from "./file.model";

/**
 * 上传文件
 */
export const store = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // 用户id
  let { id: userId } = req.user;
  userId = userId as number;

  // postid
  let { post } = req.query;
  let postId = Number(post);

  // file信息
  const fileInfo = _.pick(req.file, [
    "originalname",
    "mimetype",
    "filename",
    "size",
  ]);

  const fileObj: FileModel = {
    originalname: fileInfo.originalname as string,
    mimetype: fileInfo.mimetype as string,
    filename: fileInfo.filename as string,
    size: fileInfo.size as number,
    userId,
    postId,
    ...req.fileMetaData,
  };

  console.log(fileObj);

  // 存储文件
  try {
    const data = await createFile(fileObj);

    res.status(201).send(data);
  } catch (error) {
    next(error);
  }
};

/**
 * 文件服务
 */
export const serve = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // 获取文件id
  const { fileId } = req.params;

  try {
    const file = await findFileById(Number(fileId));

    // 获取要查询的图片尺寸
    const { size } = req.query;
    let filename = file.filename;
    let root = "uploads";
    let resized = "resized";

    // 有size查询参数
    console.log(size);

    if (size) {
      // 可用图像尺寸
      const imageSizes = ["large", "medium", "thumbnail"];

      // 检查是否可用
      if (!imageSizes.some((item) => item == size)) {
        throw new Error("FILE_NOT_FOUND");
      }

      // 检查文件是否存在
      const fileExist = fs.existsSync(
        path.join(root, resized, `${filename}-${size}`)
      );
      if (fileExist) {
        filename = `${filename}-${size}`;
        root = path.join(root, resized);
      }
    }

    // 作出响应
    res.sendFile(filename, {
      root,
      headers: {
        "Content-type": file.mimetype,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 获取图片meta信息
 */
export const metadata = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { fileId } = req.params;

  try {
    // 查询数据
    const fileMeta = await findFileById(Number(fileId));
    const data = _.pick(fileMeta, [
      "id",
      "size",
      "width",
      "height",
      "metadata",
    ]);
    res.send(data);
  } catch (error) {
    next(error);
  }
};
