const expressAsyncHandler = require("express-async-handler");

// import models
const Product = require("../models/productModel");

// get all products
const products_get = expressAsyncHandler(async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).send({
      products,
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// seed products
const products_post = expressAsyncHandler(async (req, res) => {
  const products = req.body;
  try {
    const newProducts = await Product.insertMany(products);
    res.status(201).send(newProducts);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
});

// export controllers
module.exports = {
  products_get,
  products_post,
};