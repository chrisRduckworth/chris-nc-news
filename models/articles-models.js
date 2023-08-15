const db = require("../db/connection");
const { checkExists } = require("../utils/utils");

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

exports.fetchArticles = (topic, sortBy = "date") => {
  const queries = [];
  const sortByLookup = {
    author: "articles.author",
    title: 'title',
    article_id: "articles.article_id",
    topic: 'topic',
    date: "articles.created_at",
    votes: "articles.votes",
    article_img_url: 'article_img_url',
    comment_count: 'comment_count',
  };

  if (!Object.keys(sortByLookup).includes(sortBy)) {
    return Promise.reject({
      status: 400,
      msg: "Invalid Sort Query",
    });
  }
  sortBy = sortByLookup[sortBy];

  let queryStr = `
    SELECT 
        articles.author, 
        title, 
        articles.article_id, 
        topic, 
        articles.created_at, 
        articles.votes, 
        article_img_url, 
        COUNT(comment_id) AS comment_count
      FROM articles
      LEFT OUTER JOIN comments ON articles.article_id = comments.article_id`;
  if (topic) {
    queryStr += ` WHERE topic LIKE $1`;
    queries.push(topic);
  }
  queryStr += `
    GROUP BY articles.article_id
    ORDER BY ${sortBy} DESC;`;

  return db.query(queryStr, queries).then(({ rows }) => {
    rows.forEach(({ comment_count }) => {
      comment_count = parseInt(comment_count);
    });
    return rows;
  });
};

exports.updateArticleVotes = (articleId, incVotes) => {
  return checkExists("articles", "article_id", articleId)
    .then(() => {
      return db.query(
        `UPDATE articles
        SET votes = votes + $1
        WHERE article_id = $2
        RETURNING *`,
        [incVotes, articleId]
      );
    })
    .then(({ rows }) => {
      return rows[0];
    });
};
