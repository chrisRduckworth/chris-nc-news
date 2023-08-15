const {
  fetchCommentsByArticle,
  createComment,
  removeComment,
} = require("../models/comments-models");

exports.getCommentsByArticle = (req, res, next) => {
  const { article_id } = req.params;
  fetchCommentsByArticle(article_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postComment = (req, res, next) => {
  const { body } = req;
  const { article_id } = req.params;
  createComment(body, article_id)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};

exports.deleteComment = (req, res, next) => {
  const { comment_id } = req.params;
  removeComment(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
};
