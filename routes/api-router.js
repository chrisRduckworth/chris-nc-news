const { getEndpoints } = require("../controllers/api-controllers");
const articleRouter = require("./articles-router");
const commentRouter = require("./comments-router");
const topicRouter = require("./topics-router");
const userRouter = require("./users-router");

const apiRouter = require("express").Router();

apiRouter.get("/", getEndpoints);

apiRouter.use("/articles", articleRouter);

apiRouter.use("/comments", commentRouter);

apiRouter.use("/users", userRouter);

apiRouter.use("/topics", topicRouter);

module.exports = apiRouter;
