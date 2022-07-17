import path from "path";
import { Request, Response, NextFunction } from "express";
import multer, { Multer } from "multer";
import Jimp from "jimp";
import { fileFilter } from "../file/file.middleware";

// 文件过滤器
const avatarUploadFilter = fileFilter(["image/png", "image/jpg", "image/jpeg"]);

// multer
const avatarUpload = multer({
  dest: "uploads/avatar",
  fileFilter: avatarUploadFilter,
});

// interceptor
export const avatarInterceptor = avatarUpload.single("avatar");

/**
 * 处理图片尺寸
 */
export const avatarProcess = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // 获取图片信息
  let { file } = req;
  file = file as Express.Multer.File;

  const filePath = path.join(file.destination, "resized", file.filename);

  // 生成不同尺寸的图片
  try {
    const image = await Jimp.read(file.path);
    image.cover(256, 256).quality(85).write(`${filePath}-large`);
    image.cover(128, 128).quality(85).write(`${filePath}-medium`);
    image.cover(64, 64).quality(85).write(`${filePath}-small`);
  } catch (error) {
    next(error);
  }

  next();
};
