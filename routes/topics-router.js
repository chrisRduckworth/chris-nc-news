const { getTopics } = require("../controllers/topics-controllers");

const topicRouter = require("express").Router();

topicRouter.get("/", getTopics);

module.exports = topicRouter;
