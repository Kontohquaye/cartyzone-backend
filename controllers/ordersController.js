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
    console.log(error);
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
    res.status(401).send({ error: resErrors });
  }
});

// get order

const getOrder = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const userOrder = await Order.find(
      { _id: id },
      "-user -_id -__v -orderItems._id"
    );

    res.status(200).send({ ...userOrder });
  } catch (error) {
    res.status(401).send({ error: "unauthorized access" });
  }
});

const payOrder_put = expressAsyncHandler(async (req, res) => {
  const { id, status, update_time, email_address } = req.body;
  try {
    const order = await Order.findById(req.params.id);
    // console.log({ order: { id, status, update_time, email_address } });
    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResults = {
        id: id,
        status: status,
        update_time: update_time,
        email_address: email_address,
      };
      const updatedOrder = await order.save();
      console.log(updatedOrder);
      res.send({ message: "order paid" });
    } else {
      res.status(404).send({ message: "order doesn't exist" });
    }
  } catch (err) {
    console.log(err);
    res.status(400).send({ message: "payment request failed" });
  }
});

// search order
const searchOrder_get = expressAsyncHandler(async (req, res) => {
  const { q } = req.query;
  try {
    const order = await Order.findById(q);
    if (order) {
      res.status(200).send({ order });
    } else {
      res.status(401).send({ error: "no order matched the query" });
    }
  } catch (err) {
    console.log(err);
    res.status(401).send({ error: "Invalid order id" });
  }
});
// delete
const deleteOrder = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    await Order.findByIdAndDelete(id);

    res.status(200).send({ message: "order deleted" });
  } catch (error) {
    console.log(error);
    // res.status(401).send({ error: "unauthorized access" });
    res.status(501).send({ error: "server error" });
  }
});

// get userorders
const getOrders_post = expressAsyncHandler(async (req, res) => {
  const { user } = req.body;
  try {
    const userOrders = await Order.find({ user: user })
      .select("_id date totalPrice isPaid isDelivered")
      .sort({ _id: -1 });

    res.status(200).send({ orders: userOrders });
  } catch (error) {
    res.status(401).send({ error: "Unauthorized access sign in" });
  }
});

module.exports = {
  placeOrder_post,
  getOrder,
  deleteOrder,
  getOrders_post,
  searchOrder_get,
  payOrder_put,
};
