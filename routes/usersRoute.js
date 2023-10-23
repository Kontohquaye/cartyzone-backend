const express = require("express");
const { Router } = express;

const usersRouter = Router();

// controllers
const { signup_post } = require("../controllers/usersController");

// endpoints
// sign up
usersRouter.post("/signup", signup_post);

module.exports = { usersRouter };
