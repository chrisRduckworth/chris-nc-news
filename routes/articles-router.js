const articlesRouter = require("express").Router();
const { getArticles } = require("../controllers/articles-controllers");

articlesRouter.get("/", getArticles);

module.exports = articlesRouter