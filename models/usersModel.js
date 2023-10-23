const mongoose = require("mongoose");
const { isEmail } = require("validator");
const { Schema } = mongoose;
const bcrypt = require("bcrypt");

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "please enter username"],
      minlength: [4, " name should be at leasat 4 characters long"],
      maxlength: [14, " name should not exceed 14 characters"],
    },
    email: {
      type: String,
      required: [true, "please enter email"],
      unique: true,
      lowercase: true,
      validate: [isEmail, "please enter valid email"],
    },
    password: {
      type: String,
      minlength: [6, "minimum password length is 6 characters"],
      required: [true, "please enter password"],
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  try {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    console.log(error);
  }
});

const User = mongoose.model("user", userSchema);
module.exports = User;
