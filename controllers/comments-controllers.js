const { fetchCommentsByArticle } = require("../models/comments-models");

exports.getCommentsByArticle = (req, res, next) => {
  const { article_id } = req.params;
  fetchCommentsByArticle(article_id).then((comments) => {
    res.status(200).send({ comments });
  })
  .catch(next)
};
