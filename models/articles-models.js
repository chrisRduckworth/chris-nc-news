const db = require("../db/connection");
const format = require("pg-format");
const { checkExists } = require("../utils/utils");

exports.fetchArticleById = (articleId) => {
  return db
    .query(
      `SELECT 
        articles.author, 
        title, 
        articles.article_id, 
        articles.body,
        topic, 
        articles.created_at, 
        articles.votes, 
        article_img_url, 
        COUNT(comment_id) AS comment_count
      FROM articles
      LEFT OUTER JOIN comments ON articles.article_id = comments.article_id
      WHERE articles.article_id = $1
      GROUP BY articles.article_id;
    `,
      [articleId]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "Not Found",
        });
      }
      const article = rows[0];
      const { comment_count } = article;
      article.comment_count = parseInt(comment_count);
      return article;
    });
};

exports.fetchArticles = (
  topic,
  sortBy = "date",
  order = "desc",
  limit = 10,
  page = 1
) => {
  const queries = [];
  const sortByLookup = {
    author: "articles.author",
    title: "title",
    article_id: "articles.article_id",
    topic: "topic",
    date: "articles.created_at",
    votes: "articles.votes",
    article_img_url: "article_img_url",
    comment_count: "comment_count",
  };

  if (!Object.keys(sortByLookup).includes(sortBy)) {
    return Promise.reject({
      status: 400,
      msg: "Invalid Sort Query",
    });
  }
  sortBy = sortByLookup[sortBy];

  if (!["asc", "desc"].includes(order)) {
    return Promise.reject({
      status: 400,
      msg: "Invalid Order Query",
    });
  }

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
    ORDER BY ${sortBy} ${order};`;

  return db.query(queryStr, queries).then(({ rows }) => {
    rows.forEach(({ comment_count }) => {
      comment_count = parseInt(comment_count);
    });
    const startIndex = limit * (page - 1);
    const endIndex = startIndex + limit;
    return [rows.slice(startIndex, endIndex), rows.length];
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

exports.createArticle = (body) => {
  const { topic } = body;
  return db
    .query("SELECT * FROM topics WHERE slug = $1", [topic])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return db.query(
          `
          INSERT INTO topics
          (slug)
          VALUES
          ($1);`,
          [topic]
        );
      }
    })
    .then(() => {
      let queryStr = `
        INSERT INTO articles
        (author, title, body, topic`;
      if (body.article_img_url) {
        queryStr += ", article_img_url";
      }
      queryStr += `)
        VALUES %L
        RETURNING *;`;

      const values = [Object.values(body)];

      const formattedQuery = format(queryStr, values);
      return db.query(formattedQuery);
    })
    .then(({ rows }) => {
      rows[0].comment_count = 0;
      return rows[0];
    });
};

exports.removeArticle = (articleId) => {
  return checkExists("articles", "article_id", articleId)
    .then(() => {
      return db.query("DELETE FROM comments WHERE article_id = $1;", [
        articleId,
      ]);
    })
    .then(() => {
      return db.query("DELETE FROM articles WHERE article_id = $1", [
        articleId,
      ]);
    });
};
