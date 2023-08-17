const { deleteComment, patchComment } = require("../controllers/comments-controllers");

const commentRouter = require("express").Router();

commentRouter
  .route("/:comment_id")
  .patch(patchComment)
  .delete(deleteComment);

module.exports = commentRouter;
