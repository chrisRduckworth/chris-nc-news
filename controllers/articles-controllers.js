const {
  fetchArticleById,
  fetchArticles,
  updateArticleVotes,
} = require("../models/articles-models");
const { checkExists } = require("../utils/utils");

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.getArticles = (req, res, next) => {
  fetchArticles()
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.patchArticleVotes = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  const promises = [updateArticleVotes(article_id, inc_votes), checkExists("articles", "article_id", article_id)]
  Promise.all(promises)
    .then((result) => {
      res.status(200).send({article: result[0]})
    })
    .catch(next);
};
