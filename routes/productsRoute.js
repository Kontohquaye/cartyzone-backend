const express = require("express");
const { Router } = express;

// import controllers
const {
  products_get,
  products_post,
  product_get,
} = require("../controllers/productsController");

const productsRouter = Router();

// endpoints
// all products
productsRouter.get("/", products_get);

// single product
productsRouter.get("/:id", product_get);

// seed Products
productsRouter.post("/seed", products_post);

module.exports = { productsRouter };
