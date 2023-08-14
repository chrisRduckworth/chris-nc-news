const { fetchTopics } = require("../models/topics-models");

exports.getTopics = (req, res, next) => {
  fetchTopics()
    .then(({ rows }) => {
      res.status(200).send({ topics: rows });
    })
    .catch(next);
};
