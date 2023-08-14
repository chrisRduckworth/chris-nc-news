const express = require("express");
const { getEndpoints } = require("./controllers/api-controllers");
const { getTopics } = require("./controllers/topics-controllers");
const {
  getArticleById,
  getArticles,
} = require("./controllers/articles-controllers");
const { getCommentsByArticle} = require("./controllers/comments-controllers")
const {
  handleServerErrors,
  handleCustomErrors,
  handleSqlErrors,
} = require("./errors");

const app = express();

app.get("/api", getEndpoints);

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles/:article_id/comments", getCommentsByArticle)

app.use(handleCustomErrors);

app.use(handleSqlErrors);

app.use(handleServerErrors);

module.exports = app;
