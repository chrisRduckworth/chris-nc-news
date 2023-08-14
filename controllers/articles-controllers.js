const { fetchArticleById } = require("../models/articles-models");

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticleById(article_id)
    .then((data) => {
      res.status(200).send({ article: data });
    })
    .catch(next);
};