import { Request, Response, NextFunction } from "express";

export const requestUrl = (req: Request, res: Response, next: NextFunction) => {
  console.log(req.method, "-", req.url);
  next();
};

export const defaultErrorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error.message) {
    console.log("err: ", error.message);
  }

  let statusCode: number, message: string;

  switch (error.message) {
    case "NAME_IS_REQUIRED":
      statusCode = 400;
      message = "请提供用户名";
      break;
    case "PASSWORD_IS_REQUIRED":
      statusCode = 400;
      message = "请提供密码";
      break;
    case "NAME_ALREADY_EXISTS":
      statusCode = 409;
      message = "用户名已被占用";
      break;
    default:
      statusCode = 500;
      message = "服务器错误";
      break;
  }

  res.status(statusCode).send({ message });
};
