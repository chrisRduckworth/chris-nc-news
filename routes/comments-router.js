const { deleteComment } = require("../controllers/comments-controllers");

const commentRouter = require("express").Router();

commentRouter.delete("/:comment_id", deleteComment);

module.exports = commentRouter;
