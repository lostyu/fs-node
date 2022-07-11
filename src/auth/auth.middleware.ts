import { Request, Response, NextFunction } from "express";
import { MD5_SALT, PUBLIC_KEY } from "../app/app.config";
import * as userService from "../user/user.service";
import { md5 } from "../utils/md5";
import jwt from "jsonwebtoken";
import { TokenPayload } from "./auth.interface";
import { possess } from "./auth.service";

export const validateLoginData = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("验证用户登录数据...");

  // 准备数据
  const { name, password } = req.body;

  if (!name) return next(new Error("NAME_IS_REQUIRED"));
  if (!password) return next(new Error("PASSWORD_IS_REQUIRED"));

  // 查询name是否存在
  const user = await userService.getUserByName(name, { password: true });

  if (!user) return next(new Error("USER_DOSE_NOT_EXISTS"));

  // 比对密码
  const matched = md5(password + MD5_SALT) === user.password;
  if (!matched) return next(new Error("PASSWORD_DOSE_NOT_MATCH"));

  // 添加user数据
  req.body.user = user;

  next();
};

/**
 * 验证token授权
 */
export const authGuard = (req: Request, res: Response, next: NextFunction) => {
  console.log("验证用户身份");

  try {
    // 获取头部 authorization
    const authorization = req.header("authorization");
    if (!authorization) throw new Error();

    const token = authorization.replace("Bearer ", "");
    if (!token) throw new Error();

    // 验证token
    const decoded = jwt.verify(token, PUBLIC_KEY as string, {
      algorithms: ["RS256"],
    });

    req.user = decoded as TokenPayload;

    next();
  } catch (error) {
    next(new Error("UNAUTHORIZED"));
  }
};

/**
 * 访问控制
 */
interface AccessControlOptions {
  possession?: boolean;
}

export const accessControl = (options: AccessControlOptions) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    console.log("访问控制");

    //
    const { possession } = options;

    // 当前用户
    const { id: userId } = req.user;

    // 放行管理员
    if (userId == 1) return next();

    // 准备资源
    const resourceIdParam = Object.keys(req.params)[0];
    // console.log("resourceIdParam", resourceIdParam);

    const resourceType = resourceIdParam.replace("Id", "");
    // console.log("resourceType", resourceType);

    const resourceId = parseInt(req.params[resourceIdParam], 10);
    // console.log("resourceId", resourceId);

    // 检查资源拥有权
    if (possession) {
      try {
        if (userId) {
          const ownResource = await possess({
            resourceId,
            resourceType,
            userId,
          });

          if (!ownResource) {
            return next(new Error("USER_DOSE_NOT_OWN_RESOURCE"));
          }
        }
      } catch (error) {
        return next(error);
      }
    }

    next();
  };
};
