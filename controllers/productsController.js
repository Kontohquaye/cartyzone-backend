const expressAsyncHandler = require("express-async-handler");

// import models
const Product = require("../models/productsModel");

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

const product_get = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    res.status(200).send({ product });
  } catch (error) {
    console.log(error);
    res.status(404).send({ error: error.message });
  }
});

const productsCategory_get = expressAsyncHandler(async (req, res) => {
  try {
    const categories = await Product.find().distinct("category");
    if (categories) {
      // console.log(categories);
      res.status(200).send(categories);
    }
  } catch (err) {
    res.status(400).send({ message: "server error" });
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
  product_get,
  products_post,
  productsCategory_get,
};
