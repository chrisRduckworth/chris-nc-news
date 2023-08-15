const { use } = require("../app");
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
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "Not Found"
        })
      }
      return rows;
    });
};

exports.createComment = (body, articleId) => {
  return db.query(
    `INSERT INTO comments
    (article_id, author, body)
    VALUES
    ($1, $2, $3)
    RETURNING *;
    `,[articleId, body.username, body.body])
  .then(({rows}) => {
    return rows[0]
  })
}