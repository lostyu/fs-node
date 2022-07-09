import app from "./app";
import { APP_PORT } from "./app/app.config";
import { connection } from "./app/database/mysql";

app.listen(APP_PORT, () => {
  console.log(`🚀server is running~ @ port ${APP_PORT}`);
});

// 测试数据库连接
connection.connect((error) => {
  if (error) {
    console.log("数据库连接错误", error.message);
    return;
  }

  console.log("数据库连接成功");
});
