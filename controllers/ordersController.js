const expressAsyncHandler = require("express-async-handler");
const Order = require("../models/ordersModel");

const placeOrder_post = expressAsyncHandler(async (req, res) => {
  const {
    value: { _id },
  } = req.user;

  const order = req.body;

  try {
    const newOrder = await Order.create({
      orderItems: order.orderItems,
      shippingDetails: order.shippingDetails,
      paymentMethod: order.paymentMethod,
      itemsPrice: order.itemsPrice,
      shippingPrice: order.shippingPrice,
      taxPrice: order.taxPrice,
      totalPrice: order.totalPrice,
      user: _id,
    });

    res.send(newOrder);
  } catch (error) {
    const resErrors = {};
    if (error.errors) {
      const errorObject = Object.keys(error.errors);
      // console.log(errorObject);
      const errorNames = [...errorObject];
      // console.log(errorNames);

      errorNames.forEach((err) => {
        // console.log(error.errors[err].message);
        const splitValues = err.split(".");
        // console.log(splitValues);
        resErrors[splitValues[1]] = error.errors[err].message;
      });
    }
    res.send({ error: resErrors });
  }
});

module.exports = { placeOrder_post };
