const { fetchTopics } = require("../models/topics-models");

exports.getTopics = (req, res, next) => {
  fetchTopics()
    .then((data) => {
      res.status(200).send({ topics: data });
    })
    .catch(next);
};
