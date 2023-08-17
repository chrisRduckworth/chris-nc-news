const db = require("../db/connection");

exports.fetchTopics = () => {
  return db.query(`SELECT * FROM topics;`).then(({ rows }) => {
    return rows;
  });
};

exports.createTopic = (topic) => {
  const { slug, description } = topic;
  return db
    .query(
      `INSERT INTO topics
      (slug, description)
      VALUES
      ($1, $2)
      RETURNING *;`,
      [slug, description]
    )
    .then(({ rows }) => rows[0]);
};
