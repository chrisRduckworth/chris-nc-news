const {
  fetchCommentsByArticle,
  createComment,
  removeComment,
  updateComment,
  fetchComments,
} = require("../models/comments-models");

exports.getCommentsByArticle = (req, res, next) => {
  const { article_id } = req.params;
  const { limit, p } = req.query;
  fetchCommentsByArticle(article_id, limit, p)
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

exports.patchComment = (req, res, next) => {
  const { comment_id } = req.params;
  const { inc_votes } = req.body;
  updateComment(comment_id, inc_votes)
    .then((comment) => {
      res.status(200).send({ comment });
    })
    .catch(next);
};

exports.getComments = (req, res, next) => {
  const { limit } = req.query;
  fetchComments(limit)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};
