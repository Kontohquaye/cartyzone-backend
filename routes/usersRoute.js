const express = require("express");
const { Router } = express;
const { isAuth } = require("../middlewares/isAuth");

const usersRouter = Router();

// controllers
const {
  signup_post,
  signin_post,
  update_post,
} = require("../controllers/usersController");

// endpoints
// sign up
usersRouter.post("/signup", signup_post);
usersRouter.post("/account/signin", signin_post);
usersRouter.post("/account/details/update", isAuth, update_post);

module.exports = { usersRouter };
