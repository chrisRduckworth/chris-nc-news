const { getUsers, getUser } = require("../controllers/users-controllers");

const userRouter = require("express").Router();

userRouter.get("/", getUsers);

userRouter.get("/:username", getUser)

module.exports = userRouter;
