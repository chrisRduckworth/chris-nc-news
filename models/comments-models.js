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
