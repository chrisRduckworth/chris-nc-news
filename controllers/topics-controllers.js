const { fetchTopics } = require("../models/topics-models");

exports.getTopics = (request, response, next) => {
  fetchTopics().then(({ rows }) => {
    response.status(200).send({ topics: rows });
  });
};
