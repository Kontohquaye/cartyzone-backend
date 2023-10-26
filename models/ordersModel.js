const { isEmail } = require("validator");
const mongoose = require("mongoose");
const { Schema } = mongoose;

const orderSchema = new Schema(
  {
    orderItems: [
      {
        slug: { type: String, required: true },
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
      },
    ],
    date: { type: Date, required: true },
    shippingDetails: {
      firstName: { type: String, required: [true, "please enter firstname "] },
      lastName: { type: String, required: [true, "please enter lastname"] },
      phone: { type: String, required: [true, "please provide phone number"] },
      email: { type: String, validate: [isEmail, "email is invalid"] },
      address: { type: String, required: [true, "please provide address"] },
      city: { type: String, required: [true, "please provide city "] },
      postalCode: {
        type: String,
        required: [true, "please provide postal code "],
      },
      country: { type: String, required: [true, "please provide country "] },
    },
    paymentResults: {
      id: String,
      status: String,
      update_time: String,
      email_address: String,
    },

    itemsPrice: { type: Number, required: true },
    shippingPrice: { type: Number, required: true },
    taxPrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    discount: { type: Number, required: true },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },
    isDelivered: { type: Boolean, default: false },
    deliveredAt: { type: Date },
  },
  { timestamp: true }
);

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
