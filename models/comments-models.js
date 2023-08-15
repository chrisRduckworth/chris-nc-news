const db = require("../db/connection");

exports.fetchCommentsByArticle = (articleId) => {
  return db
    .query(
      `SELECT * FROM comments
      WHERE article_id = $1
      ORDER BY created_at DESC;`,
      [articleId]
    )
    .then(({ rows }) => rows);
};

exports.createComment = (body, articleId) => {
  return db
    .query(
      `INSERT INTO comments
      (article_id, author, body)
      VALUES
      ($1, $2, $3)
      RETURNING *;`,
      [articleId, body.username, body.body]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.removeComment = (commentId) => {
  return db
    .query(`DELETE FROM comments WHERE comment_id = $1;`, [commentId])
};
