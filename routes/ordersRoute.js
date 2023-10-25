const express = require("express");
const { Router } = express;

const ordersRouter = Router();
// middleware
const { isAuth } = require("../middlewares/isAuth");
// order controller
const { placeOrder_post } = require("../controllers/ordersController");

// endpoints
// place order
ordersRouter.post("/order", isAuth, placeOrder_post);
module.exports = { ordersRouter };
