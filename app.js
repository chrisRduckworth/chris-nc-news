const express = require("express");
const { getEndpoints } = require("./controllers/api-controllers");
const { getTopics } = require("./controllers/topics-controllers");
const {
  getArticleById,
  getArticles,
  patchArticleVotes,
} = require("./controllers/articles-controllers");
const { getCommentsByArticle,postComment } = require("./controllers/comments-controllers");
const {
  handleServerErrors,
  handleCustomErrors,
  handleSqlErrors,
} = require("./controllers/error-controllers");

const app = express();

app.use(express.json())

app.get("/api", getEndpoints);

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles/:article_id/comments", getCommentsByArticle);

app.post("/api/articles/:article_id/comments", postComment);

app.patch("/api/articles/:article_id", patchArticleVotes)

app.use((_, res) => {
  res.status(404).send({ msg: "Path not found" });
});


app.use(handleCustomErrors);

app.use(handleSqlErrors);

app.use(handleServerErrors);

module.exports = app;
