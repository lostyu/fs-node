import path from "path";
import { RowDataPacket } from "mysql2";
import { connection } from "../app/database/mysql";
import { FileModel } from "./file.model";
import Jimp from "jimp";

/**
 * 储存文件
 */
export const createFile = async (file: FileModel) => {
  const statement = `
    INSERT INTO file SET ?
  `;

  const [data] = await connection.promise().query(statement, file);

  return data;
};

/**
 * 按id查找文件
 */
export const findFileById = async (fileId: number) => {
  const statement = `
    SELECT * FROM file WHERE id = ?
  `;

  const [data] = await connection.promise().query(statement, fileId);

  return (data as RowDataPacket)[0];
};

interface MyJimp extends Jimp {
  _exif: any;
}
/**
 * 调整图像尺寸
 */
export const imageResizer = async (image: Jimp, file: Express.Multer.File) => {
  const { imageSize } = (image as MyJimp)._exif;
  const filePath = path.join(file.destination, "resized", file.filename);

  // 调整尺寸
  if (imageSize.width > 1280) {
    image.resize(1280, Jimp.AUTO).quality(85).write(`${filePath}-large`);
  }
  if (imageSize.width > 640) {
    image.resize(640, Jimp.AUTO).quality(85).write(`${filePath}-medium`);
  }
  if (imageSize.width > 320) {
    image.resize(320, Jimp.AUTO).quality(85).write(`${filePath}-thumbnail`);
  }
};
