exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  }
  next(err);
};

exports.handleSqlErrors = (err, req, res, next) => {
  const badReqErrors = ["22P02", "23502", "23503", "42601", "23505"];
  if (badReqErrors.includes(err.code)) {
    res.status(400).send({ msg: "Bad Request" });
  }
  next(err);
};

exports.handleServerErrors = (err, req, res, next) => {
  res.status(500).send({ msg: "Internal Server Error" });
};
