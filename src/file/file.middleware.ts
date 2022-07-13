import { Request, Response, NextFunction } from "express";
import multer from "multer";
import Jimp from "jimp";

// 创建multer
const fileUpload = multer({
  dest: "uploads/",
});

// file拦截器
export const fileInterceptor = fileUpload.single("file");

interface MulterRequest extends Request {
  file: any;
}
/**
 * 图像处理
 */
export const fileProcessor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // 获取图像路径
  const { path } = (req as MulterRequest).file;

  let image: any;

  try {
    image = await Jimp.read(path);
  } catch (error) {
    return next(error);
  }

  const { imageSize, tags } = image["_exif"];

  req.fileMetaData = {
    width: imageSize.width,
    height: imageSize.height,
    metadata: JSON.stringify(tags),
  };

  next();
};
