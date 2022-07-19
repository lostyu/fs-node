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
 * 查找用户
 */
interface GetUserOptions {
  password?: boolean;
}

export const getUser = (condition: string) => {
  return async (param: string | number, options: GetUserOptions = {}) => {
    const { password } = options;

    const statement = `
      SELECT 
        user.id, 
        user.name,
        IF(
          COUNT(avatar.id), 1, NULL
        ) AS avatar
        ${password ? ", password " : ""} 
      FROM user 
      LEFT JOIN avatar
          ON avatar.userId = user.id
      WHERE 
        ${condition} = ?
    `;

    const [data] = await connection.promise().query(statement, param);

    return (data as RowDataPacket)[0].id ? (data as RowDataPacket)[0] : null;
  };
};

/**
 * 通过用户名查找
 */
export const getUserByName = getUser("user.name");
export const getUserById = getUser("user.id");
