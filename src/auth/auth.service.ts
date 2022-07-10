import jwt from "jsonwebtoken";
import { PRIVATE_KEY } from "../app/app.config";

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
