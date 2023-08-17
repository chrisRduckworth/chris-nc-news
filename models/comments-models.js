const db = require("../db/connection");
const { checkExists } = require("../utils/utils");

exports.fetchCommentsByArticle = (articleId, limit = 10, page = 1) => {
  limit = parseInt(limit);
  if (!limit) {
    return Promise.reject({
      status: 400,
      msg: "Invalid Limit",
    });
  }
  if (limit <= 0) limit = 10;

  page = parseInt(page);
  if (!page) {
    return Promise.reject({
      status: 400,
      msg: "Invalid Page",
    });
  }
  if (page <= 0) page = 1;

  return checkExists("articles", "article_id", articleId)
    .then(() => {
      return db.query(
        `SELECT * FROM comments
      WHERE article_id = $1
      ORDER BY created_at DESC;`,
        [articleId]
      );
    })
    .then(({ rows }) => {
      const startIndex = limit * (page - 1);
      const endIndex = startIndex + limit;
      return rows.slice(startIndex, endIndex);
    });
};

exports.createComment = (reqBody, articleId) => {
  const { username } = reqBody;
  const { body } = reqBody;
  return checkExists("articles", "article_id", articleId)
    .then(() => {
      return db.query(
        `INSERT INTO comments
    (article_id, author, body)
    VALUES
    ($1, $2, $3)
    RETURNING *;
    `,
        [articleId, username, body]
      );
    })

    .then(({ rows }) => {
      return rows[0];
    });
};

exports.removeComment = (commentId) => {
  return checkExists("comments", "comment_id", commentId).then(() => {
    db.query(`DELETE FROM comments WHERE comment_id = $1;`, [commentId]);
  });
};

exports.updateComment = (commentId, incVotes) => {
  return db
    .query(
      `UPDATE comments
      SET votes = votes + $1
      WHERE comment_id = $2
      RETURNING *;`,
      [incVotes, commentId]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "Not Found",
        });
      }
      return rows[0];
    });
};
