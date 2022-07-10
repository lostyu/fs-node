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
