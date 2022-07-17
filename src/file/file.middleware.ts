import { Request, Response, NextFunction } from "express";
import multer, { FileFilterCallback } from "multer";
import Jimp from "jimp";
import { imageResizer } from "./file.service";

/**
 * 文件过滤器
 */
export const fileFilter = (fileTypes: Array<string>) => {
  return (
    req: Request,
    file: Express.Multer.File,
    callback: FileFilterCallback
  ) => {
    // 测试文件类型
    const allowed = fileTypes.some((type) => type === file.mimetype);

    if (allowed) {
      callback(null, true);
    } else {
      callback(new Error("FILE_TYPE_NOT_ACCEPT"));
    }
  };
};

const fileUploadFilter = fileFilter(["image/png", "image/jpg", "image/jpeg"]);

// 创建multer
const fileUpload = multer({
  dest: "uploads/",
  fileFilter: fileUploadFilter,
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

  // 处理图片大小
  imageResizer(image, (req as MulterRequest).file);

  next();
};
