const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const PORT = process.env.PORT || 5000;

// import routes
const { productsRouter } = require("./routes/productsRoute");
const { usersRouter } = require("./routes/usersRoute");
const { ordersRouter } = require("./routes/ordersRoute");
const couponsRouter = require("./routes/couponsRoute");

dotenv.config();

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(cookieParser());

// database connection
const connectToDB = () => {
  mongoose
    .connect(process.env.MONGODB_URI_LOCAL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((data) => {
      console.log("connected to DB");
    })
    .catch((error) => {
      console.log(error);
    });
};

// endpoind fetch
app.use("/api/products", productsRouter);
app.use("/api/users", usersRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/coupons", couponsRouter);

app.use((err, req, res, next) => {
  console.log(req.path);
  res.status(400).send({ err: err.message });
  next();
});

app.use("*", (req, res, next) => {
  res.status(400).send({ error: "404 Not found" });
  next();
});

app.listen(PORT, () => {
  connectToDB();
  console.log(`server started at port ${PORT}`);
});
