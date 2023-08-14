const express = require("express");
const { getTopics } = require("./controllers/topics-controllers");
const { getArticleById } = require("./controllers/articles-controllers");
const {
  handleServerErrors,
  handleCustomErrors,
  handleSqlErrors,
} = require("./errors");

const app = express();

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById);

app.use(handleCustomErrors);

app.use(handleSqlErrors);

app.use(handleServerErrors);

module.exports = app;
