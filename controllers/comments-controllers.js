const {
  fetchCommentsByArticle,
  createComment,
} = require("../models/comments-models");
const { checkExists } = require("../utils/utils");

exports.getCommentsByArticle = (req, res, next) => {
  const { article_id } = req.params;
  const promises = [
    fetchCommentsByArticle(article_id),
    checkExists("articles", "article_id", article_id),
  ];
  Promise.all(promises)
    .then((resolvedPromises) => {
      res.status(200).send({ comments: resolvedPromises[0] });
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