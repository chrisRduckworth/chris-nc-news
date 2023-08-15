const { fetchUsers } = require("../models/users-models");

exports.getUsers = () => {
  console.log("in controller");
  fetchUsers();
};
