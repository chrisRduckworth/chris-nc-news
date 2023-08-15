const db = require("../db/connection");

exports.fetchCommentsByArticle = (articleId) => {
  return db
    .query(
      `SELECT * FROM comments
    WHERE article_id = $1
    ORDER BY created_at DESC;
    `,
      [articleId]
    )
    .then(({ rows }) => rows);
};

exports.createComment = (reqBody, articleId) => {
  const { username } = reqBody;
  const { body } = reqBody;
  return db
    .query(
      `INSERT INTO comments
    (article_id, author, body)
    VALUES
    ($1, $2, $3)
    RETURNING *;
    `,
      [articleId, username, body]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};
