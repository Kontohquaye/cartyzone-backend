const mongoose = require("mongoose");
const { Schema } = mongoose;

const couponsSchema = new Schema({
  name: { type: String, required: true },
  value: { type: Number, required: true },
  description: { type: String, required: true },
});

const Coupon = mongoose.model("coupon", couponsSchema);
module.exports = Coupon;
// remember to add create coupon for admins!!
