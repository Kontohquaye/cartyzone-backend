const expressAsyncHandler = require("express-async-handler");
const User = require("../models/usersModel");
// cookie generator
const generateToken = require("../utils/generator");

const signup_post = expressAsyncHandler(async (req, res) => {
  const { username, email, password, isAdmin } = req.body;
  //   error handling
  const errorsMessages = { email: "", password: "", username: "" };

  try {
    const newUser = await User.create({ username, email, password, isAdmin });
    // console.log(newUser);
    const maxAge = 2 * 24 * 60 * 60 * 1000;
    res.cookie(`account-${newUser.username}-czone`, generateToken(newUser), {
      maxAge: maxAge,
      httpOnly: true,
    });
    res.send({
      user: {
        username: newUser.username,
        isAdmin: newUser.isAdmin,
      },
    });
  } catch (error) {
    // console.log(error);
    // error handling
    if (error.code !== 11000 && error.errors) {
      const { errors } = error;
      let username, email, password;
      //   const { username, email, password } = errors;
      if (errors.username) {
        username = errors.username;
      }
      if (errors.email) {
        email = errors.email;
      }
      if (errors.password) {
        password = errors.password;
      }

      // set errorMessages
      if (username) {
        errorsMessages.username = username.message;
      }
      if (password) {
        errorsMessages.password = password.message;
      }
      if (email) {
        errorsMessages.email = email.message;
      }
    } else {
      errorsMessages.email = `${error.keyValue.email} exists`;
    }
    // console.log(errorsMessages);

    res.status(400).send(errorsMessages);
  }
});

module.exports = { signup_post };
