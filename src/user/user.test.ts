import request from "supertest";
import app from "../app";
import { connection } from "../app/database/mysql";
import { signToken } from "../auth/auth.service";
import { deleteUser, getUserById } from "./user.service";
import { UserModel } from "./user.model";

// 准备测试数据
const testUser: UserModel = {
  name: "xb2-test-user-name",
  password: "111111",
};

const testUserUpdated: UserModel = {
  name: "xb2-test-user-new-name",
  password: "222222",
};

let testUserCreated: UserModel;

afterAll(async () => {
  // 删除用户
  if (testUserCreated) {
    await deleteUser(testUserCreated.id as number);
  }

  // 断开连接
  connection.end();
});
