const express = require("express");
const { Router } = express;

// import controllers
const {
  products_get,
  products_post,
  product_get,
  productsCategory_get,
  productsSearch_get,
} = require("../controllers/productsController");

const productsRouter = Router();

// endpoints
// all products
productsRouter.get("/", products_get);

// search products
productsRouter.get("/search/products/query", productsSearch_get);

// category
productsRouter.get("/categories/get", productsCategory_get);

// single product
productsRouter.get("/:id", product_get);

// seed Products
productsRouter.post("/seed", products_post);

module.exports = { productsRouter };
