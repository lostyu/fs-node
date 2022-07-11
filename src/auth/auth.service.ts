import jwt from "jsonwebtoken";
import { RowDataPacket } from "mysql2";
import { PRIVATE_KEY } from "../app/app.config";
import { connection } from "../app/database/mysql";

interface SignTokenOptions {
  payload?: any;
}

export const signToken = (options: SignTokenOptions) => {
  // 准备选项
  const { payload } = options;

  let token;

  // 签发JWT
  if (PRIVATE_KEY) {
    token = jwt.sign(payload, PRIVATE_KEY, { algorithm: "RS256" });
  }

  // 提供JWT
  return token;
};

/**
 * 检查用户是否拥有指定资源
 */
interface PossessOptions {
  resourceId: number;
  resourceType: string;
  userId: number;
}

export const possess = async (options: PossessOptions) => {
  const { resourceId, resourceType, userId } = options;

  const statement = `
    SELECT COUNT(${resourceType}.id) as count 
    FROM ${resourceType}
    WHERE ${resourceType}.id = ? AND userId = ?
  `;

  const [data] = await connection
    .promise()
    .query(statement, [resourceId, userId]);

  return (data as RowDataPacket)[0].count ? true : false;
};
