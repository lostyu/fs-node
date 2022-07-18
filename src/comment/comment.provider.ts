export const sqlFragment = {
  user: `
    JSON_OBJECT(
      'id', user.id,
      'name', user.name,
      'avatar', IF(COUNT(avatar.id), 1, NULL)
    ) AS user
  `,
  post: `
    JSON_OBJECT(
      'id', post.id,
      'title', post.title
    ) AS post
  `,
  leftJoinUser: `
    LEFT JOIN user
      ON user.id = comment.userId
    LEFT JOIN avatar
      ON avatar.userId = user.id
  `,
  leftJoinPost: `
    LEFT JOIN post
      ON post.id = comment.postId
  `,
  repliedComment: `
    (
      SELECT 
        JSON_OBJECT(
          'id', repliedComment.id,
          'content', repliedComment.content
        )
      FROM 
          comment repliedComment
      WHERE 
          comment.parentId = repliedComment.id
    ) AS repliedComment
  `,
};
