exports.handleCustomErrors = (err, req, res, next) => {
  res.status(err.status).send({ msg: err.msg });
};

exports.handleSqlErrors = (err, req, res, next) => {
  if ((err.code = "22P02")) {
    res.status(400).send({ msg: "Invalid Id" });
  }
  next(err);
};

exports.handleServerErrors = (err, req, res, next) => {
  if (err.status) {
    res.status(500).send({ msg: "Internal Server Error" });
  }
  next(err);
};
