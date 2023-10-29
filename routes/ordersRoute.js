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
  deleteOrder,
  searchOrder_get,
} = require("../controllers/ordersController");

// endpoints
// place order
ordersRouter.post("/order", isAuth, placeOrder_post);
ordersRouter.delete("/order/get/:id", deleteOrder);
ordersRouter.get("/order/get/:id", isAuth, getOrder);
ordersRouter.get("/order/search/details/get", isAuth, searchOrder_get);
ordersRouter.post("/user/all", isAuth, getOrders_post);
module.exports = { ordersRouter };
