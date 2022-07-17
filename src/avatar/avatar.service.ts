import { connection } from "../app/database/mysql";
import { AvatarModel } from "./avatar.model";

/**
 * 保存头像信息
 */
export const createAvatar = async (avatar: AvatarModel) => {
  const statement = `
    INSERT INTO avatar SET ?
  `;

  const data = await connection.promise().query(statement, avatar);

  return data;
};
