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
      discount: order.discount,
      date: order.date,
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

// get order

const getOrder = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    const userOrder = await Order.find(
      { _id: id },
      "-user -_id -__v -orderItems._id"
    );

    res.status(200).send({ order: userOrder });
  } catch (error) {
    res.status(401).send({ error: "unauthorized access" });
  }
});

// get userorders
const getOrders_post = expressAsyncHandler(async (req, res) => {
  const { user } = req.body;
  try {
    const userOrders = await Order.find({ user: user }).select(
      "_id date totalPrice isPaid isDelivered"
    );

    res.status(200).send({ orders: userOrders });
  } catch (error) {
    res.status(401).send({ error: "Unauthorized access sign in" });
  }
});

module.exports = { placeOrder_post, getOrder, getOrders_post };
