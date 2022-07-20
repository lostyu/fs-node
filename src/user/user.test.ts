import request from "supertest";
import app from "../app";
import { connection } from "../app/database/mysql";
import { signToken } from "../auth/auth.service";
import { deleteUser, getUserById } from "./user.service";
import { UserModel } from "./user.model";
import { md5 } from "../utils/md5";
import { MD5_SALT } from "../app/app.config";

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

/**
 * 创建用户
 */
describe("测试创建用户接口", () => {
  test("创建用户时必须提供用户名", async () => {
    const response = await request(app).post("/users").send({
      password: testUser.password,
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "请提供用户名" });
  });

  test("创建用户时必须提供密码", async () => {
    const response = await request(app).post("/users").send({
      name: testUser.name,
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "请提供密码" });
  });

  test("成功创建用户以后，响应状态码应该是 201", async () => {
    const response = await request(app).post("/users").send(testUser);

    testUserCreated = await getUserById(response.body.insertId, {
      password: true,
    });

    expect(response.status).toBe(201);
  });
});

/**
 * 用户账户
 */
describe("测试用户账户接口", () => {
  test("响应里应该包含指定属性", async () => {
    const response = await request(app).get(`/users/${testUserCreated.id}`);

    expect(response.status).toBe(200);
    expect(response.body.name).toBe(testUserCreated.name);
    expect(response.body).toMatchObject({
      id: expect.any(Number),
      name: expect.any(String),
      avatar: null,
    });
  });

  test("当用户不存在时，响应状态码是 404", async () => {
    const response = await request(app).get(`/users/-1`);

    expect(response.status).toBe(404);
  });
});

/**
 * 更新用户
 */
describe("测试用户更新接口", () => {
  test("更新用户时需要验证用户身份", async () => {
    const response = await request(app).patch(`/users`);

    expect(response.status).toBe(401);
  });

  // 更新用户数据，需要签发令牌
  test("更新用户数据", async () => {
    const token = signToken({
      payload: {
        id: testUserCreated.id,
        name: testUserCreated.name,
      },
    });

    // 请求接口
    const response = await request(app)
      .patch("/users")
      .set("Authorization", `Bearer ${token}`)
      .send({
        validate: {
          password: testUser.password,
        },
        update: {
          name: testUserUpdated.name,
          password: testUserUpdated.password,
        },
      });

    // 调取用户
    const user = await getUserById(testUserCreated.id as number, {
      password: true,
    });

    // 对比密码是否匹配
    const matched =
      user.password == md5((testUserUpdated.password as string) + MD5_SALT);

    // 断言
    expect(response.status).toBe(200);
    expect(matched).toBeTruthy();
    expect(user.name).toBe(testUserUpdated.name);
  });
});
