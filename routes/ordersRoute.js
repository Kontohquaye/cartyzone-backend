const express = require("express");
const { Router } = express;

const ordersRouter = Router();
// middleware
const { isAuth } = require("../middlewares/isAuth");
// order controller
const {
  placeOrder_post,
  getOrders_post,
  getOrder,
} = require("../controllers/ordersController");

// endpoints
// place order
ordersRouter.post("/order", isAuth, placeOrder_post);
ordersRouter.get("/order/get/:id", isAuth, getOrder);
ordersRouter.post("/user/all", isAuth, getOrders_post);
module.exports = { ordersRouter };
