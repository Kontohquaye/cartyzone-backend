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
    res.cookie(`cartyzone`, generateToken(newUser), {
      maxAge: maxAge,
      httpOnly: true,
    });
    res.send({
      user: {
        username: newUser.username,
        isAdmin: newUser.isAdmin,
        id: newUser._id,
        token: generateToken(newUser),
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

const update_post = expressAsyncHandler(async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    // console.log(user.password);
    if (user) {
      // console.log(user);
      const isAuth = await bcrypt.compare(req.body.password, user.password);
      console.log(isAuth);
      if (isAuth) {
        user.password = req.body.newPassword;
        if (req.body.username) {
          user.username = req.body.username;
          await user.save();
        } else {
          await user.save();
        }
        if (isAuth && req.body.password && req.body.username) {
          res.status(200).send({ message: "details updated successfully" });
        } else {
          res.status(200).send({ message: "Password updated successfully" });
        }
      } else {
        res.status(400).send({ message: "invalid password" });
      }
    } else {
      res.status(400).send({ message: "Invalid email" });
    }
  } catch (err) {
    console.log(err);
    res
      .status(400)
      .send({ message: "username should be at least 4 characters and 14 max" });
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
        res.cookie(`cartyzone`, generateToken(user), {
          maxAge: maxAge,
          httpOnly: true,
        });
        res.cookie(`cartysign`, "account created", {
          maxAge: maxAge,
        });

        // send response
        res.status(200).send({
          user: {
            username: user.username,
            id: user._id,
            isAdmin: user.isAdmin,
            token: generateToken(user),
          },
        });
      } else {
        res.status(401).send({ error: { password: "password is incorrect" } });
      }
      //
    } else {
      res.status(401).send({ error: { email: "invalid email" } });
    }
  } catch (error) {
    // console.log(error);
    res.send({ error });
  }
});

module.exports = { signup_post, signin_post, update_post };
