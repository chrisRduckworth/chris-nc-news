const db = require("../db/connection");

exports.fetchUsers = () => {
  return db.query(`SELECT * FROM users;`).then(({ rows }) => rows);
};

exports.fetchUser = (username) => {
  return db.query(`
  SELECT * FROM users
  WHERE username = $1`, [username])
  .then(({rows}) => rows[0])
}