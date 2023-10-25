const express = require("express");
const { Router } = express;

const couponsRouter = Router();
// controllers
const {
  coupon_post,
  getCoupon_post,
} = require("../controllers/couponsContoller");
// endpoints
couponsRouter.post("/add", coupon_post);
couponsRouter.post("/coupon/use", getCoupon_post);

module.exports = couponsRouter;
