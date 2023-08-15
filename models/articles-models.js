const db = require("../db/connection");

exports.fetchArticleById = (articleId) => {
  return db
    .query(
      `SELECT * FROM articles 
      WHERE article_id = $1;`,
      [articleId]
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

exports.fetchArticles = () => {
  return db
    .query(
      `SELECT 
        articles.author, 
        title, 
        articles.article_id, 
        topic, 
        articles.created_at, 
        articles.votes, 
        article_img_url, 
        COUNT(comment_id) AS comment_count
      FROM articles
      LEFT OUTER JOIN comments ON articles.article_id = comments.article_id
      GROUP BY articles.article_id
      ORDER BY articles.created_at DESC;
    `
    )
    .then(({ rows }) => {
      rows.forEach((article) => {
        article.comment_count = parseInt(article.comment_count)
      })
      return rows;
    });
};

exports.updateArticleVotes = (articleId, incVotes) => {
  console.log(articleId, incVotes)
  return db.query(`SELECT votes FROM articles WHERE article_id = $1;`, [articleId])
  .then(({rows}) => {
    let {votes} = rows[0]
    votes += incVotes
    return db.query(`
      UPDATE articles
      SET votes = $1
      WHERE article_id = $2
      RETURNING *;
    `, [votes, articleId])
  })
  .then(({rows}) => {
    return rows[0]
  })
  .catch((err) => console.log(err))
}