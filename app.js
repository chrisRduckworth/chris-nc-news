const express = require("express");
const {
  handleServerErrors,
  handleCustomErrors,
  handleSqlErrors,
} = require("./controllers/error-controllers");
const apiRouter = require("./routes/api-router");
const cors = require("cors")

const app = express();

app.use(cors())

app.use(express.json());

app.use("/api", apiRouter);

app.use((_, res) => {
  res.status(404).send({ msg: "Path not found" });
});

app.use(handleCustomErrors);

app.use(handleSqlErrors);

app.use(handleServerErrors);

module.exports = app;
