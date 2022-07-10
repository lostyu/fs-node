import { RowDataPacket } from "mysql2";
import { connection } from "../app/database/mysql";
import { UserModel } from "./user.model";

/**
 * 创建用户
 */
export const createUser = async (user: UserModel) => {
  // sql
  const statement = `
    INSERT INTO user SET ?
  `;

  const [data] = await connection.promise().query(statement, user);

  return data;
};

/**
 * 通过用户名查找
 */
export const getUserByName = async (name: string) => {
  const statement = `
    SELECT id, name FROM user WHERE name = ?
  `;

  const [data] = await connection.promise().query(statement, name);

  console.log(data);

  // return (data as RowDataPacket[])[0];
  return (data as RowDataPacket)[0];
};
