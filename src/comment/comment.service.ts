import { RowDataPacket } from "mysql2";
import { connection } from "../app/database/mysql";
import {
  GetPostsOptionsFilter,
  GetPostsOptionsPagination,
} from "../post/post.service";
import { CommentModel } from "./comment.model";
import { sqlFragment } from "./comment.provider";

/**
 * 创建评论
 */
export const createComment = async (comment: CommentModel) => {
  const statement = `
    INSERT INTO comment SET ?
  `;

  const [data] = await connection.promise().query(statement, comment);

  return data;
};

/**
 * 检查评论是否为回复评论
 */
export const isReplyComment = async (commentId: number) => {
  const statement = `
    SELECT parentId FROM comment WHERE id = ?
  `;

  const [data] = await connection.promise().query(statement, commentId);

  return (data as RowDataPacket)[0].parentId ? true : false;
};

/**
 * 修改评论
 */
export const updateComment = async (comment: CommentModel) => {
  const { id, content } = comment;
  const statement = `UPDATE comment SET content=? WHERE id=?`;

  const [data] = await connection.promise().query(statement, [content, id]);

  return data;
};

/**
 * 删除评论
 */
export const deleteComment = async (commentId: number) => {
  const statement = `DELETE FROM comment WHERE id=?`;

  console.log(statement);

  const [data] = await connection.promise().query(statement, commentId);

  return data;
};

/**
 * 获取评论列表
 */
interface GetCommentOptions {
  filter?: GetPostsOptionsFilter;
  pagination?: GetPostsOptionsPagination;
}

export const getComments = async (options: GetCommentOptions) => {
  const { filter, pagination } = options;

  let params: Array<any> = [pagination?.limit, pagination?.offset];

  if (filter?.param) {
    params = [filter.param, ...params];
  }

  const statement = `
    SELECT
      comment.id,
      comment.content,
      ${sqlFragment.post},
      ${sqlFragment.user}
      ${filter?.name == "userReplied" ? `, ${sqlFragment.repliedComment}` : ""}
      ${filter?.name != "userReplied" ? `, ${sqlFragment.totalReplies}` : ""}
    FROM
      comment
    ${sqlFragment.leftJoinUser}
    ${sqlFragment.leftJoinPost}
    WHERE 
      ${filter?.sql}
    GROUP BY comment.id
    ORDER BY comment.id DESC
    LIMIT ?
    OFFSET ?
  `;

  console.log(statement);

  const [data] = await connection.promise().query(statement, params);

  return data;
};

/**
 * 统计评论数量
 */
export const getCommentsTotalCount = async (options: GetCommentOptions) => {
  const { filter } = options;

  let params: Array<any> = [];

  if (filter?.param) {
    params = [filter.param, ...params];
  }

  const statement = `
    SELECT
      COUNT(DISTINCT comment.id) AS total
    FROM comment
    ${sqlFragment.leftJoinPost}
    ${sqlFragment.leftJoinUser}
    WHERE
      ${filter?.sql}
  `;

  const [data] = await connection.promise().query(statement, params);

  return (data as RowDataPacket)[0].total;
};

/**
 * 评论回复列表
 */
interface GetCommentRepliesOptions {
  commentId: number;
}
export const getCommentReplies = async (options: GetCommentRepliesOptions) => {
  const { commentId } = options;

  const statement = `
    SELECT 
      comment.id,
      comment.content,
      ${sqlFragment.user}
    FROM
      comment
      ${sqlFragment.leftJoinUser}
    WHERE 
      comment.parentId = ?
    GROUP BY
      comment.id
  `;

  const [data] = await connection.promise().query(statement, commentId);

  return data;
};
