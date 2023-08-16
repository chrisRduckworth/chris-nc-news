const apiRouter = require("express").Router();
const articlesRouter = require("./articles-router");

apiRouter.use("/articles", articlesRouter);

module.exports = apiRouter