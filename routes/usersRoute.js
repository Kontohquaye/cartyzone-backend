const express = require("express");
const { Router } = express;

const usersRouter = Router();

// controllers
const { signup_post, signin_post } = require("../controllers/usersController");

// endpoints
// sign up
usersRouter.post("/signup", signup_post);
usersRouter.post("/account/signin", signin_post);

module.exports = { usersRouter };
