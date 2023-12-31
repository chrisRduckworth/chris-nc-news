const {
  getArticles,
  getArticleById,
  patchArticleVotes,
  postArticle,
  deleteArticle,
} = require("../controllers/articles-controllers");
const {
  getCommentsByArticle,
  postComment,
} = require("../controllers/comments-controllers");

const articleRouter = require("express").Router();

articleRouter.route("/").get(getArticles).post(postArticle);

articleRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchArticleVotes)
  .delete(deleteArticle);

articleRouter
  .route("/:article_id/comments")
  .get(getCommentsByArticle)
  .post(postComment);

module.exports = articleRouter;
