import { RowDataPacket } from "mysql2";
import { connection } from "../app/database/mysql";
import { FileModel } from "./file.model";

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
