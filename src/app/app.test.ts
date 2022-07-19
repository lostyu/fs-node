import { greet } from "./playground/demo";
import request from "supertest";
import app from "../app";
import { connection } from "../app/database/mysql";

/**
 * 单元测试
 */
describe("演示单元测试", () => {
  // 测试
  test("测试 greet 函数", () => {
    // 准备
    const greeting = greet("Tony");
    // 断言
    expect(greeting).toBe("你好，Tony");
  });
});

/**
 * 接口测试
 */
describe("演示接口测试", () => {
  afterAll(async () => {
    // 断开连接
    connection.end();
  });

  test("测试 GET /", async () => {
    // 请求接口
    const response = await request(app).get("/");

    // 断言
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ title: "小白兔的开发之路" });
  });

  test("测试 POST /echo", async () => {
    const response = await request(app).post("/echo").send({
      message: "你好~",
    });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({ message: "你好~" });
  });
});
