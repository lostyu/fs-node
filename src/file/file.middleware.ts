import { Request, Response, NextFunction } from "express";
import multer from "multer";

// 创建multer
const fileUpload = multer({
  dest: "uploads/",
});

// file拦截器
export const fileInterceptor = fileUpload.single("file");
