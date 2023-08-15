const { fetchCommentsByArticle } = require("../models/comments-models");
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
