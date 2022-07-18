import dotenv from "dotenv";

dotenv.config();

// 应用配置
export const { APP_PORT } = process.env;

// 数据仓库
export const {
  MYSQL_HOST,
  MYSQL_PORT,
  MYSQL_USER,
  MYSQL_PASSWORD,
  MYSQL_DATABASE,
} = process.env;

// 导出MD5_SALT
export const { MD5_SALT } = process.env;

// key
export const { PRIVATE_KEY, PUBLIC_KEY } = process.env;

// 分页页码
export const POSTS_PER_PAGE = Number(process.env["POSTS_PER_PAGE"]);
