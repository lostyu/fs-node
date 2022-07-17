import { Request, Response, NextFunction } from "express";
import multer from "multer";
import { fileFilter } from "../file/file.middleware";

// 文件过滤器
const avatarUploadFilter = fileFilter(["image/png", "image/jpg", "image/jpeg"]);

// multer
const avatarUpload = multer({
  dest: "uploads/avatar",
  fileFilter: avatarUploadFilter,
});

// interceptor
export const avatarInterceptor = avatarUpload.single("avatar");
