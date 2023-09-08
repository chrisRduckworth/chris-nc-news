const { deleteComment, patchComment, getComments } = require("../controllers/comments-controllers");

const commentRouter = require("express").Router();

commentRouter.route("/").get(getComments)

commentRouter
  .route("/:comment_id")
  .patch(patchComment)
  .delete(deleteComment);

module.exports = commentRouter;
