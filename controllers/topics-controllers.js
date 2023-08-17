const { fetchTopics, createTopic } = require("../models/topics-models");

exports.getTopics = (req, res, next) => {
  fetchTopics()
    .then((data) => {
      res.status(200).send({ topics: data });
    })
    .catch(next);
};

exports.postTopic = (req, res, next) => {
  const { body } = req;
  createTopic(body)
    .then((topic) => {
      res.status(201).send({ topic });
    })
    .catch(next);
};
