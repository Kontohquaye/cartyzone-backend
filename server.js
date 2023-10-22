const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");
const PORT = process.env.PORT || 5000;

// import routes
const { productsRouter } = require("./routes/productsRoute");

dotenv.config();

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cors({ origin: process.env.FRONTEND_URL }));

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
app.use("/api", productsRouter);

app.listen(PORT, () => {
  connectToDB();
  console.log(`server started at port ${PORT}`);
});