import { Request, Response, NextFunction } from "express";

export const requestUrl = (req: Request, res: Response, next: NextFunction) => {
  console.log(req.url);
  next();
};

export const defaultErrorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode: number, message: string;

  switch (error.message) {
    default:
      statusCode = 500;
      message = "服务器错误";
      break;
  }

  res.status(statusCode).send({ message });
};
