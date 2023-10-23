const expressAsyncHandler = require("express-async-handler");
const User = require("../models/usersModel");
const bcrypt = require("bcrypt");
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

// signup
const signin_post = expressAsyncHandler(async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email });
    if (user) {
      const passwordIsValid = await bcrypt.compare(password, user.password);
      if (passwordIsValid) {
        // set cookies
        const maxAge = 3 * 24 * 60 * 60 * 1000;
        res.cookie(`account-${user.username}-czone`, generateToken(user), {
          maxAge: maxAge,
          httpOnly: true,
        });

        // send response
        res
          .status(200)
          .send({ user: { username: user.username, isAdmin: user.isAdmin } });
      } else {
        res.status(401).send({ error: { password: "password is incorrect" } });
      }
      //
    } else {
      res.status(401).send({ error: { email: "invalid email" } });
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = { signup_post, signin_post };
