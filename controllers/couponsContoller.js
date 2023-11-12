const expressAsyncHandler = require("express-async-handler");
const Coupon = require("../models/couponsModel");

// post coupon
const coupon_post = expressAsyncHandler(async (req, res) => {
  const coupon = req.body;
  try {
    const newCoupon = await Coupon.create(coupon);
    res.status(201).send({ message: "coupon successfully created" });
  } catch (error) {
    console.log(error);
    res.status(501).send({ error: "coupon not create" });
  }
});
const getCoupon_post = expressAsyncHandler(async (req, res) => {
  const { name: couponName } = req.body;
  // console.log(couponName); //
  try {
    const coupon = await Coupon.findOne({ name: couponName });
    if (coupon) {
      res.status(200).send({ value: coupon.value });
    } else {
      res.status(404).send({ message: "Invalid coupon" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "coupon services not available" });
  }
});

module.exports = { coupon_post, getCoupon_post };
